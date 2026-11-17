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
  { xp: 0, title: "Mehmaan", meaning: "Guest" },
  { xp: 50, title: "Bacha", meaning: "The kid at the table" },
  { xp: 150, title: "Chai-wala", meaning: "Trusted with the chai" },
  { xp: 300, title: "Bhai / Baji", meaning: "One of the cousins" },
  { xp: 500, title: "Khala's favourite", meaning: "She brags about you now" },
  { xp: 800, title: "Dawat veteran", meaning: "Survives any gathering" },
  { xp: 1200, title: "Mohalla legend", meaning: "The whole street knows" },
  { xp: 1800, title: "Ustad", meaning: "Master" },
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
