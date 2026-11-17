import { ListenMode } from "@/components/ListenMode";
import { courseMeta } from "@/content";

export const metadata = { title: "Listening mode · Lafz" };

export default function Listen() {
  const units = courseMeta()
    .filter((u) => u.track === "speaking")
    .map((u) => ({ id: u.id, title: u.title, order: u.order, emoji: u.emoji }));
  return <ListenMode units={units} />;
}
