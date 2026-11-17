import { InsightsView } from "@/components/InsightsView";
import { courseMeta } from "@/content";

export const metadata = { title: "Insights · Lafz" };

export default function Insights() {
  return <InsightsView units={courseMeta()} />;
}
