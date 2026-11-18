import type { LessonStats } from "./lesson";
import { introduce, recordReview, type ReviewDeck } from "./review";
import { addTally, recordDay, type DayStat, type SkillStats } from "./skills";
import { emptyStreak, recordPractice, type StreakState } from "./streak";
import { lessonXp, type XpBreakdown } from "./xp";

/** Everything Lafz knows about the learner. Lives only on the device. */
export interface Progress {
  v: 1;
  profile: {
    kind: "heritage" | "beginner" | null;
    onboarded: boolean;
  };
  xp: number;
  streak: StreakState;
  /** Completed lessons, review sessions and prep-pack sessions by id. */
  lessons: Record<string, Completion>;
  /** Completed boss conversations by id, with the endings seen. */
  bosses: Record<string, Completion & { outcomes: string[] }>;
  /** Units placement suggested skipping. They stay open: "skipped, review anytime". */
  skipped: string[];
  placement: { unit: number; correct: number; total: number; day: string } | null;
  review: ReviewDeck;
  askedFamily: number;
  /** Seconds spent in lessons and conversations. */
  seconds: number;
  /** Answers checked, by the skill they train (engine/skills.ts). */
  skills: SkillStats;
  /** Activity by local day, for the last few months. */
  days: Record<string, DayStat>;
}

export interface Completion {
  first: string;
  last: string;
  times: number;
}

export const emptyProgress: Progress = {
  v: 1,
  profile: { kind: null, onboarded: false },
  xp: 0,
  streak: emptyStreak,
  lessons: {},
  bosses: {},
  skipped: [],
  placement: null,
  review: {},
  askedFamily: 0,
  seconds: 0,
  skills: {},
  days: {},
};

function complete(prev: Completion | undefined, today: string): Completion {
  return { first: prev?.first ?? today, last: today, times: (prev?.times ?? 0) + 1 };
}

export interface LessonReport {
  lessonId: string;
  kind: "lesson" | "review";
  stats: LessonStats;
  /** Phrase ids taught or practised in the lesson. */
  practised: readonly string[];
  /** Phrase ids answered wrong at least once. */
  missed: readonly string[];
  seconds: number;
  today: string;
  /** Answers checked in this session, by skill. */
  tally?: SkillStats;
}

export function completeLesson(p: Progress, r: LessonReport): { progress: Progress; xp: XpBreakdown } {
  const xp = lessonXp(r.stats, r.kind);
  let review = introduce(p.review, r.practised, r.today);
  if (r.kind === "review") {
    for (const id of r.practised) review = recordReview(review, id, !r.missed.includes(id), r.today);
  } else {
    for (const id of r.missed) review = recordReview(review, id, false, r.today);
  }
  return {
    xp,
    progress: {
      ...p,
      xp: p.xp + xp.total,
      streak: recordPractice(p.streak, r.today),
      lessons: { ...p.lessons, [r.lessonId]: complete(p.lessons[r.lessonId], r.today) },
      review,
      seconds: p.seconds + Math.max(0, Math.round(r.seconds)),
      skills: addTally(p.skills, r.tally ?? {}),
      days: recordDay(p.days, r.today, { tally: r.tally, seconds: r.seconds }),
    },
  };
}

export interface BossReport {
  bossId: string;
  outcome: string;
  seconds: number;
  today: string;
}

export function completeBoss(p: Progress, r: BossReport): { progress: Progress; xp: XpBreakdown } {
  const prev = p.bosses[r.bossId];
  // Full XP the first time and for each new ending; a small amount for replays.
  const fresh = !prev || !prev.outcomes.includes(r.outcome);
  const xp = fresh ? lessonXp({ comebacks: 0 }, "boss") : lessonXp({ comebacks: 0 }, "review");
  return {
    xp,
    progress: {
      ...p,
      xp: p.xp + xp.total,
      streak: recordPractice(p.streak, r.today),
      bosses: {
        ...p.bosses,
        [r.bossId]: {
          ...complete(prev, r.today),
          outcomes: fresh ? [...(prev?.outcomes ?? []), r.outcome] : (prev?.outcomes ?? []),
        },
      },
      seconds: p.seconds + Math.max(0, Math.round(r.seconds)),
      days: recordDay(p.days, r.today, { seconds: r.seconds }),
    },
  };
}

/** Apply a placement suggestion: earlier speaking units become "skipped, review anytime". */
export function applyPlacement(
  p: Progress,
  result: { unit: number; correct: number; total: number },
  speakingUnitIds: readonly string[],
  today: string,
): Progress {
  return {
    ...p,
    placement: { ...result, day: today },
    skipped: speakingUnitIds.slice(0, Math.max(0, result.unit - 1)),
  };
}

export function recordAskedFamily(p: Progress): Progress {
  return { ...p, askedFamily: p.askedFamily + 1 };
}

/** Accept anything that looks like saved progress and fill in whatever is missing. */
export function migrate(raw: unknown): Progress {
  if (typeof raw !== "object" || raw === null) return emptyProgress;
  const r = raw as Partial<Progress>;
  return {
    ...emptyProgress,
    ...r,
    v: 1,
    // Older saves stored relatives' real names; they are no longer used, so drop them.
    profile: { kind: r.profile?.kind ?? null, onboarded: r.profile?.onboarded ?? false },
    streak: { ...emptyStreak, ...(r.streak ?? {}) },
    lessons: r.lessons ?? {},
    bosses: r.bosses ?? {},
    skipped: Array.isArray(r.skipped) ? r.skipped : [],
    review: r.review ?? {},
    skills: r.skills ?? {},
    days: r.days ?? {},
  };
}
