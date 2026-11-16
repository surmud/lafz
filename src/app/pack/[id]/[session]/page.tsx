import type { Metadata } from "next";
import { LessonPlayer } from "@/components/LessonPlayer";
import { pickPhrases, packs } from "@/content";
import { generateDrill } from "@/engine/exercises";
import { hashString } from "@/engine/rng";

export const dynamicParams = false;

export function generateStaticParams() {
  return packs().flatMap((p) => p.sessions.map((s) => ({ id: p.id, session: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; session: string }> }): Promise<Metadata> {
  const { id, session } = await params;
  const pack = packs().find((p) => p.id === id);
  return { title: `${pack?.sessions.find((s) => s.id === session)?.title ?? "Session"} · ${pack?.title ?? ""} · Lafz` };
}

/** A prep-pack session: quick teach cards for each phrase, then a generated production-heavy drill. */
export default async function PackSession({ params }: { params: Promise<{ id: string; session: string }> }) {
  const { id, session } = await params;
  const pack = packs().find((p) => p.id === id)!;
  const idx = pack.sessions.findIndex((s) => s.id === session);
  const s = pack.sessions[idx]!;
  const next = pack.sessions[idx + 1];
  // Distractor pool: every phrase in the pack, so options stay on-topic.
  const pool = pickPhrases(pack.sessions.flatMap((x) => x.phrases));
  return (
    <LessonPlayer
      lessonId={`pack.${pack.id}.${s.id}`}
      title={s.title}
      canDo={idx === pack.sessions.length - 1 ? pack.canDo : `${s.title}: done. ${s.blurb}`}
      kind="lesson"
      teach={s.phrases.map((p) => ({ phrase: p }))}
      exercises={generateDrill(s.phrases, hashString(`${pack.id}.${s.id}`), new Map(pool.map((p) => [p.id, p.en])))}
      phrases={pool}
      pool={pool}
      nextHref={next ? `/pack/${pack.id}/${next.id}/` : `/pack/${pack.id}/`}
      nextLabel={next ? `Next: ${next.title}` : "Back to the pack"}
      exitHref={`/pack/${pack.id}/`}
    />
  );
}
