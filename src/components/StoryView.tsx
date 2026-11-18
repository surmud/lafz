"use client";
import { useEffect, useRef, useState } from "react";
import type { Phrase, Story } from "@/content/schema";
import { completeLesson } from "@/engine/progress";
import { introduce } from "@/engine/review";
import { storyTokens } from "@/engine/story";
import type { XpBreakdown } from "@/engine/xp";
import { blip, playToEnd, stopAudio } from "@/lib/audio";
import { useCast } from "@/lib/cast";
import { mark } from "@/lib/e2e";
import { useSettings } from "@/lib/settings";
import { today, useStore } from "@/lib/store";
import { track } from "@/lib/telemetry";
import { Avatar } from "./Avatar";
import { Nastaliq } from "./Phrase";
import { Button, LinkButton, TopBar } from "./ui";

type Line = { speaker?: string; phrase: Phrase };

/**
 * A story, one line at a time. Speak mode: hear each line first, text on request. Read mode: the
 * Nastaliq first, Roman and English on request. Any Roman word can be tapped for its meaning.
 */
export function StoryView({
  unitId,
  unitTitle,
  story,
  glossary,
  wordIds,
}: {
  unitId: string;
  unitTitle: string;
  story: Omit<Story, "lines"> & { lines: Line[] };
  glossary: Record<string, string>;
  /** Roman word → course phrase id: tapping one of these adds it to the review deck. */
  wordIds: Record<string, string>;
}) {
  const { mode } = useSettings();
  // Reading-track stories are always script-first, whatever the mode.
  const read = mode === "read" || unitId.startsWith("r");
  const cast = useCast();
  const { update, progress } = useStore();
  const [shown, setShown] = useState(1);
  const [reveal, setReveal] = useState<Record<number, boolean>>({});
  const [word, setWord] = useState<{ line: number; i: number } | null>(null);
  const [stage, setStage] = useState<"story" | "questions" | "done">("story");
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [xp, setXp] = useState<XpBreakdown | null>(null);
  const t0 = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);
  // "Play all": a run id, so tapping again (or leaving) stops the loop.
  const run = useRef(0);
  const [playingAll, setPlayingAll] = useState(false);
  const tapWord = (line: number, i: number, key: string) => {
    if (word?.line === line && word.i === i) return setWord(null);
    setWord({ line, i });
    const id = wordIds[key];
    if (id && !progress.review[id]) void update((p) => ({ ...p, review: introduce(p.review, [id], today()) }));
  };

  const say = (i: number) => {
    const l = story.lines[i];
    if (l) void playToEnd({ ...l.phrase, speaker: l.speaker });
  };
  useEffect(() => {
    t0.current = Date.now();
    const r = run;
    return () => {
      r.current++;
      stopAudio();
    };
  }, []);
  // In Speak mode each new line plays as it appears (unless "Play all" is doing the playing).
  useEffect(() => {
    if (stage !== "story") return;
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (!read && !playingAll) say(shown - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, stage]);

  const playAll = async () => {
    if (playingAll) {
      run.current++;
      stopAudio();
      setPlayingAll(false);
      return;
    }
    const me = ++run.current;
    setPlayingAll(true);
    for (let i = 0; i < story.lines.length; i++) {
      if (run.current !== me) return;
      const l = story.lines[i]!;
      setShown((n) => Math.max(n, i + 1));
      await playToEnd({ ...l.phrase, speaker: l.speaker });
      await new Promise((r) => setTimeout(r, 450));
    }
    if (run.current === me) setPlayingAll(false);
  };

  const finish = async (correct: number) => {
    blip("done");
    const seconds = (Date.now() - t0.current) / 1000;
    let gained: XpBreakdown = { base: 0, comeback: 0, total: 0 };
    const n = story.questions.length;
    await update((p) => {
      const r = completeLesson(p, {
        lessonId: `${unitId}-story`,
        kind: "lesson",
        stats: { exercises: n, firstTry: correct, comebacks: 0, mistakes: n - correct, skipped: 0, letGo: 0 },
        practised: [],
        missed: [],
        seconds,
        today: today(),
        tally: { [read ? "reading" : "listening"]: { seen: n, right: correct } },
      });
      gained = r.xp;
      return r.progress;
    });
    track("story", { id: unitId, acc: n ? correct / n : undefined, secs: Math.round(seconds) });
    setXp(gained);
    setStage("done");
  };

  if (stage === "done") {
    return (
      <>
        <TopBar back={`/unit/${unitId}/`} title={story.title} />
        <main className="flex flex-col items-center gap-4 px-6 pt-8 text-center">
          <p className="text-6xl" aria-hidden>
            {story.emoji}
          </p>
          <h1 className="font-display text-3xl font-bold">Story finished</h1>
          <p className="text-lg text-ink-soft">
            {right} of {story.questions.length} questions right · +{xp?.total ?? 0} XP
          </p>
          <p className="text-ink-soft">{read ? "You read a whole story in Urdu script." : "You followed a whole story in Urdu."}</p>
          <Button variant="secondary" block onClick={() => { setStage("story"); setShown(story.lines.length); setReveal({}); }}>
            Read it again
          </Button>
          <LinkButton href={`/unit/${unitId}/`} block>
            Back to {unitTitle}
          </LinkButton>
        </main>
      </>
    );
  }

  if (stage === "questions") {
    const question = story.questions[q]!;
    const answered = picked !== null;
    return (
      <>
        <TopBar back={`/unit/${unitId}/`} title={story.title} />
        <main className="flex flex-col gap-4 px-4 pb-32">
          <p className="text-sm font-bold text-ink-soft">
            Question {q + 1} of {story.questions.length}
          </p>
          <h1 className="font-display text-2xl font-bold">{question.question}</h1>
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Answers">
            {question.options.map((o, i) => {
              const isAnswer = i === question.answer;
              let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
              if (answered && isAnswer) tone = "border-good bg-good-soft";
              if (answered && picked === i && !isAnswer) tone = "border-bad bg-bad-soft animate-shake";
              return (
                <button
                  key={o.text}
                  type="button"
                  role="radio"
                  aria-checked={picked === i}
                  disabled={answered}
                  {...mark(isAnswer)}
                  onClick={() => {
                    setPicked(i);
                    blip(isAnswer ? "right" : "wrong");
                    if (isAnswer) setRight((r) => r + 1);
                  }}
                  className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold ${tone}`}
                >
                  {o.text}
                </button>
              );
            })}
          </div>
          {answered ? (
            <p className="rounded-2xl bg-surface-2 p-3 text-[15px]">
              {picked === question.answer ? "Right." : question.options[picked]?.feedback ?? `It was: ${question.options[question.answer]?.text}.`}
            </p>
          ) : null}
        </main>
        <footer className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t-2 border-line bg-bg p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            block
            disabled={!answered}
            onClick={() => {
              setPicked(null);
              if (q + 1 < story.questions.length) setQ(q + 1);
              else void finish(right);
            }}
          >
            Continue
          </Button>
        </footer>
      </>
    );
  }

  const done = shown >= story.lines.length;
  return (
    <>
      <TopBar back={`/unit/${unitId}/`} title={`${story.emoji} ${story.title}`} />
      <main className="flex flex-col gap-3 px-4 pb-36">
        <p className="text-ink-soft">{story.blurb}</p>
        <p className="text-xs font-bold text-ink-soft">
          {read ? "Read mode: try the Urdu script first. Tap a line to check." : "Speak mode: listen first. Tap a line to see it."} Tap any word for its meaning.
        </p>
        {story.lines.slice(0, shown).map((l, i) => {
          const c = l.speaker ? cast(l.speaker) : null;
          const open = reveal[i] ?? false;
          const tokens = storyTokens(l.phrase.roman, glossary);
          return (
            <div key={i} className={`flex items-start gap-2 ${c ? "" : "pl-1"}`}>
              {c ? <Avatar character={c} size="sm" /> : <span className="mt-2 text-lg" aria-hidden>📖</span>}
              <div className={`min-w-0 flex-1 rounded-2xl p-3 ${c ? "bg-surface" : "bg-surface-2/60 italic"}`}>
                {c ? <p className="text-xs font-black text-ink-soft not-italic">{c.name}</p> : null}
                {read || open ? (
                  <button type="button" className="block w-full text-right" onClick={() => setReveal((r) => ({ ...r, [i]: !open }))} aria-label={`Line ${i + 1}: ${open ? "hide" : "show"} Roman and English`}>
                    <Nastaliq className="text-2xl leading-[2.2] not-italic">{l.phrase.urdu}</Nastaliq>
                  </button>
                ) : null}
                {open || !read ? (
                  open ? (
                    <p className="flex flex-wrap gap-x-1 text-lg font-bold not-italic">
                      {tokens.map((t, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => tapWord(i, j, t.key)}
                          className={`rounded px-0.5 underline decoration-dotted decoration-ink-soft/50 underline-offset-4 ${word?.line === i && word.i === j ? "bg-accent-soft" : ""}`}
                        >
                          {t.text}
                        </button>
                      ))}
                    </p>
                  ) : (
                    <button type="button" onClick={() => setReveal((r) => ({ ...r, [i]: true }))} className="min-h-10 text-left font-bold text-ink-soft not-italic">
                      🔊 · · · <span className="text-sm underline">show text</span>
                    </button>
                  )
                ) : null}
                {word?.line === i && open ? (
                  <p className="mt-1 rounded-xl bg-accent-soft px-2 py-1 text-sm not-italic" role="status">
                    <strong>{tokens[word.i]?.text.replace(/[^\p{L}'-]/gu, "")}</strong>: {tokens[word.i]?.gloss ?? "no note for this word yet"}
                    {wordIds[tokens[word.i]?.key ?? ""] ? <span className="text-ink-soft"> · in your review deck</span> : null}
                  </p>
                ) : null}
                {open ? <p className="mt-1 text-sm text-ink-soft not-italic">{l.phrase.en}</p> : null}
                <button type="button" onClick={() => say(i)} className="mt-1 min-h-9 text-sm font-bold text-primary-deep not-italic" aria-label={`Play line ${i + 1}`}>
                  🔊 Play
                </button>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </main>
      <footer className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t-2 border-line bg-bg p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => void playAll()} aria-label={playingAll ? "Stop playing" : "Play the whole story"}>
            {playingAll ? "⏸" : "▶ All"}
          </Button>
          {done ? (
            <Button
              className="flex-1"
              onClick={() => {
                run.current++;
                stopAudio();
                setPlayingAll(false);
                setStage("questions");
              }}
            >
              Questions →
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => setShown((n) => n + 1)} disabled={playingAll}>
              Next line ({shown}/{story.lines.length})
            </Button>
          )}
        </div>
      </footer>
    </>
  );
}
