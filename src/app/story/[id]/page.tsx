import type { Metadata } from "next";
import { StoryView } from "@/components/StoryView";
import { allPhrases, slim, unit, units } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return units()
    .filter((u) => u.story)
    .map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${unit(id).story?.title ?? "Story"} · Lafz` };
}

/** Single words taught anywhere in the course, as a fallback glossary for tap-a-word. */
function courseWords(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of allPhrases().values()) {
    if (p.id.includes(".b.") || p.id.includes(".l-")) continue;
    const words = p.roman.replace(/[?!.,…]/g, "").trim().split(/\s+/);
    if (words.length === 1 && words[0]) out[words[0].toLowerCase()] ??= p.en;
  }
  return out;
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = unit(id);
  const story = u.story!;
  const phrases = allPhrases();
  const lines = story.lines.map((l) => ({ speaker: l.speaker, phrase: slim(phrases.get(l.phrase)!) }));
  return (
    <StoryView
      unitId={u.id}
      unitTitle={u.title}
      story={{ ...story, lines }}
      glossary={{ ...courseWords(), ...story.glossary }}
    />
  );
}
