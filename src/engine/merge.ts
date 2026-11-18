import type { Completion, Progress } from "./progress";
import type { ReviewItem } from "./review";
import { SKILLS, type DayStat, type SkillStats } from "./skills";

/**
 * Merge two copies of progress (this device and the cloud copy) without losing anything either side
 * earned. Commutative, so it doesn't matter which copy is "local". Rules:
 * - lessons and bosses: union; per id the earliest first, latest last, most times (and all endings)
 * - XP, seconds, askedFamily: the higher value
 * - streak: the best streak is the max; the current one comes from whichever copy practised last
 * - review deck: per phrase the copy that has seen it more recently wins, keeping the most lapses
 * - skills and days: per key the larger tally
 * Recordings never sync (they stay on the device), so they are not part of Progress.
 */
function completion(a: Completion | undefined, b: Completion | undefined): Completion | undefined {
  if (!a) return b;
  if (!b) return a;
  return { first: a.first < b.first ? a.first : b.first, last: a.last > b.last ? a.last : b.last, times: Math.max(a.times, b.times) };
}

function mergeRecords<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T | undefined, y: T | undefined) => T | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const v = pick(a[k], b[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

const later = (a: string | null, b: string | null) => (a === null ? b : b === null ? a : a > b ? a : b);

export function mergeProgress(a: Progress, b: Progress): Progress {
  const streakFrom = later(a.streak.lastDay, b.streak.lastDay) === a.streak.lastDay ? a.streak : b.streak;
  const review = mergeRecords<ReviewItem>(a.review, b.review, (x, y) => {
    if (!x || !y) return x ?? y;
    const newer = x.due >= y.due ? x : y;
    return { ...newer, lapses: Math.max(x.lapses, y.lapses) };
  });
  const skills: SkillStats = {};
  for (const s of SKILLS) {
    const x = a.skills[s];
    const y = b.skills[s];
    const v = !x ? y : !y ? x : x.seen >= y.seen ? x : y;
    if (v) skills[s] = v;
  }
  const days = mergeRecords<DayStat>(a.days, b.days, (x, y) => (!x || !y ? (x ?? y) : x.answers + x.seconds >= y.answers + y.seconds ? x : y));
  return {
    ...a,
    profile: {
      kind: a.profile.kind ?? b.profile.kind,
      onboarded: a.profile.onboarded || b.profile.onboarded,
    },
    xp: Math.max(a.xp, b.xp),
    streak: {
      ...streakFrom,
      best: Math.max(a.streak.best, b.streak.best, streakFrom.current),
      totalDays: Math.max(a.streak.totalDays, b.streak.totalDays),
    },
    lessons: mergeRecords(a.lessons, b.lessons, completion),
    bosses: mergeRecords(a.bosses, b.bosses, (x, y) => {
      const c = completion(x, y);
      return c ? { ...c, outcomes: [...new Set([...(x?.outcomes ?? []), ...(y?.outcomes ?? [])])] } : undefined;
    }),
    skipped: [...new Set([...a.skipped, ...b.skipped])],
    placement: !a.placement ? b.placement : !b.placement ? a.placement : a.placement.day >= b.placement.day ? a.placement : b.placement,
    review,
    askedFamily: Math.max(a.askedFamily, b.askedFamily),
    seconds: Math.max(a.seconds, b.seconds),
    skills,
    days,
  };
}
