import { describe, expect, test } from "vitest";
import {
  addDays,
  daysBetween,
  emptyStreak,
  localDay,
  recordPractice,
  viewStreak,
  weekStart,
  type StreakState,
} from "./streak";

const practise = (days: string[]) => days.reduce<StreakState>((s, d) => recordPractice(s, d), emptyStreak);

describe("date helpers", () => {
  test("localDay uses the local calendar date", () => {
    expect(localDay(new Date(2026, 10, 15, 23, 59))).toBe("2026-11-15");
    expect(localDay(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });
  test("daysBetween and addDays cross DST changes and year ends", () => {
    expect(daysBetween("2026-03-07", "2026-03-09")).toBe(2); // US spring forward
    expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2); // US fall back
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2); // EU spring forward
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
  test("weekStart is the Monday", () => {
    expect(weekStart("2026-11-15")).toBe("2026-11-09"); // Sunday
    expect(weekStart("2026-11-09")).toBe("2026-11-09"); // Monday
    expect(weekStart("2026-11-11")).toBe("2026-11-09");
  });
});

describe("streak that never punishes", () => {
  test("new learner", () => {
    expect(viewStreak(emptyStreak, "2026-11-15")).toMatchObject({ status: "new", current: 0, pausesLeft: 2 });
  });

  test("consecutive days count up; same day is idempotent", () => {
    const s = practise(["2026-11-10", "2026-11-10", "2026-11-11", "2026-11-12"]);
    expect(s).toMatchObject({ current: 3, best: 3, totalDays: 3, lastDay: "2026-11-12" });
    expect(viewStreak(s, "2026-11-12").status).toBe("done-today");
    expect(viewStreak(s, "2026-11-13")).toMatchObject({ status: "active", missedDays: 0, pausesLeft: 2 });
  });

  test("one or two missed days are paused, not lost", () => {
    const s = practise(["2026-11-09", "2026-11-10"]);
    expect(viewStreak(s, "2026-11-12")).toMatchObject({ status: "paused", missedDays: 1, pausesLeft: 1, current: 2 });
    expect(viewStreak(s, "2026-11-13")).toMatchObject({ status: "paused", missedDays: 2, pausesLeft: 0 });
    expect(recordPractice(s, "2026-11-13").current).toBe(3);
  });

  test("away for nine days: the streak rests and resumes, never resets", () => {
    const s = practise(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04"]);
    const view = viewStreak(s, "2026-11-13");
    expect(view).toMatchObject({ status: "resting", current: 4, best: 4, missedDays: 8 });
    const back = recordPractice(s, "2026-11-13");
    expect(back).toMatchObject({ current: 5, best: 5, totalDays: 5 });
  });

  test("pause allowance refreshes each ISO week", () => {
    const s = practise(["2026-11-06"]); // Friday
    // Monday: Sat and Sun were missed last week, so this week's pauses are untouched.
    expect(viewStreak(s, "2026-11-09")).toMatchObject({ status: "paused", missedDays: 2, pausesLeft: 2 });
    // Wednesday: Mon and Tue missed this week.
    expect(viewStreak(s, "2026-11-11")).toMatchObject({ status: "resting", pausesLeft: 0 });
  });

  test("a clock that goes backwards never lowers anything", () => {
    const s = practise(["2026-11-10", "2026-11-11"]);
    expect(recordPractice(s, "2026-11-09")).toBe(s);
    expect(viewStreak(s, "2026-11-09").status).toBe("done-today");
  });

  test("best is kept forever", () => {
    const s: StreakState = { current: 2, best: 40, lastDay: "2026-01-01", totalDays: 60 };
    expect(recordPractice(s, "2026-11-15")).toMatchObject({ current: 3, best: 40, totalDays: 61 });
  });
});
