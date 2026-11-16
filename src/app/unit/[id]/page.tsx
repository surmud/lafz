import type { Metadata } from "next";
import { UnitView } from "@/components/UnitView";
import { characters, courseMeta, unit, units } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return units().map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${unit(id).title} · Lafz` };
}

export default async function UnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = unit(id);
  const meta = courseMeta().find((m) => m.id === id)!;
  const ch = u.boss ? characters().find((c) => c.id === u.boss?.character) : undefined;
  return <UnitView meta={meta} grammar={u.grammar} character={ch} />;
}
