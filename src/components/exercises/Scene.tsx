"use client";
import { useEffect, useRef, useState } from "react";
import { checkChoice, type ResolvedScene } from "@/engine/exercises";
import { playPhrase, playToEnd, stopAudio } from "@/lib/audio";
import { useCast } from "@/lib/cast";
import { mark } from "@/lib/e2e";
import { Avatar } from "../Avatar";
import { PhraseText } from "../Phrase";
import type { ExerciseProps } from "./types";

/** Overhear a short exchange, then answer a question about it. */
export function SceneExercise({ ex, locked, onChange }: ExerciseProps<ResolvedScene>) {
  const cast = useCast();
  const [shown, setShown] = useState(0);
  const [speaking, setSpeaking] = useState(-1);
  const [picked, setPicked] = useState<string | null>(null);
  const run = useRef(0);
  const first = ex.lines[0]?.speaker;

  const play = async () => {
    const me = ++run.current;
    for (let i = 0; i < ex.lines.length; i++) {
      if (run.current !== me) return;
      const line = ex.lines[i];
      if (!line) continue;
      setShown((n) => Math.max(n, i + 1));
      setSpeaking(i);
      await playToEnd({ ...line.phrase, speaker: line.speaker });
      await new Promise((r) => setTimeout(r, 350));
    }
    if (run.current === me) setSpeaking(-1);
  };

  useEffect(
    () => () => {
      run.current++;
      stopAudio();
    },
    [],
  );

  const started = shown > 0;
  const reveal = locked || !ex.hideText;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl leading-tight font-bold">{ex.hideText ? "Listen in" : "Overheard"}</h2>
      {ex.setup ? <p className="-mt-2 text-ink-soft">{ex.setup}</p> : null}
      <div className="flex flex-col gap-2 rounded-3xl bg-surface-2/60 p-3">
        {ex.lines.map((l, i) => {
          const c = cast(l.speaker);
          const left = l.speaker === first;
          const visible = i < shown || locked;
          return (
            <div key={i} className={`flex items-end gap-2 transition-opacity ${left ? "" : "flex-row-reverse"} ${visible ? "opacity-100" : "opacity-25"}`}>
              <Avatar character={c} size="sm" talking={speaking === i} />
              <button
                type="button"
                onClick={() => {
                  run.current++;
                  setShown((n) => Math.max(n, i + 1));
                  void playPhrase({ ...l.phrase, speaker: l.speaker });
                }}
                aria-label={`${c.name} says: play line ${i + 1}`}
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-left ${left ? "rounded-bl-sm bg-surface" : "rounded-br-sm bg-primary-soft"} ${speaking === i ? "ring-2 ring-primary" : ""}`}
              >
                <span className="block text-xs font-black text-ink-soft">{c.name}</span>
                {visible && reveal ? (
                  <PhraseText phrase={l.phrase} size="sm" />
                ) : (
                  <span className="text-lg tracking-widest text-ink-soft" aria-hidden>
                    {visible ? "🔊 · · ·" : "· · ·"}
                  </span>
                )}
                {locked ? <span className="block text-sm text-ink-soft">{l.phrase.en}</span> : null}
              </button>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => void play()}
        className="min-h-12 self-center rounded-2xl bg-primary px-5 font-black text-primary-ink shadow-[0_4px_0_var(--primary-deep)] active:translate-y-[3px] active:shadow-none"
      >
        {started ? "↻ Play again" : "▶ Play the scene"}
      </button>
      <p className="font-display text-xl leading-tight font-bold">{ex.question}</p>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Answers">
        {ex.options.map((o) => {
          const isPicked = picked === o.key;
          const isAnswer = o.key === ex.answerKey;
          let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
          if (isPicked && !locked) tone = "border-primary bg-primary-soft shadow-[0_3px_0_var(--primary)]";
          if (locked && isAnswer) tone = "border-good bg-good-soft shadow-[0_3px_0_var(--good)]";
          if (locked && isPicked && !isAnswer) tone = "border-bad bg-bad-soft shadow-[0_3px_0_var(--bad)] animate-shake";
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={locked}
              {...mark(isAnswer)}
              onClick={() => {
                setPicked(o.key);
                const verdict = checkChoice(ex, o.key);
                const right = ex.options.find((x) => x.key === ex.answerKey);
                onChange({ verdict, feedback: o.feedback ?? ex.explain, answer: right ? { roman: right.text } : undefined });
              }}
              className={`min-h-14 w-full rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold transition active:translate-y-[2px] ${tone}`}
            >
              {o.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
