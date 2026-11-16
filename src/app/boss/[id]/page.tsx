import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BossPlayer } from "@/components/BossPlayer";
import { characters, pickPhrases, unit, units } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return units()
    .filter((u) => u.boss)
    .map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${unit(id).boss?.title ?? "Boss"} · Lafz` };
}

export default async function BossPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = unit(id);
  if (!u.boss) notFound();
  const ids = new Set<string>();
  for (const n of Object.values(u.boss.nodes)) {
    if (n.type === "npc") ids.add(n.say);
    if (n.type === "you") n.options.forEach((o) => ids.add(o.phrase));
  }
  const speakers = new Set([u.boss.character, ...Object.values(u.boss.nodes).flatMap((n) => (n.type === "npc" ? [n.speaker] : []))]);
  const next = units().find((x) => x.track === u.track && x.order === u.order + 1);
  return (
    <BossPlayer
      unitId={u.id}
      convo={u.boss}
      phrases={pickPhrases(ids)}
      characters={characters().filter((c) => speakers.has(c.id))}
      nextHref={next ? `/unit/${next.id}/` : undefined}
    />
  );
}
