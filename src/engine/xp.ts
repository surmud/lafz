import type { LessonStats } from "./lesson";

/**
 * XP is deliberately simple and can only go up. Mistakes cost nothing; fixing a mistake on its way
 * back pays a comeback bonus, so a messy lesson can out-earn a perfect one. That is on purpose.
 */
export const XP_LESSON = 10;
export const XP_COMEBACK = 2;
export const XP_COMEBACK_CAP = 10;
export const XP_BOSS = 20;
export const XP_REVIEW = 5;

export interface XpBreakdown {
  base: number;
  comeback: number;
  total: number;
}

export function lessonXp(stats: Pick<LessonStats, "comebacks">, kind: "lesson" | "boss" | "review" = "lesson"): XpBreakdown {
  const base = kind === "boss" ? XP_BOSS : kind === "review" ? XP_REVIEW : XP_LESSON;
  const comeback = Math.min(XP_COMEBACK_CAP, stats.comebacks * XP_COMEBACK);
  return { base, comeback, total: base + comeback };
}

const LEVELS = [
  { xp: 0, title: "Level 1", meaning: "Getting started" },
  { xp: 50, title: "Level 2", meaning: "Basics" },
  { xp: 150, title: "Level 3", meaning: "Everyday phrases" },
  { xp: 300, title: "Level 4", meaning: "Simple conversations" },
  { xp: 500, title: "Level 5", meaning: "Confident basics" },
  { xp: 800, title: "Level 6", meaning: "Conversational" },
  { xp: 1200, title: "Level 7", meaning: "Advanced" },
  { xp: 1800, title: "Level 8", meaning: "Course complete" },
] as const;

export interface Level {
  index: number;
  title: string;
  meaning: string;
  floor: number;
  /** XP needed for the next level, or null at the top. */
  next: number | null;
}

export function levelFor(xp: number): Level {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= (LEVELS[i]?.xp ?? Infinity)) index = i;
  }
  const cur = LEVELS[index] ?? LEVELS[0];
  const next = LEVELS[index + 1];
  return { index, title: cur.title, meaning: cur.meaning, floor: cur.xp, next: next ? next.xp : null };
}
