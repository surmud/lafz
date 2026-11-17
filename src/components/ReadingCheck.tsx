"use client";
import Link from "next/link";
import { useState } from "react";
import type { UnitMeta } from "@/engine/course";
import { mark } from "@/lib/e2e";
import { useStore } from "@/lib/store";
import { Nastaliq } from "./Phrase";

/**
 * Reading placement (SPEC §11): three quick script questions after the speaking placement. It
 * suggests a reading unit and marks earlier ones "skipped, review anytime". Nothing is locked.
 */
const QUESTIONS = [
  { glyph: "ب", prompt: "Which letter is this?", options: ["be (b)", "pe (p)", "te (t)"], level: 1 },
  { glyph: "شکریہ", prompt: "What does this word say?", options: ["shukriya", "sharbat", "shehar"], level: 6 },
  { glyph: "بیٹا کھانا کھا لیا؟", prompt: "What does this message say?", options: ["Dear, have you eaten?", "Dear, come home", "Dear, call me"], level: 10 },
];

export function ReadingCheck({ readingUnits }: { readingUnits: UnitMeta[] }) {
  const { update } = useStore();
  const [step, setStep] = useState<"offer" | number | "done">("offer");
  const [right, setRight] = useState(0);
  const [suggest, setSuggest] = useState<UnitMeta | null>(null);
  const ordered = [...readingUnits].sort((a, b) => a.order - b.order);

  const finish = async (score: number) => {
    // 0 → R1, 1 → R6 (vowels & special letters), 2 → R9 (WhatsApp), 3 → R10 (Ghalib)
    const order = [1, 6, 9, 10][score] ?? 1;
    const target = ordered.find((u) => u.order === order) ?? ordered[0] ?? null;
    setSuggest(target);
    setStep("done");
    if (!target) return;
    const skip = ordered.filter((u) => u.order < target.order).map((u) => u.id);
    await update((p) => ({ ...p, skipped: [...new Set([...p.skipped, ...skip])] }));
  };

  if (ordered.length === 0) return null;
  if (step === "offer") {
    return (
      <div className="rounded-3xl border-2 border-dashed border-primary/50 p-4 text-left">
        <p className="font-bold">Can you read Urdu script?</p>
        <p className="text-sm text-ink-soft">Three quick questions to place you on the reading track too.</p>
        <button type="button" onClick={() => setStep(0)} className="mt-3 min-h-11 rounded-full bg-primary px-4 font-bold text-primary-ink">
          Check my reading
        </button>
      </div>
    );
  }
  if (step === "done") {
    return (
      <div className="rounded-3xl border-2 border-primary bg-primary-soft p-4 text-left">
        <p className="text-sm font-bold text-ink-soft">Reading: {right} of 3</p>
        {suggest ? (
          <Link href={`/unit/${suggest.id}/`} className="mt-1 block font-display text-xl font-bold underline">
            Start reading at R{suggest.order}: {suggest.title} →
          </Link>
        ) : null}
      </div>
    );
  }
  const q = QUESTIONS[step]!;
  return (
    <div className="rounded-3xl border-2 border-line bg-surface p-4 text-left" aria-live="polite">
      <p className="text-sm font-bold text-ink-soft">
        Reading check {step + 1} of 3 · {q.prompt}
      </p>
      <div className="my-2 grid place-items-center rounded-2xl bg-surface-2 py-3">
        <Nastaliq className={q.glyph.length > 3 ? "text-3xl" : "text-6xl"}>{q.glyph}</Nastaliq>
      </div>
      <div className="flex flex-col gap-2">
        {q.options.map((o, i) => (
          <button
            key={o}
            type="button"
            {...mark(i === 0)}
            onClick={() => {
              const r = right + (i === 0 ? 1 : 0);
              setRight(r);
              // Stop early once they miss: no point testing harder script.
              if (i !== 0 || step === QUESTIONS.length - 1) void finish(r);
              else setStep(step + 1);
            }}
            className="min-h-12 rounded-2xl border-2 border-line bg-surface px-4 text-left font-semibold"
          >
            {o}
          </button>
        ))}
        <button type="button" onClick={() => void finish(right)} className="min-h-11 text-sm font-bold text-ink-soft">
          I can&apos;t read it yet
        </button>
      </div>
    </div>
  );
}
