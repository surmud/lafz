import type { Progress } from "./progress";

/** Lightweight course map used by the home screen and the can-do screen (no phrases). */
export interface LessonMeta {
  id: string;
  title: string;
  blurb: string;
  canDo: string;
}

export interface UnitMeta {
  id: string;
  track: "speaking" | "reading";
  stage?: "core" | "advanced";
  order: number;
  title: string;
  titleUrdu?: string;
  emoji: string;
  tagline: string;
  canDo: string;
  lessons: LessonMeta[];
  boss?: { id: string; title: string; blurb: string; character: string; canDo: string };
  phraseCount: number;
}

export type UnitStatus = "new" | "started" | "done" | "skipped";

export interface UnitProgress {
  status: UnitStatus;
  lessonsDone: number;
  lessonsTotal: number;
  bossDone: boolean;
}

export function unitProgress(unit: UnitMeta, p: Progress): UnitProgress {
  const lessonsDone = unit.lessons.filter((l) => p.lessons[l.id]).length;
  const bossDone = unit.boss ? Boolean(p.bosses[unit.boss.id]) : true;
  const lessonsTotal = unit.lessons.length;
  let status: UnitStatus;
  if (lessonsDone === lessonsTotal && bossDone) status = "done";
  else if (lessonsDone > 0 || (unit.boss && p.bosses[unit.boss.id])) status = "started";
  else if (p.skipped.includes(unit.id)) status = "skipped";
  else status = "new";
  return { status, lessonsDone, lessonsTotal, bossDone };
}

export type NextUp =
  | { kind: "lesson"; unit: UnitMeta; lesson: LessonMeta }
  | { kind: "boss"; unit: UnitMeta }
  | { kind: "finished" };

/**
 * What the "Continue" button should open: the first unfinished lesson (or boss) of the first unit
 * that is neither done nor skipped. Skipped units are only suggested once everything else is done.
 */
export function nextUp(units: readonly UnitMeta[], p: Progress, track: "speaking" | "reading" = "speaking"): NextUp {
  const ordered = units.filter((u) => u.track === track).sort((a, b) => a.order - b.order);
  const pass = (includeSkipped: boolean): NextUp | null => {
    for (const unit of ordered) {
      const up = unitProgress(unit, p);
      if (up.status === "done") continue;
      if (up.status === "skipped" && !includeSkipped) continue;
      const lesson = unit.lessons.find((l) => !p.lessons[l.id]);
      if (lesson) return { kind: "lesson", unit, lesson };
      if (unit.boss && !p.bosses[unit.boss.id]) return { kind: "boss", unit };
    }
    return null;
  };
  return pass(false) ?? pass(true) ?? { kind: "finished" };
}

export interface CanDo {
  id: string;
  text: string;
  done: boolean;
  kind: "lesson" | "boss" | "unit" | "family";
  unitId?: string;
}

/** Progress as can-dos: every lesson, boss and unit contributes one. */
export function canDos(units: readonly UnitMeta[], p: Progress): CanDo[] {
  const out: CanDo[] = [];
  for (const unit of [...units].sort((a, b) => a.track.localeCompare(b.track) * -1 || a.order - b.order)) {
    for (const l of unit.lessons) {
      out.push({ id: l.id, text: l.canDo, done: Boolean(p.lessons[l.id]), kind: "lesson", unitId: unit.id });
    }
    if (unit.boss) {
      out.push({
        id: unit.boss.id,
        text: unit.boss.canDo,
        done: Boolean(p.bosses[unit.boss.id]),
        kind: "boss",
        unitId: unit.id,
      });
    }
    out.push({
      id: unit.id,
      text: unit.canDo,
      done: unitProgress(unit, p).status === "done",
      kind: "unit",
      unitId: unit.id,
    });
  }
  out.push({
    id: "family.asked-5",
    text: "You asked your family for help 5 times (they loved it)",
    done: p.askedFamily >= 5,
    kind: "family",
  });
  return out;
}

export function nextCanDo(units: readonly UnitMeta[], p: Progress): string | null {
  const n = nextUp(units, p);
  if (n.kind === "lesson") return n.lesson.canDo;
  if (n.kind === "boss") return n.unit.boss?.canDo ?? null;
  return null;
}
