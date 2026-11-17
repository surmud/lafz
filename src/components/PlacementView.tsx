"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Phrase, PlacementQuestion } from "@/content/schema";
import type { UnitMeta } from "@/engine/course";
import { resolveExercise, type Resolved } from "@/engine/exercises";
import { answerPlacement, nextQuestion, placementResult, startPlacement, type PlacementState } from "@/engine/placement";
import { applyPlacement } from "@/engine/progress";
import { today, useStore } from "@/lib/store";
import { track } from "@/lib/telemetry";
import { ExerciseView } from "./exercises/Exercise";
import { ReadingCheck } from "./ReadingCheck";
import type { ExerciseResult } from "./exercises/types";
import { Button, LinkButton, ProgressBar } from "./ui";

const SKILL: Record<PlacementQuestion["skill"], string> = {
  listening: "👂 Listening",
  reply: "💬 Replying",
  register: "🙏 Respect",
  typing: "⌨️ Typing",
  reading: "📜 Reading",
  meaning: "🧠 Meaning",
};

export function PlacementView({
  questions,
  phrases,
  speakingUnitIds,
  units,
}: {
  questions: PlacementQuestion[];
  phrases: Phrase[];
  speakingUnitIds: string[];
  units: UnitMeta[];
}) {
  const { update } = useStore();
  const byId = useMemo(() => new Map(phrases.map((p) => [p.id, p])), [phrases]);
  // Placement can suggest any core unit, or the first advanced one: advanced units are separate
  // topics, so nothing past that point is ever marked as skipped.
  const speaking = useMemo(() => units.filter((x) => x.track === "speaking").sort((a, b) => a.order - b.order), [units]);
  const firstAdvanced = speaking.findIndex((x) => x.stage === "advanced");
  const maxUnit = firstAdvanced >= 0 ? firstAdvanced + 1 : speakingUnitIds.length;
  const maxLevel = Math.max(...questions.map((x) => x.level), 1);
  const [state, setState] = useState<PlacementState>(() => startPlacement(Math.min(2, maxUnit)));
  const [answer, setAnswer] = useState<ExerciseResult | null>(null);
  const [saved, setSaved] = useState<{ unit: number } | null>(null);
  const q = nextQuestion(state, questions);
  const resolved: Resolved | null = useMemo(
    () => (q ? resolveExercise(q.exercise, `placement-${q.id}`, { phrases: byId, pool: phrases }) : null),
    [q, byId, phrases],
  );
  const length = Math.min(7, questions.length);

  const record = async (correct: boolean) => {
    if (!q) return;
    const next = answerPlacement(state, q, correct, length, maxLevel);
    setAnswer(null);
    setState(next);
    if (next.done || !nextQuestion(next, questions)) {
      const r = placementResult(next, maxLevel);
      const unit = Math.max(1, Math.min(maxUnit, r.unit));
      await update((p) => applyPlacement(p, { ...r, unit }, speakingUnitIds, today()));
      track("placement", { id: `u${String(unit).padStart(2, "0")}`, acc: r.total ? Math.round((r.correct / r.total) * 100) / 100 : undefined });
      setSaved({ unit });
    }
  };

  if (saved) {
    const u = speaking[saved.unit - 1];
    const r = placementResult(state, maxLevel);
    const adv = u?.stage === "advanced";
    return (
      <main className="flex min-h-dvh flex-col gap-5 px-5 pt-14 pb-8 text-center">
        <p className="text-6xl" aria-hidden>
          {saved.unit > 1 ? "🦁" : "🌱"}
        </p>
        <h1 className="font-display text-3xl font-bold">
          {adv ? "Start the advanced course" : saved.unit > 1 ? `Start at Unit ${saved.unit}` : "Start at Unit 1"}
        </h1>
        <p className="text-lg text-ink-soft">
          You got {r.correct} of {r.total}.{" "}
          {adv
            ? "The core course is marked “skipped, review anytime”. The advanced units are separate topics: take them in any order."
            : saved.unit > 1
            ? `Units 1–${saved.unit - 1} are marked “skipped, review anytime”. Nothing is locked.`
            : "Unit 1 is the right place to start."}
        </p>
        {u ? (
          <div className="rounded-3xl border-2 border-line bg-surface p-4 text-left">
            <p className="text-sm font-bold text-ink-soft">Suggested start</p>
            <p className="font-display text-2xl font-bold">
              {u.emoji} {u.title}
            </p>
            <p className="text-ink-soft">{u.tagline}</p>
          </div>
        ) : null}
        <ReadingCheck readingUnits={units.filter((x) => x.track === "reading")} />
        <div className="mt-auto flex flex-col gap-3">
          <LinkButton href={u ? `/lesson/${u.lessons[0]?.id}/` : "/"} block>
            Start {u?.lessons[0]?.title ?? "learning"} →
          </LinkButton>
          <LinkButton href="/" variant="secondary" block>
            See the whole course
          </LinkButton>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Link href="/" aria-label="Leave placement" className="grid size-11 place-items-center text-2xl text-ink-soft">
          ✕
        </Link>
        <ProgressBar value={state.answers.length / length} label="Placement progress" tone="accent" />
      </header>
      <main className="flex-1 px-4 pb-40" key={q?.id}>
        {q ? (
          <p className="mb-3 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-black text-accent-deep">
            {SKILL[q.skill]} · Q{state.answers.length + 1}
            {state.answers.length < length ? ` of ${length}` : " · bonus round"}
          </p>
        ) : null}
        {resolved ? (
          <div className="animate-rise">
            <ExerciseView ex={resolved} locked={false} onChange={setAnswer} onSubmit={(r) => void record(r.verdict !== "wrong")} />
          </div>
        ) : null}
      </main>
      <footer className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-md gap-3 border-t-2 border-line bg-bg px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button variant="secondary" onClick={() => void record(false)}>
          I don&apos;t know
        </Button>
        <Button block disabled={!answer} onClick={() => answer && void record(answer.verdict !== "wrong")}>
          Next
        </Button>
      </footer>
    </div>
  );
}
