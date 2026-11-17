import type { UnitMeta } from "./course";
import { unitProgress } from "./course";
import type { Skill } from "./exercises";
import type { Progress } from "./progress";
import { addDays } from "./streak";

/**
 * The skill model: every checked answer is tallied by the skill it trains, and by day. Pure data on
 * the device; the Insights page and the optional anonymous stats are both computed from it.
 */
export const SKILLS: readonly Skill[] = ["listening", "speaking", "recall", "recognition", "reading", "grammar"];

export const SKILL_LABEL: Record<Skill, { title: string; what: string; icon: string }> = {
  listening: { title: "Listening", what: "Understanding what you hear", icon: "👂" },
  speaking: { title: "Speaking", what: "Saying it out loud", icon: "🗣️" },
  recall: { title: "Recall", what: "Producing the phrase yourself", icon: "✍️" },
  recognition: { title: "Recognition", what: "Knowing it when you see it", icon: "👀" },
  reading: { title: "Reading", what: "The Urdu script", icon: "📜" },
  grammar: { title: "Grammar", what: "Endings, respect levels, word order", icon: "🧩" },
};

export interface Tally {
  seen: number;
  right: number;
}
export type SkillStats = Partial<Record<Skill, Tally>>;

export interface DayStat {
  answers: number;
  right: number;
  seconds: number;
  /** Lessons, reviews and conversations finished. */
  sessions: number;
}

/** Days of history kept. Older days are dropped to keep saved progress small. */
export const DAYS_KEPT = 120;

export function addTally(a: SkillStats, b: SkillStats): SkillStats {
  const out: SkillStats = { ...a };
  for (const s of SKILLS) {
    const x = b[s];
    if (!x) continue;
    const prev = out[s] ?? { seen: 0, right: 0 };
    out[s] = { seen: prev.seen + x.seen, right: prev.right + x.right };
  }
  return out;
}

export function tallyAnswer(t: SkillStats, skill: Skill, right: boolean): SkillStats {
  return addTally(t, { [skill]: { seen: 1, right: right ? 1 : 0 } });
}

export function recordDay(
  days: Readonly<Record<string, DayStat>>,
  today: string,
  add: { tally?: SkillStats; seconds: number },
): Record<string, DayStat> {
  const prev = days[today] ?? { answers: 0, right: 0, seconds: 0, sessions: 0 };
  let answers = 0;
  let right = 0;
  for (const s of SKILLS) {
    answers += add.tally?.[s]?.seen ?? 0;
    right += add.tally?.[s]?.right ?? 0;
  }
  const next: Record<string, DayStat> = {
    ...days,
    [today]: {
      answers: prev.answers + answers,
      right: prev.right + right,
      seconds: prev.seconds + Math.max(0, Math.round(add.seconds)),
      sessions: prev.sessions + 1,
    },
  };
  const cutoff = addDays(today, -DAYS_KEPT);
  for (const d of Object.keys(next)) if (d < cutoff) delete next[d];
  return next;
}

export interface SkillScore {
  skill: Skill;
  seen: number;
  /** 0..1, or null until there are enough answers to mean anything. */
  accuracy: number | null;
}

export const MIN_ANSWERS = 8;

export function skillScores(stats: SkillStats): SkillScore[] {
  return SKILLS.map((skill) => {
    const t = stats[skill] ?? { seen: 0, right: 0 };
    return { skill, seen: t.seen, accuracy: t.seen >= MIN_ANSWERS ? t.right / t.seen : null };
  });
}

/** Strongest and weakest skills among those with enough answers (null when fewer than two qualify). */
export function extremes(scores: readonly SkillScore[]): { best: SkillScore; worst: SkillScore } | null {
  const rated = scores.filter((s) => s.accuracy !== null).sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));
  const best = rated[0];
  const worst = rated[rated.length - 1];
  return best && worst && best !== worst ? { best, worst } : null;
}

export type Band = "starter" | "survival" | "conversational" | "confident" | "advanced";

export const BANDS: Record<Band, { title: string; cefr: string; blurb: string }> = {
  starter: { title: "Starter", cefr: "pre-A1", blurb: "Greetings and a few set phrases." },
  survival: { title: "Survival", cefr: "A1", blurb: "Family, food, the phone: short exchanges on familiar ground." },
  conversational: { title: "Conversational", cefr: "A2", blurb: "Getting around, occasions, feelings: you can keep a simple conversation going." },
  confident: { title: "Confident", cefr: "A2+", blurb: "Past, future and stories: you can take part in family talk." },
  advanced: { title: "Advanced", cefr: "B1", blurb: "Formal Urdu, opinions, idioms: you can handle most situations." },
};

