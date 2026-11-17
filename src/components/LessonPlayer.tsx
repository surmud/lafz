"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Exercise, InfoCard, Phrase, TeachCard } from "@/content/schema";
import { harden, resolveExercise, skillOf, targetsOf, type Resolved } from "@/engine/exercises";
import { tallyAnswer, type SkillStats } from "@/engine/skills";
import { completionLine, feedbackLine } from "@/engine/feedback";
import { advance, createLesson, currentStep, isComeback, progress as lessonProgress, submit, type LessonState } from "@/engine/lesson";
import { completeLesson } from "@/engine/progress";
import type { XpBreakdown } from "@/engine/xp";
import { blip, stopAudio } from "@/lib/audio";
import { useSettings } from "@/lib/settings";
import { track } from "@/lib/telemetry";
import { today, useStore } from "@/lib/store";
import { AskAmmiButton } from "./AskAmmi";
import { ExerciseView, selfSubmitting } from "./exercises/Exercise";
import type { ExerciseResult } from "./exercises/types";
import { AudioButton, Nastaliq, PhraseText, ScriptToggle } from "./Phrase";
import { Button, LinkButton, ProgressBar } from "./ui";
import { Celebration } from "./Celebration";

export interface LessonPlayerProps {
  lessonId: string;
  title: string;
  canDo: string;
  kind: "lesson" | "review";
  teach: (TeachCard | InfoCard)[];
  exercises: Exercise[];
  /** Every phrase the lesson references. */
  phrases: Phrase[];
  /** Phrases automatic distractors are drawn from. */
  pool?: Phrase[];
  nextHref?: string;
  nextLabel?: string;
  exitHref?: string;
}

