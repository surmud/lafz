import { StoriesList } from "@/components/StoriesList";
import { courseMeta } from "@/content";

export const metadata = { title: "Stories · Lafz" };

export default function Stories() {
  const list = courseMeta()
    .filter((u) => u.story)
    .map((u) => ({ unitId: u.id, order: u.order, unitTitle: u.title, reading: u.track === "reading", ...u.story! }));
  return <StoriesList stories={list} />;
}
