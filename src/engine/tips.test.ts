import { expect, test } from "vitest";
import { showChaiCard } from "./tips";

test("chai card: only when enabled, after five lessons, and never after dismissal", () => {
  expect(showChaiCard({ enabled: true, lessonsDone: 5, dismissed: false })).toBe(true);
  expect(showChaiCard({ enabled: true, lessonsDone: 4, dismissed: false })).toBe(false);
  expect(showChaiCard({ enabled: true, lessonsDone: 40, dismissed: true })).toBe(false);
  expect(showChaiCard({ enabled: false, lessonsDone: 40, dismissed: false })).toBe(false);
});