export function LessonPlayer(props: LessonPlayerProps) {
  const { lessonId, teach, exercises, phrases } = props;
  const { update } = useStore();
  const { sound, hard } = useSettings();
  const byId = useMemo(() => new Map(phrases.map((p) => [p.id, p])), [phrases]);
  const pool = props.pool ?? phrases;

  const steps = useMemo(
    () => [
      ...teach.map((_, i) => ({ id: `t${i}`, kind: "teach" as const })),
      ...exercises.map((_, i) => ({ id: `e${i}`, kind: "exercise" as const })),
    ],
    [teach, exercises],
  );
  const [state, setState] = useState<LessonState>(() => createLesson(steps));
  const [answer, setAnswer] = useState<ExerciseResult | null>(null);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [done, setDone] = useState<{ xp: XpBreakdown; practised: Phrase[] } | null>(null);
  const started = useRef(0);
  const practised = useRef(new Set<string>());
  const missed = useRef(new Set<string>());
  const tally = useRef<SkillStats>({});

  const step = currentStep(state);
  const resolved: Resolved | null = useMemo(() => {
    if (!step || step.kind !== "exercise") return null;
    const ex = exercises[Number(step.id.slice(1))];
    if (!ex) return null;
    // Hard mode applies to speaking content only: single letters can't be typed in Roman.
    const use = hard && !/^r\d/.test(lessonId) ? harden(ex) : ex;
    return resolveExercise(use, `${lessonId}#${step.id}#${step.attempt}`, { phrases: byId, pool });
  }, [step, exercises, lessonId, byId, pool, hard]);

  useEffect(() => {
    started.current = Date.now();
    return stopAudio;
  }, []);

  const finish = async (final: LessonState) => {
    blip("done");
    const report = {
      lessonId,
      kind: props.kind,
      stats: final.stats,
      practised: [...practised.current],
      missed: [...missed.current],
      seconds: (Date.now() - started.current) / 1000,
      today: today(),
      tally: tally.current,
    };
    let xp: XpBreakdown = { base: 0, comeback: 0, total: 0 };
    await update((p) => {
      const r = completeLesson(p, report);
      xp = r.xp;
      return r.progress;
    });
    const answered = final.stats.firstTry + final.stats.mistakes;
    track(props.kind, { id: lessonId, acc: answered ? Math.round((final.stats.firstTry / answered) * 100) / 100 : undefined, secs: Math.round(report.seconds) });
    setDone({ xp, practised: [...practised.current].map((id) => byId.get(id)).filter((p): p is Phrase => !!p) });
  };

  const check = (r: ExerciseResult) => {
    if (!resolved) return;
    const outcome = r.verdict === "wrong" ? "wrong" : r.verdict;
    for (const id of targetsOf(resolved)) {
      practised.current.add(id);
      if (outcome === "wrong") missed.current.add(id);
    }
    tally.current = tallyAnswer(tally.current, skillOf(resolved), outcome !== "wrong");
    if (sound) blip(outcome === "wrong" ? "wrong" : "right");
    setResult(r);
    setState((s) => submit(s, outcome));
  };

  const skip = () => {
    setResult({ verdict: "wrong", feedback: feedbackLine("skipped", `${lessonId}${state.cursor}`) });
    setState((s) => submit(s, "skipped"));
  };

  const next = () => {
    stopAudio();
    setAnswer(null);
    setResult(null);
    const n = advance(state);
    setState(n);
    if (n.phase === "complete") void finish(n);
  };

  if (done) return <LessonComplete {...props} state={state} xp={done.xp} practised={done.practised} />;

  if (state.phase === "complete") {
    return (
      <main className="grid min-h-dvh place-items-center" aria-busy="true">
        <p className="animate-pop text-6xl" aria-hidden>
          🎉
        </p>
      </main>
    );
  }

  const comeback = isComeback(state);
  const teachCard = step?.kind === "teach" ? teach[Number(step.id.slice(1))] : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-bg px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <Link href={props.exitHref ?? "/"} aria-label="Leave lesson" className="-ml-1 grid size-11 place-items-center rounded-full text-2xl text-ink-soft">
          ✕
        </Link>
        <ProgressBar value={lessonProgress(state)} label="Lesson progress" />
        <ScriptToggle />
      </header>

      <main className="flex flex-1 flex-col px-4 pb-44" key={`${state.cursor}`}>
        {comeback && !result ? (
          <p className="mb-3 inline-flex w-fit animate-rise items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-sm font-black text-accent-deep">
            ↻ Comeback round: get it right for a bonus
          </p>
        ) : null}
        <div className="animate-rise">
          {teachCard ? (
            <TeachView card={teachCard} byId={byId} />
          ) : resolved ? (
            <ExerciseView ex={resolved} locked={result !== null} onChange={setAnswer} onSubmit={check} />
          ) : null}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md">
        {result ? (
          <FeedbackSheet result={result} comeback={comeback} seed={`${lessonId}${state.cursor}`} skipped={state.lastOutcome === "skipped"} onNext={next} />
        ) : (
          <div className="flex gap-3 border-t-2 border-line bg-bg px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {teachCard ? (
              <Button block onClick={next} autoFocus>
                Got it
              </Button>
            ) : resolved && selfSubmitting(resolved) ? (
              <Button variant="secondary" block onClick={skip}>
                {resolved.type === "speak" ? "Can't speak now" : "Skip"}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={skip} aria-label="Skip this exercise" className="px-4">
                  Skip
                </Button>
                <Button block disabled={!answer} onClick={() => answer && check(answer)}>
                  Check
                </Button>
              </>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}

function TeachView({ card, byId }: { card: TeachCard | InfoCard; byId: Map<string, Phrase> }) {
  if ("info" in card) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-black tracking-widest text-rose uppercase">Quick idea</p>
        <h2 className="font-display text-3xl font-bold">{card.title}</h2>
        {card.glyph ? (
          <div className="grid place-items-center rounded-3xl bg-surface-2 py-6">
            <Nastaliq className="text-7xl">{card.glyph}</Nastaliq>
          </div>
        ) : null}
        <p className="text-lg leading-relaxed">{card.info}</p>
        {card.examples?.map((id) => {
          const p = byId.get(id);
          return p ? (
            <div key={id} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
              <AudioButton phrase={p} size="sm" />
              <div>
                <PhraseText phrase={p} size="sm" />
                <p className="text-sm text-ink-soft">{p.en}</p>
              </div>
            </div>
          ) : null;
        })}
      </div>
    );
  }
  const p = byId.get(card.phrase);
  if (!p) return null;
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-black tracking-widest text-primary uppercase">New phrase</p>
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-line bg-surface px-4 py-6 text-center shadow-[0_4px_0_var(--line)]">
        <PhraseText phrase={p} size="xl" mode="roman" align="center" />
        <Nastaliq className="text-4xl leading-[2.4]">{p.urdu}</Nastaliq>
        <p className="text-lg font-semibold text-ink-soft">{p.en}</p>
        {p.literal && p.literal !== p.en ? <p className="-mt-3 text-sm text-ink-soft italic">literally “{p.literal}”</p> : null}
        <div className="flex items-center gap-3">
          <AudioButton phrase={p} size="lg" autoPlay />
          <AudioButton phrase={p} speed="slow" />
        </div>
        {p.register === "formal" || p.register === "casual" || p.register === "intimate" ? (
          <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-ink-soft">
            {p.register === "formal" ? "🙏 Respectful" : p.register === "casual" ? "😎 Casual" : "🔥 Intimate. Use with care"}
          </span>
        ) : null}
      </div>
      {card.tip || p.note ? (
        <div className="rounded-2xl bg-accent-soft p-4 text-[15px] leading-relaxed">
          <span aria-hidden>💡 </span>
          {card.tip ?? p.note}
        </div>
      ) : null}
    </div>
  );
}

