"use client";
import { pack } from "@/lang";
import { useState } from "react";
import { checkChoice, type ResolvedGap } from "@/engine/exercises";
import { useSettings } from "@/lib/settings";
import { Nastaliq } from "../Phrase";
import type { ExerciseProps } from "./types";
import { mark } from "@/lib/e2e";

export function GapExercise({ ex, locked, onChange }: ExerciseProps<ResolvedGap>) {
  const { script } = useSettings();
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = ex.bank.find((b) => b.key === picked);
  const showRoman = script !== "urdu";
  const showUrdu = script !== "roman";
  const slot = (text: string | undefined, urdu: boolean) => (
    <span className={`mx-1 inline-flex min-w-16 justify-center rounded-lg border-b-4 px-2 ${chosen ? "border-primary bg-primary-soft" : "border-line bg-surface-2"}`}>
      {text ? (urdu ? <Nastaliq>{text}</Nastaliq> : text) : <span className="opacity-40">___</span>}
    </span>
  );
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-bold">Fill the gap</h2>
      <p className="-mt-3 text-ink-soft">“{ex.phrase.en}”</p>
      <div className="flex flex-col gap-2 rounded-3xl bg-surface-2/60 p-4">
        {showRoman ? (
          <p className="text-2xl font-bold leading-relaxed">
            {ex.parts.roman[0]}
            {slot(chosen?.roman, false)}
            {ex.parts.roman[1]}
          </p>
        ) : null}
        {showUrdu ? (
          <p lang={pack.script.lang} dir={pack.script.dir} className="urdu text-2xl">
            {ex.parts.urdu[0]}
            {slot(chosen?.urdu, true)}
            {ex.parts.urdu[1]}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {ex.bank.map((b) => {
          const isPicked = picked === b.key;
          let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
          if (isPicked && !locked) tone = "border-primary bg-primary-soft";
          if (locked && b.key === ex.answerKey) tone = "border-good bg-good-soft";
          if (locked && isPicked && b.key !== ex.answerKey) tone = "border-bad bg-bad-soft animate-shake";
          return (
            <button
              key={b.key}
              type="button"
              disabled={locked}
              {...mark(b.key === ex.answerKey)}
              onClick={() => {
                setPicked(b.key);
                const right = ex.bank.find((x) => x.key === ex.answerKey);
                onChange({
                  verdict: checkChoice(ex, b.key),
                  feedback: ex.explain,
                  answer: right ? { roman: ex.phrase.roman, urdu: ex.phrase.urdu, en: ex.phrase.en } : undefined,
                });
              }}
              className={`flex min-h-14 min-w-20 flex-col items-center justify-center rounded-2xl border-2 px-4 py-2 transition ${tone}`}
            >
              {showRoman ? <span className="text-lg font-bold">{b.roman}</span> : null}
              {showUrdu ? <Nastaliq className="text-lg">{b.urdu}</Nastaliq> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
