import { FamilyView } from "@/components/FamilyView";
import { pickPhrases, relatives } from "@/content";

export const metadata = { title: "Family · Lafz" };

export default function Family() {
  const rel = relatives();
  return <FamilyView relatives={rel} phrases={pickPhrases(rel.map((r) => r.phrase))} />;
}
