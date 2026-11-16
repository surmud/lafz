"use client";
/**
 * Test hook. When localStorage has "lafz.e2e", exercises mark their right answers with
 * data-correct / data-expected attributes so Playwright persona runs can answer right or wrong on
 * purpose. Nothing is marked for real learners.
 */
let flag: boolean | null = null;
export function e2e(): boolean {
  if (flag !== null) return flag;
  try {
    flag = typeof window !== "undefined" && localStorage.getItem("lafz.e2e") === "1";
  } catch {
    flag = false;
  }
  return flag;
}

export function mark(correct: boolean): { "data-correct"?: string } {
  return e2e() ? { "data-correct": correct ? "1" : "0" } : {};
}
