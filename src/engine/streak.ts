/**
 * A streak that never punishes (SPEC §11).
 *
 * - The streak counts days with any practice.
 * - Each ISO week comes with 2 automatic pause days. A missed day inside that allowance is "paused".
 * - Once the allowance runs out the streak *rests*. It is never reset: the number stays where it was
 *   and picks up again on the next practice day.
 * - The best streak is kept forever.
 *
 * All dates are local calendar days as "YYYY-MM-DD" strings, so time zones and DST cannot shift
 * a day. Day arithmetic is done in UTC on the calendar date, never on timestamps.
 */

export const PAUSES_PER_WEEK = 2;

export interface StreakState {
  current: number;
  best: number;
  /** Last local day with practice, or null if never practised. */
  lastDay: string | null;
  /** Total practice days ever. */
  totalDays: number;
}

export type StreakStatus = "new" | "done-today" | "active" | "paused" | "resting";

export interface StreakView {
  status: StreakStatus;
  current: number;
  best: number;
  /** Days missed since the last practice day (0 if practised today or yesterday). */
  missedDays: number;
  /** Pause days still available in the current ISO week. */
  pausesLeft: number;
}

export const emptyStreak: StreakState = { current: 0, best: 0, lastDay: null, totalDays: 0 };

/** Local calendar day for a Date, e.g. "2026-11-15". */
export function localDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toUtc(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}

export function addDays(day: string, n: number): string {
  const t = new Date(toUtc(day) + n * 86_400_000);
  const m = String(t.getUTCMonth() + 1).padStart(2, "0");
  const d = String(t.getUTCDate()).padStart(2, "0");
  return `${t.getUTCFullYear()}-${m}-${d}`;
}

/** Monday of the ISO week containing `day`. */
export function weekStart(day: string): string {
  const dow = new Date(toUtc(day)).getUTCDay(); // 0 = Sunday
  return addDays(day, -((dow + 6) % 7));
}

/** Missed days between the last practice day and `today` that fall in today's ISO week. */
function missedThisWeek(lastDay: string, today: string): number {
  const start = weekStart(today);
  const firstMissed = addDays(lastDay, 1);
  const from = daysBetween(firstMissed, start) > 0 ? start : firstMissed;
  return Math.max(0, daysBetween(from, today));
}

export function viewStreak(state: StreakState, today: string): StreakView {
  if (state.lastDay === null) {
    return { status: "new", current: 0, best: state.best, missedDays: 0, pausesLeft: PAUSES_PER_WEEK };
  }
  const gap = daysBetween(state.lastDay, today);
  const missedDays = Math.max(0, gap - 1);
  const usedThisWeek = Math.min(PAUSES_PER_WEEK, missedThisWeek(state.lastDay, today));
  const pausesLeft = PAUSES_PER_WEEK - usedThisWeek;
  let status: StreakStatus;
  if (gap <= 0) status = "done-today";
  else if (missedDays === 0) status = "active";
  else if (missedDays <= PAUSES_PER_WEEK) status = "paused";
  else status = "resting";
  return { status, current: state.current, best: state.best, missedDays, pausesLeft };
}

/** Record practice on `today`. Idempotent within a day; never lowers the streak. */
export function recordPractice(state: StreakState, today: string): StreakState {
  if (state.lastDay !== null && daysBetween(state.lastDay, today) <= 0) return state;
  const current = state.current + 1;
  return {
    current,
    best: Math.max(state.best, current),
    lastDay: today,
    totalDays: state.totalDays + 1,
  };
}
