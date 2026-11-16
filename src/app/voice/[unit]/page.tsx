import type { Metadata } from "next";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { slim, unit, units } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return units()
    .filter((u) => u.track === "speaking")
    .map((u) => ({ unit: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }): Promise<Metadata> {
  const { unit: id } = await params;
  return { title: `Record ${unit(id).title} · Lafz` };
}

export default async function VoiceUnit({ params }: { params: Promise<{ unit: string }> }) {
  const { unit: id } = await params;
  const u = unit(id);
  // Core phrases only: boss lines are long and scene-specific.
  return <VoiceRecorder title={u.title} phrases={u.phrases.filter((p) => !p.id.includes(".b.")).map(slim)} />;
}
