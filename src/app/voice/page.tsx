import { VoiceIndex } from "@/components/VoiceRecorder";
import { courseMeta } from "@/content";

export const metadata = { title: "Family voice · Lafz" };

export default function Voice() {
  return <VoiceIndex units={courseMeta().filter((u) => u.track === "speaking")} />;
}
