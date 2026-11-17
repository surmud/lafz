import { GrammarGuide } from "@/components/GrammarGuide";
import { units } from "@/content";

export const metadata = { title: "Grammar guide · Lafz" };

export default function Grammar() {
  const sections = units()
    .filter((u) => u.grammar.length > 0)
    .map((u) => ({ id: u.id, label: u.track === "reading" ? `Reading ${u.order}` : `Unit ${u.order}`, title: u.title, notes: u.grammar }));
  return <GrammarGuide sections={sections} />;
}
