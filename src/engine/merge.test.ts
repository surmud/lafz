import { describe, expect, test } from "vitest";
import { mergeProgress } from "./merge";
import { emptyProgress, type Progress } from "./progress";

const c = (first: string, last: string, times: number) => ({ first, last, times });
const phone: Progress = {
  ...emptyProgress,
  profile: { kind: "heritage", onboarded: true },
  xp: 120,
  streak: { current: 3, best: 5, lastDay: "2026-11-10", totalDays: 9 },
  lessons: { a: c("2026-11-01", "2026-11-05", 2), b: c("2026-11-03", "2026-11-03", 1) },
  bosses: { x: { ...c("2026-11-04", "2026-11-04", 1), outcomes: ["good"] } },
  skipped: ["u01"],
  review: { p1: { box: 3, due: "2026-11-12", lapses: 1 }, p2: { box: 1, due: "2026-11-11", lapses: 0 } },
  skills: { listening: { seen: 10, right: 8 } },
  days: { "2026-11-10": { answers: 10, right: 8, seconds: 100, sessions: 1 } },
  seconds: 400,
  askedFamily: 2,
};
const laptop: Progress = {
  ...emptyProgress,
  profile: { kind: null, onboarded: true },
  xp: 90,
  streak: { current: 7, best: 7, lastDay: "2026-11-12", totalDays: 7 },
  lessons: { a: c("2026-10-30", "2026-11-02", 3), c: c("2026-11-12", "2026-11-12", 1) },
  bosses: { x: { ...c("2026-11-06", "2026-11-06", 1), outcomes: ["bold"] } },
  skipped: ["u02"],
  review: { p1: { box: 1, due: "2026-11-13", lapses: 2 } },
  skills: { listening: { seen: 4, right: 4 }, recall: { seen: 6, right: 3 } },
  days: { "2026-11-12": { answers: 6, right: 6, seconds: 60, sessions: 1 } },
  placement: { unit: 4, correct: 5, total: 7, day: "2026-11-01" },
  seconds: 300,
  askedFamily: 5,
};

describe("mergeProgress", () => {
  const m = mergeProgress(phone, laptop);
  test("keeps every lesson and boss, with the widest dates and most repeats", () => {
    expect(m.lessons).toEqual({ a: c("2026-10-30", "2026-11-05", 3), b: phone.lessons.b, c: laptop.lessons.c });
    expect(m.bosses.x).toEqual({ ...c("2026-11-04", "2026-11-06", 1), outcomes: ["good", "bold"] });
    expect(m.skipped.sort()).toEqual(["u01", "u02"]);
  });
  test("higher XP, best streak, current streak from the most recent practice", () => {
    expect(m.xp).toBe(120);
    expect(m.streak).toEqual({ current: 7, best: 7, lastDay: "2026-11-12", totalDays: 9 });
    expect(m.seconds).toBe(400);
    expect(m.askedFamily).toBe(5);
  });
  test("review, skills, days, placement and profile", () => {
    expect(m.review.p1).toEqual({ box: 1, due: "2026-11-13", lapses: 2 });
    expect(m.review.p2).toEqual(phone.review.p2);
    expect(m.skills).toEqual({ listening: { seen: 10, right: 8 }, recall: { seen: 6, right: 3 } });
    expect(Object.keys(m.days).sort()).toEqual(["2026-11-10", "2026-11-12"]);
    expect(m.placement?.unit).toBe(4);
    expect(m.profile).toEqual({ kind: "heritage", onboarded: true });
  });
  test("is commutative on what matters and idempotent", () => {
    const r = mergeProgress(laptop, phone);
    expect(r.lessons).toEqual(m.lessons);
    expect(r.xp).toBe(m.xp);
    expect(r.streak).toEqual(m.streak);
    expect(mergeProgress(m, m)).toEqual(m);
    expect(mergeProgress(emptyProgress, phone).lessons).toEqual(phone.lessons);
  });
});