function FeedbackSheet({
  result,
  comeback,
  seed,
  skipped,
  onNext,
}: {
  result: ExerciseResult;
  comeback: boolean;
  seed: string;
  skipped: boolean;
  onNext: () => void;
}) {
  const good = result.verdict !== "wrong";
  const line = skipped
    ? (result.feedback ?? "")
    : result.verdict === "correct"
      ? feedbackLine(comeback ? "comeback" : "correct", seed)
      : result.verdict === "almost"
        ? feedbackLine("almost", seed)
        : feedbackLine("wrong", seed);
  const showAnswer = result.answer && (result.verdict !== "correct" || skipped);
  return (
    <div
      role="status"
      aria-live="assertive"
      className={`animate-rise rounded-t-3xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] ${skipped ? "bg-surface-2" : good ? "bg-good-soft" : "bg-bad-soft"}`}
    >
      <p className={`font-display text-2xl font-bold ${skipped ? "text-ink" : good ? "text-good-deep" : "text-bad-deep"}`}>
        {skipped ? "Skipped" : good ? (comeback && result.verdict === "correct" ? "↻ Comeback!" : result.verdict === "almost" ? "Counted!" : "Correct!") : "Not quite"}
      </p>
      <p className="mt-1 text-[15px]">{skipped ? line : line}</p>
      {showAnswer && result.answer ? (
        <div className="mt-2 rounded-2xl bg-surface/70 p-3">
          <p className="text-lg font-bold">{result.answer.roman}</p>
          {result.answer.urdu ? <Nastaliq className="text-lg">{result.answer.urdu}</Nastaliq> : null}
          {result.answer.en ? <p className="text-sm text-ink-soft">“{result.answer.en}”</p> : null}
        </div>
      ) : null}
      {result.feedback && !skipped ? <p className="mt-2 text-[15px] font-semibold">{result.feedback}</p> : null}
      <Button variant={skipped ? "primary" : good ? "good" : "bad"} block className="mt-3" onClick={onNext} autoFocus>
        Continue
      </Button>
    </div>
  );
}

function LessonComplete(props: LessonPlayerProps & { state: LessonState; xp: XpBreakdown; practised: Phrase[] }) {
  const { state, xp } = props;
  const headline = completionLine(state.stats, props.lessonId);
  return (
    <main className="flex min-h-dvh flex-col items-center gap-5 px-5 pt-12 pb-10 text-center">
      <Celebration />
      <div className="animate-pop text-7xl" aria-hidden>
        🎉
      </div>
      <h1 className="font-display text-4xl font-bold">{props.kind === "review" ? "Review done!" : "Lesson complete!"}</h1>
      <p className="text-lg text-ink-soft">{headline}</p>
      <div className="w-full rounded-3xl border-2 border-good bg-good-soft p-5 text-left">
        <p className="text-xs font-black tracking-widest text-good-deep uppercase">New can-do unlocked</p>
        <p className="mt-1 text-xl font-bold">✓ {props.canDo}</p>
      </div>
      <div className="grid w-full grid-cols-3 gap-3" aria-label="Lesson stats">
        <Stat label="XP" value={`+${xp.total}`} tone="accent" />
        <Stat label="First try" value={`${state.stats.firstTry}/${state.stats.exercises}`} tone="primary" />
        <Stat label="Comebacks" value={`${state.stats.comebacks}`} tone="rose" />
      </div>
      {xp.comeback > 0 ? <p className="text-sm font-bold text-rose">Includes +{xp.comeback} comeback bonus for fixing your mistakes.</p> : null}
      {props.practised.length > 0 ? (
        <div className="w-full text-left">
          <p className="mb-2 text-sm font-bold text-ink-soft">Try one at dinner tonight:</p>
          <AskAmmiButton phrase={props.practised[0]!} />
        </div>
      ) : null}
      <div className="mt-auto flex w-full flex-col gap-3">
        {props.nextHref ? (
          <LinkButton href={props.nextHref} block>
            {props.nextLabel ?? "Next lesson"} →
          </LinkButton>
        ) : null}
        <LinkButton href="/" variant="secondary" block>
          Back home
        </LinkButton>
      </div>
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "accent" | "primary" | "rose" }) {
  const t = { accent: "border-accent text-accent-deep", primary: "border-primary text-primary-deep", rose: "border-rose text-rose-deep" }[tone];
  return (
    <div className={`rounded-2xl border-2 bg-surface p-3 ${t}`}>
      <p className="text-xs font-black tracking-wider uppercase">{label}</p>
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
