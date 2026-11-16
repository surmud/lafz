import type { Metadata } from "next";
import { PackView } from "@/components/PackView";
import { packs } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return packs().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${packs().find((p) => p.id === id)?.title ?? "Prep pack"} · Lafz` };
}

export default async function PackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pack = packs().find((p) => p.id === id)!;
  return <PackView pack={pack} />;
}
