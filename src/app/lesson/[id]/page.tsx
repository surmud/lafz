import type { Metadata } from "next";
import { LessonPlayer } from "@/components/LessonPlayer";
import { lessonUnit, pickPhrases, slim, units } from "@/content";
import type { Lesson } from "@/content/schema";
import { phraseRefs } from "@/engine/exercises";

export const dynamicParams = false;

export function generateStaticParams() {
  return units().flatMap((u) => u.lessons.map((l) => ({ id: l.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = lessonUnit(id).lessons.find((x) => x.id === id);
  return { title: `${l?.title ?? "Lesson"} · Lafz` };
}

function lessonPhraseIds(l: Lesson): string[] {
  return [
    ...l.teach.flatMap((t) => ("phrase" in t ? [t.phrase] : (t.examples ?? []))),
    ...l.exercises.flatMap(phraseRefs),
  ];
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unit = lessonUnit(id);
  const idx = unit.lessons.findIndex((l) => l.id === id);
  const lesson = unit.lessons[idx] as Lesson;
  const nextLesson = unit.lessons[idx + 1];
  // Distractor pool: the unit's core phrases (boss-only lines are excluded to keep options fair).
  const pool = unit.phrases.filter((p) => !p.id.startsWith(`${unit.id}.b.`)).map(slim);
  const used = new Set(lessonPhraseIds(lesson));
  const phrases = pickPhrases([...used, ...pool.map((p) => p.id)]);
  const next = nextLesson
    ? { href: `/lesson/${nextLesson.id}/`, label: `Next: ${nextLesson.title}` }
    : unit.boss
      ? { href: `/boss/${unit.id}/`, label: `Conversation: ${unit.boss.title}` }
      : undefined;
  return (
    <LessonPlayer
      lessonId={lesson.id}
      title={lesson.title}
      canDo={lesson.canDo}
      kind="lesson"
      teach={lesson.teach}
      exercises={lesson.exercises}
      phrases={phrases}
      pool={pool}
      nextHref={next?.href}
      nextLabel={next?.label}
      exitHref={`/unit/${unit.id}/`}
    />
  );
}
