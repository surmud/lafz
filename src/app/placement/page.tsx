import { PlacementView } from "@/components/PlacementView";
import { allPhrases, courseMeta, placementQuestions } from "@/content";

export const metadata = { title: "Find your level · Lafz" };

export default function Placement() {
  const qs = placementQuestions();
  const all = allPhrases();
  const speakingIds = courseMeta()
    .filter((u) => u.track === "speaking")
    .sort((a, b) => a.order - b.order)
    .map((u) => u.id);
  // Pool for automatic distractors: every non-boss phrase in the course.
  const pool = [...all.values()].filter((p) => !p.id.includes(".b."));
  return <PlacementView questions={qs} phrases={pool} speakingUnitIds={speakingIds} units={courseMeta()} />;
}
