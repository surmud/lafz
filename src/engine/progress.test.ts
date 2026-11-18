import { describe, expect, test } from "vitest";
import { canDos, nextCanDo, nextUp, unitProgress, type UnitMeta } from "./course";
import type { LessonStats } from "./lesson";
import {
  applyPlacement,
  completeBoss,
  completeLesson,
  emptyProgress,
  migrate,
  recordAskedFamily,
  type Progress,
} from "./progress";

const stats = (over: Partial<LessonStats> = {}): LessonStats => ({
  exercises: 5,
  firstTry: 5,
  comebacks: 0,
  mistakes: 0,
  skipped: 0,
  letGo: 0,
  ...over,
});

const unit = (n: number, track: "speaking" | "reading" = "speaking", boss = true): UnitMeta => ({
  id: `${track === "speaking" ? "u" : "r"}0${n}`,
  track,
  order: n,
  title: `Unit ${n}`,
  emoji: "x",
  tagline: "",
  canDo: `unit ${n} cando`,
  phraseCount: 4,
  lessons: [1, 2].map((l) => ({ id: `u0${n}-l${l}`, title: "", blurb: "", canDo: `u${n} l${l} cando` })),
  boss: boss ? { id: `u0${n}-boss`, title: "", blurb: "", character: "khala", canDo: `u${n} boss cando` } : undefined,
});
const units = [unit(2), unit(1), unit(3, "speaking", false), unit(1, "reading", false)];

describe("progress", () => {
  test("completing a lesson adds xp, streak, review items and time", () => {
    const { progress, xp } = completeLesson(emptyProgress, {
      lessonId: "u01-l1",
      kind: "lesson",
      stats: stats({ comebacks: 1, mistakes: 1 }),
      practised: ["a", "b"],
      missed: ["b"],
      seconds: 130.4,
      today: "2026-11-15",
    });
    expect(xp.total).toBe(12);
    expect(progress.xp).toBe(12);
    expect(progress.streak.current).toBe(1);
    expect(progress.lessons["u01-l1"]).toEqual({ first: "2026-11-15", last: "2026-11-15", times: 1 });
    expect(progress.review.a).toMatchObject({ box: 1, lapses: 0 });
    expect(progress.review.b).toMatchObject({ box: 1, lapses: 1 });
    expect(progress.seconds).toBe(130);

    const again = completeLesson(progress, {
      lessonId: "u01-l1",
      kind: "lesson",
      stats: stats(),
      practised: ["a"],
      missed: [],
      seconds: -5,
      today: "2026-11-16",
    }).progress;
    expect(again.lessons["u01-l1"]).toEqual({ first: "2026-11-15", last: "2026-11-16", times: 2 });
    expect(again.streak.current).toBe(2);
    expect(again.seconds).toBe(130);
  });

  test("a review session promotes what was right and demotes what was wrong", () => {
    const start: Progress = {
      ...emptyProgress,
      review: { a: { box: 2, due: "2026-11-15", lapses: 0 }, b: { box: 3, due: "2026-11-15", lapses: 0 } },
    };
    const { progress, xp } = completeLesson(start, {
      lessonId: "review",
      kind: "review",
      stats: stats(),
      practised: ["a", "b"],
      missed: ["b"],
      seconds: 60,
      today: "2026-11-15",
    });
    expect(xp.base).toBe(5);
    expect(progress.review.a?.box).toBe(3);
    expect(progress.review.b).toMatchObject({ box: 1, lapses: 1 });
  });

  test("boss: full xp for each new ending, a little for replays", () => {
    let r = completeBoss(emptyProgress, { bossId: "u01-boss", outcome: "good", seconds: 90, today: "2026-11-15" });
    expect(r.xp.total).toBe(20);
    r = completeBoss(r.progress, { bossId: "u01-boss", outcome: "good", seconds: 90, today: "2026-11-15" });
    expect(r.xp.total).toBe(5);
    r = completeBoss(r.progress, { bossId: "u01-boss", outcome: "rude", seconds: 90, today: "2026-11-15" });
    expect(r.xp.total).toBe(20);
    expect(r.progress.bosses["u01-boss"]).toMatchObject({ times: 3, outcomes: ["good", "rude"] });
    expect(r.progress.xp).toBe(45);
  });

  test("placement marks earlier units skipped; family asks are counted", () => {
    const p = applyPlacement(emptyProgress, { unit: 3, correct: 4, total: 6 }, ["u01", "u02", "u03"], "2026-11-15");
    expect(p.skipped).toEqual(["u01", "u02"]);
    expect(p.placement).toEqual({ unit: 3, correct: 4, total: 6, day: "2026-11-15" });
    expect(applyPlacement(emptyProgress, { unit: 1, correct: 0, total: 3 }, ["u01"], "x").skipped).toEqual([]);
    expect(recordAskedFamily(p).askedFamily).toBe(1);
  });

  test("migrate fills gaps and survives junk", () => {
    expect(migrate(null)).toEqual(emptyProgress);
    expect(migrate("nope")).toEqual(emptyProgress);
    const m = migrate({ xp: 40, skipped: "bad", profile: { kind: "heritage" } });
    expect(m).toMatchObject({ xp: 40, skipped: [], profile: { kind: "heritage", onboarded: false } });
    expect(migrate({ skipped: ["u01"], streak: { current: 3 } })).toMatchObject({
      skipped: ["u01"],
      streak: { current: 3, best: 0 },
    });
  });
});

