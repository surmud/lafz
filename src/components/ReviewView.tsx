"use client";
import { useMemo, useState } from "react";
import type { Phrase } from "@/content/schema";
import { generateDrill } from "@/engine/exercises";
import { buildReviewSession } from "@/engine/review";
import { hashString } from "@/engine/rng";
import { today, useStore } from "@/lib/store";
import { LessonPlayer } from "./LessonPlayer";
import { LinkButton, TopBar } from "./ui";

export function ReviewView({ phrases }: { phrases: Phrase[] }) {
  const { ready } = useStore();
  return ready ? <ReviewSession phrases={phrases} /> : null;
}

function ReviewSession({ phrases }: { phrases: Phrase[] }) {
  const { progress } = useStore();
  const byId = useMemo(() => new Map(phrases.map((p) => [p.id, p])), [phrases]);
  // Frozen at mount, so finishing the session doesn't reshuffle the queue under the learner.
  const [ids] = useState(() => buildReviewSession(progress.review, today(), 10).filter((id) => byId.has(id)));
  const [day] = useState(today);
  if (ids.length < 3) {
    return (
      <>
        <TopBar title="Review" />
        <main className="flex flex-col items-center gap-4 px-6 pt-10 text-center">
          <p className="text-6xl" aria-hidden>
            🔁
          </p>
          <h1 className="font-display text-2xl font-bold">Nothing to review yet</h1>
          <p className="text-ink-soft">Finish a lesson first. Phrases you learn (and the ones that tripped you up) come back here at the right time.</p>
          <LinkButton href="/" block>
            Go learn something
          </LinkButton>
        </main>
      </>
    );
  }
  const unitIds = new Set(ids.map((id) => id.split(".")[0]));
  const pool = phrases.filter((p) => unitIds.has(p.id.split(".")[0]));
  const drill = generateDrill(ids, hashString(ids.join("|") + day), new Map(phrases.map((p) => [p.id, p.en])));
  return (
    <LessonPlayer
      lessonId={`review-${day}`}
      title="Review"
      canDo="You kept old phrases fresh. That's how they stick"
      kind="review"
      teach={[]}
      exercises={drill}
      phrases={pool}
      pool={pool}
    />
  );
}
