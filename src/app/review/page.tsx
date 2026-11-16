import { ReviewView } from "@/components/ReviewView";
import { allPhrases, slim } from "@/content";

export const metadata = { title: "Review · Lafz" };

/**
 * The review deck lives on the device, so the page ships the course's phrases (core phrases only,
 * no boss lines) and builds the session client-side.
 */
export default function Review() {
  const phrases = [...allPhrases().values()].filter((p) => !p.id.includes(".b.")).map(slim);
  return <ReviewView phrases={phrases} />;
}
