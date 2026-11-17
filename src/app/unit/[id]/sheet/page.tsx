import type { Metadata } from "next";
import { CheatSheet } from "@/components/CheatSheet";
import { slim, unit, units } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return units()
    .filter((u) => u.track === "speaking")
    .map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${unit(id).title} cheat sheet · Lafz` };
}

/** One printable page per unit: grammar notes and every taught phrase, both scripts. */
export default async function Sheet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = unit(id);
  const taught = new Set(u.lessons.flatMap((l) => l.teach.flatMap((t) => ("phrase" in t ? [t.phrase] : []))));
  const phrases = u.phrases.filter((p) => taught.has(p.id)).map(slim);
  return <CheatSheet unitId={u.id} title={u.title} titleUrdu={u.titleUrdu} grammar={u.grammar} phrases={phrases} />;
}
