import { describe, expect, test } from "vitest";
import type { UnitMeta } from "./course";
import { completeBoss, completeLesson, emptyProgress, migrate, type Progress } from "./progress";
import { addTally, DAYS_KEPT, estimateLevel, extremes, MIN_ANSWERS, recentDays, recordDay, skillScores, snapshot, tallyAnswer } from "./skills";
import { addDays } from "./streak";

const unit = (n: number, stage: "core" | "advanced" = "core", track: "speaking" | "reading" = "speaking"): UnitMeta => ({
  id: `${track === "reading" ? "r" : "u"}${String(n).padStart(2, "0")}`,
  track,
  stage,
  order: n,
  title: `Unit ${n}`,
  emoji: "x",
  tagline: "",
  canDo: "",
  phraseCount: 1,
  lessons: [{ id: `${track[0]}${n}-l1`, title: "", blurb: "", canDo: "" }],
});
const units = [...Array.from({ length: 10 }, (_, i) => unit(i + 1)), unit(11, "advanced"), unit(12, "advanced"), unit(1, "core", "reading")];
const done = (p: Progress, ids: string[]): Progress => ({ ...p, lessons: Object.fromEntries(ids.map((id) => [id, { first: "2026-01-01", last: "2026-01-01", times: 1 }])) });

describe("tallies", () => {
  test("answers add up by skill", () => {
    let t = tallyAnswer({}, "listening", true);
    t = tallyAnswer(t, "listening", false);
    t = tallyAnswer(t, "recall", true);
    expect(t).toEqual({ listening: { seen: 2, right: 1 }, recall: { seen: 1, right: 1 } });
    expect(addTally(t, t).listening).toEqual({ seen: 4, right: 2 });
    expect(addTally({}, {})).toEqual({});
  });
  test("scores need a minimum sample", () => {
    const s = skillScores({ listening: { seen: MIN_ANSWERS, right: 6 }, recall: { seen: 2, right: 2 } });
    expect(s.find((x) => x.skill === "listening")?.accuracy).toBe(6 / MIN_ANSWERS);
    expect(s.find((x) => x.skill === "recall")?.accuracy).toBeNull();
    expect(s.find((x) => x.skill === "grammar")).toEqual({ skill: "grammar", seen: 0, accuracy: null });
    expect(extremes(s)).toBeNull();
    const two = skillScores({ listening: { seen: 10, right: 9 }, grammar: { seen: 10, right: 4 } });
    expect(extremes(two)?.best.skill).toBe("listening");
    expect(extremes(two)?.worst.skill).toBe("grammar");
  });
});

describe("days", () => {
  test("a session adds to the day and old days fall off", () => {
    const old = addDays("2026-06-01", -DAYS_KEPT - 1);
    let d = recordDay({ [old]: { answers: 1, right: 1, seconds: 1, sessions: 1 } }, "2026-06-01", { tally: { listening: { seen: 3, right: 2 } }, seconds: 61.4 });
    expect(d[old]).toBeUndefined();
    expect(d["2026-06-01"]).toEqual({ answers: 3, right: 2, seconds: 61, sessions: 1 });
    d = recordDay(d, "2026-06-01", { seconds: -5 });
    expect(d["2026-06-01"]).toEqual({ answers: 3, right: 2, seconds: 61, sessions: 2 });
    const recent = recentDays(d, "2026-06-02", 3);
    expect(recent.map((x) => x.day)).toEqual(["2026-05-31", "2026-06-01", "2026-06-02"]);
    expect(recent.map((x) => x.answers)).toEqual([0, 3, 0]);
  });
  test("lessons and bosses record skills and days; old saves migrate", () => {
    const r = completeLesson(emptyProgress, {
      lessonId: "s1-l1",
      kind: "lesson",
      stats: { exercises: 2, firstTry: 2, comebacks: 0, mistakes: 0, skipped: 0, letGo: 0 },
      practised: [],
      missed: [],
      seconds: 30,
      today: "2026-06-01",
      tally: { grammar: { seen: 2, right: 2 } },
    });
    expect(r.progress.skills.grammar).toEqual({ seen: 2, right: 2 });
    expect(r.progress.days["2026-06-01"]?.sessions).toBe(1);
    const b = completeBoss(r.progress, { bossId: "b", outcome: "x", seconds: 10, today: "2026-06-01" });
    expect(b.progress.days["2026-06-01"]).toMatchObject({ sessions: 2, seconds: 40, answers: 2 });
    const m = migrate({ xp: 5 });
    expect(m.skills).toEqual({});
    expect(m.days).toEqual({});
  });
});

describe("level estimate", () => {
  test("bands follow core coverage, then advanced units", () => {
    expect(estimateLevel(units, emptyProgress).band).toBe("starter");
    expect(estimateLevel(units, done(emptyProgress, ["s1-l1", "s2-l1"])).band).toBe("survival");
    expect(estimateLevel(units, { ...emptyProgress, skipped: ["u01", "u02", "u03", "u04", "u05"] }).band).toBe("conversational");
    const core = Array.from({ length: 10 }, (_, i) => `s${i + 1}-l1`);
    expect(estimateLevel(units, done(emptyProgress, core)).band).toBe("confident");
    const all = estimateLevel(units, done(emptyProgress, [...core, "s11-l1", "s12-l1"]));
    expect(all).toMatchObject({ band: "advanced", coreCovered: 10, coreTotal: 10, advancedDone: 2 });
    expect(estimateLevel([], emptyProgress).band).toBe("starter");
  });
  test("vocabulary counts", () => {
    const p: Progress = { ...emptyProgress, review: { a: { box: 1, due: "x", lapses: 0 }, b: { box: 3, due: "x", lapses: 1 } } };
    expect(estimateLevel(units, p)).toMatchObject({ met: 2, solid: 1 });
  });
});

test("snapshot has counts and rates only", () => {
  const p: Progress = {
    ...done(emptyProgress, ["s1-l1", "s2-l1", "r1-l1", "review-2026-01-01"]),
    profile: { kind: "heritage", onboarded: true, relatives: { khala: "Secret Name" } },
    seconds: 600,
    skills: { listening: { seen: 10, right: 7 }, recall: { seen: 3, right: 3 } },
    days: { "2026-01-01": { answers: 13, right: 10, seconds: 600, sessions: 3 } },
    placement: { unit: 3, correct: 4, total: 7, day: "2026-01-01" },
  };
  const s = snapshot(units, p);
  expect(s).toMatchObject({ v: 1, kind: "heritage", lessons: 3, placedAt: 3, activeDays: 1, minutes: 10, accuracy: { listening: 0.7 }, answers: { listening: 10, recall: 3 } });
  expect(s.furthest).toEqual({ speaking: "s2-l1", reading: "r1-l1" });
  expect(JSON.stringify(s)).not.toContain("Secret");
  expect(snapshot(units, emptyProgress)).toMatchObject({ placedAt: null, furthest: { speaking: null, reading: null } });
});
