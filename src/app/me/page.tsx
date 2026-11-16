import { MeView } from "@/components/MeView";
import { courseMeta } from "@/content";

export const metadata = { title: "Me · Lafz" };

export default function Me() {
  return <MeView units={courseMeta()} />;
}