export interface LevelEstimate {
  band: Band;
  /** Core speaking units finished or placed out of. */
  coreCovered: number;
  coreTotal: number;
  advancedDone: number;
  /** Phrases met at least once, and phrases that have survived several spaced reviews. */
  met: number;
  solid: number;
}

/**
 * A rough level from what has been covered: core units finished or placed out of, then advanced
 * units finished. It is an estimate for the learner's own orientation, not a certificate.
 */
export function estimateLevel(units: readonly UnitMeta[], p: Progress): LevelEstimate {
  const speaking = units.filter((u) => u.track === "speaking");
  const core = speaking.filter((u) => u.stage !== "advanced");
  const adv = speaking.filter((u) => u.stage === "advanced");
  const covered = (u: UnitMeta) => {
    const s = unitProgress(u, p).status;
    return s === "done" || s === "skipped";
  };
  const coreCovered = core.filter(covered).length;
  const advancedDone = adv.filter((u) => unitProgress(u, p).status === "done").length;
  const share = core.length ? coreCovered / core.length : 0;
  let band: Band = "starter";
  if (share >= 0.2) band = "survival";
  if (share >= 0.5) band = "conversational";
  if (share >= 0.85) band = "confident";
  if (share >= 0.85 && advancedDone >= 2) band = "advanced";
  const deck = Object.values(p.review);
  return { band, coreCovered, coreTotal: core.length, advancedDone, met: deck.length, solid: deck.filter((r) => r.box >= 3).length };
}

/** The last `n` days ending today, oldest first, with empty days filled in. */
export function recentDays(days: Readonly<Record<string, DayStat>>, today: string, n = 14): (DayStat & { day: string })[] {
  return Array.from({ length: n }, (_, i) => {
    const day = addDays(today, i - n + 1);
    return { day, ...(days[day] ?? { answers: 0, right: 0, seconds: 0, sessions: 0 }) };
  });
}

/**
 * The anonymous summary shared with the project when the learner opts in (and shown to them first).
 * No names, no recordings, no free text: counts and rates only.
 */
export interface Snapshot {
  v: 1;
  kind: Progress["profile"]["kind"];
  band: Band;
  xp: number;
  lessons: number;
  bosses: number;
  coreCovered: number;
  advancedDone: number;
  placedAt: number | null;
  met: number;
  solid: number;
  activeDays: number;
  minutes: number;
  streakBest: number;
  accuracy: Partial<Record<Skill, number>>;
  answers: Partial<Record<Skill, number>>;
  /** The furthest lesson finished in each track, for funnel analysis. */
  furthest: { speaking: string | null; reading: string | null };
}

export function snapshot(units: readonly UnitMeta[], p: Progress): Snapshot {
  const level = estimateLevel(units, p);
  const accuracy: Snapshot["accuracy"] = {};
  const answers: Snapshot["answers"] = {};
  for (const s of skillScores(p.skills)) {
    if (s.seen > 0) answers[s.skill] = s.seen;
    if (s.accuracy !== null) accuracy[s.skill] = Math.round(s.accuracy * 100) / 100;
  }
  const furthest = (track: "speaking" | "reading") => {
    const done = units
      .filter((u) => u.track === track)
      .sort((a, b) => a.order - b.order)
      .flatMap((u) => u.lessons.map((l) => l.id))
      .filter((id) => p.lessons[id]);
    return done[done.length - 1] ?? null;
  };
  const lessonIds = new Set(units.flatMap((u) => u.lessons.map((l) => l.id)));
  return {
    v: 1,
    kind: p.profile.kind,
    band: level.band,
    xp: p.xp,
    lessons: Object.keys(p.lessons).filter((id) => lessonIds.has(id)).length,
    bosses: Object.keys(p.bosses).length,
    coreCovered: level.coreCovered,
    advancedDone: level.advancedDone,
    placedAt: p.placement?.unit ?? null,
    met: level.met,
    solid: level.solid,
    activeDays: Object.keys(p.days).length,
    minutes: Math.round(p.seconds / 60),
    streakBest: p.streak.best,
    accuracy,
    answers,
    furthest: { speaking: furthest("speaking"), reading: furthest("reading") },
  };
}
