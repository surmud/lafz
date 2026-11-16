import { ReadView } from "@/components/ReadView";
import { courseMeta } from "@/content";

export const metadata = { title: "Read Nastaliq · Lafz" };

export default function Read() {
  return <ReadView units={courseMeta().filter((u) => u.track === "reading")} />;
}
