"use client";
import { useState } from "react";
import { checkSort, type ResolvedSort } from "@/engine/exercises";
import { e2e } from "@/lib/e2e";
import { PhraseText } from "../Phrase";
import type { ExerciseProps } from "./types";

/** Sort items into buckets: tap an item, then tap the bucket it belongs in. */
export function SortExercise({ ex, locked, onChange }: ExerciseProps<ResolvedSort>) {
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [held, setHeld] = useState<string | null>(null);
  const loose = ex.items.filter((it) => placed[it.key] === undefined);
  const active = held ?? loose[0]?.key ?? null;

  const drop = (bucket: number) => {
    if (locked || !active) return;
    const next = { ...placed, [active]: bucket };
    setPlaced(next);
    setHeld(null);
    if (ex.items.every((it) => next[it.key] !== undefined)) {
      const r = checkSort(ex, next);
      const fixes = ex.items.filter((it) => r.wrong.includes(it.key)).map((it) => `${it.phrase?.roman ?? it.text} → ${ex.buckets[it.bucket]}`);
      onChange({ verdict: r.verdict, feedback: [fixes.join(" · "), ex.explain].filter(Boolean).join(" ") || undefined });
    } else onChange(null);
  };
  const lift = (key: string) => {
    if (locked) return;
    const next = { ...placed };
    delete next[key];
    setPlaced(next);
    setHeld(key);
    onChange(null);
  };
  const label = (it: ResolvedSort["items"][number]) => (it.phrase ? <PhraseText phrase={it.phrase} size="sm" /> : <span className="font-bold">{it.text}</span>);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl leading-tight font-bold">{ex.prompt}</h2>
      <div className="flex min-h-16 flex-wrap gap-2" aria-label="Items to sort">
        {loose.map((it) => (
          <button
            key={it.key}
            type="button"
            onClick={() => setHeld(it.key)}
            aria-pressed={active === it.key}
            data-bucket={e2e() ? it.bucket : undefined}
            className={`rounded-2xl border-2 px-3 py-2 text-left transition ${active === it.key ? "border-primary bg-primary-soft shadow-[0_3px_0_var(--primary)]" : "border-line bg-surface shadow-[0_3px_0_var(--line)]"}`}
          >
            {label(it)}
          </button>
        ))}
        {loose.length === 0 ? <p className="self-center text-sm text-ink-soft">All sorted. Tap an item to move it.</p> : null}
      </div>
      <div className={`grid gap-3 ${ex.buckets.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {ex.buckets.map((b, i) => (
          <div key={b} className="flex flex-col gap-2">
            <button
              type="button"
              disabled={locked || !active}
              onClick={() => drop(i)}
              data-bucket-target={i}
              className="min-h-14 rounded-2xl border-2 border-dashed border-primary bg-primary-soft px-2 py-2 text-center leading-tight font-black disabled:border-line disabled:bg-surface-2"
            >
              {b}
            </button>
            {ex.items
              .filter((it) => placed[it.key] === i)
              .map((it) => {
                const bad = locked && it.bucket !== i;
                return (
                  <button
                    key={it.key}
                    type="button"
                    disabled={locked}
                    onClick={() => lift(it.key)}
                    className={`rounded-xl border-2 px-2 py-1 text-left text-sm ${locked ? (bad ? "border-bad bg-bad-soft animate-shake" : "border-good bg-good-soft") : "border-line bg-surface"}`}
                  >
                    {label(it)}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
