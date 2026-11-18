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
function courseWords(): { gloss: Record<string, string>; ids: Record<string, string> } {
  const gloss: Record<string, string> = {};
  const ids: Record<string, string> = {};
  for (const p of allPhrases().values()) {
    if (p.id.includes(".b.") || p.id.includes(".l-")) continue;
    const words = p.roman.replace(/[?!.,…]/g, "").trim().split(/\s+/);
    const w = words.length === 1 ? words[0]?.toLowerCase() : undefined;
    if (w && !(w in gloss)) {
      gloss[w] = p.en;
      ids[w] = p.id;
    }
  }
  return { gloss, ids };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = unit(id);
  const story = u.story!;
  const phrases = allPhrases();
  const lines = story.lines.map((l) => ({ speaker: l.speaker, phrase: slim(phrases.get(l.phrase)!) }));
  const words = courseWords();
  return (
    <StoryView
      unitId={u.id}
      unitTitle={u.title}
      story={{ ...story, lines }}
      glossary={{ ...words.gloss, ...story.glossary }}
      wordIds={words.ids}
    />
  );
}
