"use client";
import { useState } from "react";
import { checkType, type ResolvedType } from "@/engine/exercises";
import { AudioButton } from "../Phrase";
import type { ExerciseProps } from "./types";
import { e2e } from "@/lib/e2e";

export function TypeExercise({ ex, locked, onChange }: ExerciseProps<ResolvedType>) {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState(false);
  const words = ex.phrase.roman.replace(/[?!.,]/g, "").split(/\s+/);
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl leading-tight font-bold">{ex.prompt}</h2>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink-soft">Type in Roman Urdu. Any normal spelling is fine.</span>
        <textarea
          value={value}
          disabled={locked}
          rows={2}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Your answer"
          data-expected={e2e() ? ex.phrase.roman : undefined}
          placeholder="e.g. shukriya"
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value.trim()) return onChange(null);
            const r = checkType(ex, e.target.value);
            onChange({
              verdict: r.verdict === "incorrect" ? "wrong" : r.verdict,
              answer: { roman: r.canonical, urdu: ex.phrase.urdu, en: ex.phrase.en },
              feedback: r.rejected ? "Careful: that's a real word, but it means something else." : undefined,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          className="w-full resize-none rounded-2xl border-2 border-line bg-surface p-4 text-xl font-semibold outline-none focus:border-primary"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setHint(true)}
          disabled={hint || locked}
          className="min-h-11 rounded-full border-2 border-dashed border-line px-4 text-sm font-bold text-ink-soft disabled:opacity-60"
        >
          {hint ? `Starts with “${words.map((w) => w.slice(0, 2)).join("… ")}…”` : "💡 Hint"}
        </button>
        <AudioButton phrase={ex.phrase} size="sm" label="Hear the answer" />
      </div>
    </div>
  );
}
