"use client";
import { useState } from "react";
import { checkSpot, type ResolvedSpot, type Script } from "@/engine/exercises";
import { mark } from "@/lib/e2e";
import { useSettings } from "@/lib/settings";
import type { ExerciseProps } from "./types";

/** One word in the sentence is wrong: tap it. */
export function SpotExercise({ ex, locked, onChange }: ExerciseProps<ResolvedSpot>) {
  const { script } = useSettings();
  const [picked, setPicked] = useState<string | null>(null);
  const rows: Script[] = script === "roman" ? ["roman"] : script === "urdu" ? ["urdu"] : ["roman", "urdu"];

  const pick = (key: string, s: Script) => {
    if (locked) return;
    setPicked(key);
    onChange({
      verdict: checkSpot(ex, key, s),
      feedback: `${ex.wrong.roman} → ${ex.word.roman}. ${ex.explain}`,
      answer: { roman: ex.phrase.roman, urdu: ex.phrase.urdu, en: ex.phrase.en },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl leading-tight font-bold">{ex.prompt}</h2>
      <p className="-mt-3 text-ink-soft">It should mean: “{ex.phrase.en}”</p>
      {rows.map((s) => (
        <div key={s} dir={s === "urdu" ? "rtl" : "ltr"} lang={s === "urdu" ? "ur" : undefined} className="flex flex-wrap gap-2 rounded-3xl bg-surface-2/60 p-4">
          {ex.tokens[s].map((t) => {
            const isPicked = picked === t.key;
            let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
            if (isPicked && !locked) tone = "border-primary bg-primary-soft";
            if (locked && t.wrong) tone = "border-good bg-good-soft line-through decoration-2";
            if (locked && isPicked && !t.wrong) tone = "border-bad bg-bad-soft animate-shake";
            return (
              <button
                key={t.key}
                type="button"
                disabled={locked}
                aria-pressed={isPicked}
                {...mark(t.wrong)}
                onClick={() => pick(t.key, s)}
                className={`min-h-12 rounded-2xl border-2 px-3 py-1 font-bold transition ${s === "urdu" ? "urdu text-2xl" : "text-xl"} ${tone}`}
              >
                {t.text}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
