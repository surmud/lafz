import { ShadowView } from "@/components/ShadowView";
import { courseMeta } from "@/content";

export const metadata = { title: "Shadowing · Lafz" };

export default function Shadow() {
  const units = courseMeta()
    .filter((u) => u.track === "speaking")
    .map((u) => ({ id: u.id, title: u.title, order: u.order, emoji: u.emoji }));
  return <ShadowView units={units} />;
}