describe("course map", () => {
  const done = (ids: string[], bosses: string[] = []): Progress => ({
    ...emptyProgress,
    lessons: Object.fromEntries(ids.map((i) => [i, { first: "d", last: "d", times: 1 }])),
    bosses: Object.fromEntries(bosses.map((i) => [i, { first: "d", last: "d", times: 1, outcomes: ["good"] }])),
  });

  test("unit status", () => {
    const u1 = units[1] as UnitMeta;
    expect(unitProgress(u1, emptyProgress)).toEqual({ status: "new", lessonsDone: 0, lessonsTotal: 2, bossDone: false });
    expect(unitProgress(u1, done(["u01-l1"])).status).toBe("started");
    expect(unitProgress(u1, done([], ["u01-boss"])).status).toBe("started");
    expect(unitProgress(u1, done(["u01-l1", "u01-l2"])).status).toBe("started");
    expect(unitProgress(u1, done(["u01-l1", "u01-l2"], ["u01-boss"])).status).toBe("done");
    expect(unitProgress(u1, { ...emptyProgress, skipped: ["u01"] }).status).toBe("skipped");
    expect(unitProgress(units[2] as UnitMeta, done(["u03-l1", "u03-l2"])).status).toBe("done");
  });

  test("continue goes lesson → boss → next unit, in order", () => {
    expect(nextUp(units, emptyProgress)).toMatchObject({ kind: "lesson", lesson: { id: "u01-l1" } });
    expect(nextUp(units, done(["u01-l1"]))).toMatchObject({ kind: "lesson", lesson: { id: "u01-l2" } });
    expect(nextUp(units, done(["u01-l1", "u01-l2"]))).toMatchObject({ kind: "boss", unit: { id: "u01" } });
    expect(nextUp(units, done(["u01-l1", "u01-l2"], ["u01-boss"]))).toMatchObject({ lesson: { id: "u02-l1" } });
    expect(nextUp(units, emptyProgress, "reading")).toMatchObject({ kind: "lesson", unit: { id: "r01" } });
    expect(nextCanDo(units, emptyProgress)).toBe("u1 l1 cando");
    expect(nextCanDo(units, done(["u01-l1", "u01-l2"]))).toBe("u1 boss cando");
  });

  test("skipped units are passed over, then offered at the very end", () => {
    const skipped: Progress = { ...emptyProgress, skipped: ["u01", "u02"] };
    expect(nextUp(units, skipped)).toMatchObject({ lesson: { id: "u03-l1" } });
    const rest: Progress = { ...done(["u03-l1", "u03-l2"]), skipped: ["u01", "u02"] };
    expect(nextUp(units, rest)).toMatchObject({ lesson: { id: "u01-l1" } });
    const all = done(["u01-l1", "u01-l2", "u02-l1", "u02-l2", "u03-l1", "u03-l2"], ["u01-boss", "u02-boss"]);
    expect(nextUp(units, all)).toEqual({ kind: "finished" });
    expect(nextCanDo(units, all)).toBeNull();
  });

  test("can-dos list every lesson, boss and unit plus the family badge", () => {
    const list = canDos(units, { ...done(["u01-l1"]), askedFamily: 5 });
    expect(list.filter((c) => c.kind === "lesson")).toHaveLength(8);
    expect(list.filter((c) => c.kind === "boss")).toHaveLength(2);
    expect(list.filter((c) => c.kind === "unit")).toHaveLength(4);
    expect(list.find((c) => c.id === "u01-l1")?.done).toBe(true);
    expect(list.find((c) => c.id === "u01")?.done).toBe(false);
    expect(list.at(-1)).toMatchObject({ kind: "family", done: true });
    expect(list[0]?.unitId).toBe("u01"); // speaking first, in order
  });
});

test("migrate drops relatives' names stored by older versions", () => {
  const m = migrate({ profile: { kind: "beginner", onboarded: true, relatives: { khala: "Rubina" } } });
  expect(m.profile).toEqual({ kind: "beginner", onboarded: true });
});
