"use client";
import { useMemo, useRef, useState } from "react";
import type { ResolvedMatch } from "@/engine/exercises";
import { playPhrase } from "@/lib/audio";
import { PhraseText } from "../Phrase";
import type { ExerciseProps } from "./types";
import { e2e } from "@/lib/e2e";

/** Tap a left tile then its partner. Wrong pairs just shake: no penalty. Finishes by itself. */
export function MatchExercise({ ex, locked, onSubmit }: ExerciseProps<ResolvedMatch>) {
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState<string | null>(null);

  // Refs mirror the state so very fast taps never act on a stale render.
  const doneRef = useRef<string[]>([]);
  const missRef = useRef(0);
  const selRef = useRef<{ l: string | null; r: string | null }>({ l: null, r: null });
  const byId = useMemo(() => new Map(ex.phrases.map((p) => [p.id, p])), [ex.phrases]);

  const select = (side: "l" | "r", id: string) => {
    const sel = { ...selRef.current, [side]: id };
    selRef.current = sel;
    if (side === "l") setLeft(id);
    else setRight(id);
    const { l, r } = sel;
    if (!l || !r) return;
    selRef.current = { l: null, r: null };
    if (l === r) {
      if (doneRef.current.includes(l)) return;
      const next = [...doneRef.current, l];
      doneRef.current = next;
      setDone(next);
      setLeft(null);
      setRight(null);
      if (next.length === ex.phrases.length) {
        const m = missRef.current;
        setTimeout(
          () =>
            onSubmit({
              verdict: m <= 1 ? "correct" : "almost",
              feedback: m > 1 ? "All matched! A few wrong taps along the way, which cost you nothing." : undefined,
            }),
          350,
        );
      }
    } else {
      missRef.current += 1;
      setBad(`${l}|${r}`);

      setTimeout(() => {
        setBad(null);
        setLeft(null);
        setRight(null);
      }, 450);
    }
  };

  const tile = (id: string, side: "l" | "r") => {
    const isDone = done.includes(id);
    const isSel = side === "l" ? left === id : right === id;
    const isBad = bad !== null && (side === "l" ? bad.startsWith(`${id}|`) : bad.endsWith(`|${id}`));
    const p = byId.get(id);
    if (!p) return null;
    let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
    if (isSel) tone = "border-primary bg-primary-soft shadow-[0_3px_0_var(--primary)]";
    if (isBad) tone = "border-bad bg-bad-soft animate-shake";
    if (isDone) tone = "border-good/40 bg-good-soft/60 text-ink-soft opacity-60";
    return (
      <button
        key={`${side}${id}`}
        type="button"
        disabled={isDone || locked}
        aria-pressed={isSel}
        data-pair={e2e() ? id : undefined}
        data-side={side}
        onClick={() => {
          if (side === "l" && ex.mode === "audio") void playPhrase(p);
          select(side, id);
        }}
        className={`flex min-h-16 w-full items-center justify-center rounded-2xl border-2 px-2 py-2 text-center transition ${tone}`}
      >
        {side === "l" ? (
          ex.mode === "audio" ? (
            <span className="text-2xl" aria-label={`Sound ${ex.phrases.indexOf(p) + 1}`}>🔊</span>
          ) : (
            <PhraseText phrase={p} size="sm" align="center" />
          )
        ) : ex.mode === "audio" ? (
          <PhraseText phrase={p} size="sm" align="center" />
        ) : (
          <span className="text-sm font-semibold leading-tight">{p.en}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-bold">{ex.mode === "audio" ? "Match the sound to the words" : "Match the pairs"}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">{ex.phrases.map((p) => tile(p.id, "l"))}</div>
        <div className="flex flex-col gap-3">{ex.rightOrder.map((id) => tile(id, "r"))}</div>
      </div>
    </div>
  );
}
