import { ReviewView } from "@/components/ReviewView";
import { allPhrases, slim } from "@/content";

export const metadata = { title: "Trouble words · Lafz" };

export default function Trouble() {
  const phrases = [...allPhrases().values()].filter((p) => !p.id.includes(".b.")).map(slim);
  return <ReviewView phrases={phrases} kind="trouble" />;
}
