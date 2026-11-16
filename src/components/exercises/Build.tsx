"use client";
import { useState } from "react";
import { checkBuild, type ResolvedBuild } from "@/engine/exercises";
import { useSettings } from "@/lib/settings";
import { Nastaliq } from "../Phrase";
import type { ExerciseProps } from "./types";
import { e2e } from "@/lib/e2e";

/** Word tiles. In Urdu-only mode the tiles are Nastaliq and the answer line runs right to left. */
export function BuildExercise({ ex, locked, onChange }: ExerciseProps<ResolvedBuild>) {
  const { script } = useSettings();
  const s = script === "urdu" ? "urdu" : "roman";
  const tiles = ex.tiles[s];
  const [chosen, setChosen] = useState<string[]>([]);

  const update = (next: string[]) => {
    setChosen(next);
    if (next.length === 0) return onChange(null);
    const text = next.map((k) => tiles.find((t) => t.key === k)?.text ?? "");
    onChange({
      verdict: checkBuild(ex, text, s),
      answer: { roman: ex.phrase.roman, urdu: ex.phrase.urdu, en: ex.phrase.en },
    });
  };

  const Word = ({ text }: { text: string }) =>
    s === "urdu" ? <Nastaliq className="text-2xl">{text}</Nastaliq> : <span className="text-lg font-bold">{text}</span>;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl leading-tight font-bold">{ex.prompt}</h2>
      <div
        dir={s === "urdu" ? "rtl" : "ltr"}
        aria-label="Your sentence"
        className="flex min-h-24 flex-wrap content-start gap-2 border-b-2 border-line pb-3"
      >
        {chosen.map((k) => {
          const t = tiles.find((x) => x.key === k);
          return t ? (
            <button
              key={k}
              type="button"
              disabled={locked}
              onClick={() => update(chosen.filter((c) => c !== k))}
              className="min-h-12 animate-pop rounded-xl border-2 border-line bg-surface px-3 shadow-[0_3px_0_var(--line)]"
            >
              <Word text={t.text} />
            </button>
          ) : null;
        })}
      </div>
      <div
        dir={s === "urdu" ? "rtl" : "ltr"}
        className="flex flex-wrap justify-center gap-2"
        aria-label="Word bank"
        data-expected={e2e() ? (s === "urdu" ? ex.phrase.urdu : ex.phrase.roman) : undefined}
      >
        {tiles.map((t) => {
          const used = chosen.includes(t.key);
          return (
            <button
              key={t.key}
              type="button"
              disabled={used || locked}
              data-word={t.text}
              onClick={() => update([...chosen, t.key])}
              className={`min-h-12 rounded-xl border-2 px-3 transition ${used ? "border-surface-2 bg-surface-2 text-transparent" : "border-line bg-surface shadow-[0_3px_0_var(--line)] active:translate-y-[2px]"}`}
            >
              <Word text={t.text} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
