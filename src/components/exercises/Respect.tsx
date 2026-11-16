"use client";
import { useState } from "react";
import { checkRespect, type ResolvedRespect } from "@/engine/exercises";
import { PhraseText } from "../Phrase";
import type { ExerciseProps } from "./types";
import { mark } from "@/lib/e2e";

/** Respect meter: pick the register for this listener. Feedback explains the social effect. */
export function RespectExercise({ ex, locked, onChange }: ExerciseProps<ResolvedRespect>) {
  const [picked, setPicked] = useState<string | null>(null);
  const right = ex.options.find((o) => o.verdict === "right");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-black tracking-widest text-accent-deep uppercase">Respect meter</span>
      </div>
      <h2 className="font-display text-2xl leading-tight font-bold">{ex.situation}</h2>
      <p className="-mt-3 text-ink-soft">
        Talking to: <strong className="text-ink">{ex.listener}</strong>
      </p>
      <div className="flex flex-col gap-3">
        {ex.options.map((o) => {
          const isPicked = picked === o.key;
          let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
          if (isPicked && !locked) tone = "border-primary bg-primary-soft";
          if (locked && o.verdict === "right") tone = "border-good bg-good-soft";
          if (locked && isPicked && o.verdict === "ok") tone = "border-accent bg-accent-soft";
          if (locked && isPicked && o.verdict === "wrong") tone = "border-bad bg-bad-soft animate-shake";
          const meter = o.verdict === "right" ? 3 : o.verdict === "ok" ? 2 : 1;
          return (
            <button
              key={o.key}
              type="button"
              disabled={locked}
              role="radio"
              aria-checked={isPicked}
              {...mark(o.verdict === "right")}
              onClick={() => {
                setPicked(o.key);
                const r = checkRespect(ex, o.key);
                onChange({
                  verdict: r.verdict,
                  feedback: r.feedback,
                  answer: right ? { roman: right.phrase.roman, urdu: right.phrase.urdu, en: right.phrase.en } : undefined,
                });
              }}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${tone}`}
            >
              <PhraseText phrase={o.phrase} />
              {locked ? (
                <span aria-label={`${meter} of 3 respect`} className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className={`h-4 w-2 rounded-sm ${i <= meter ? (meter === 3 ? "bg-good" : meter === 2 ? "bg-accent" : "bg-bad") : "bg-surface-2"}`} />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
