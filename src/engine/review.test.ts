import { describe, expect, test } from "vitest";
import { buildReviewSession, dueItems, introduce, recordReview, type ReviewDeck } from "./review";
import { answerPlacement, nextQuestion, placementResult, startPlacement } from "./placement";

describe("leitner review", () => {
  const today = "2026-11-15";
  test("introduce adds box 1 items due tomorrow and keeps existing ones", () => {
    let deck: ReviewDeck = { a: { box: 3, due: "2026-11-20", lapses: 1 } };
    deck = introduce(deck, ["a", "b"], today);
    expect(deck.a).toEqual({ box: 3, due: "2026-11-20", lapses: 1 });
    expect(deck.b).toEqual({ box: 1, due: "2026-11-16", lapses: 0 });
  });
  test("correct moves up with longer gaps; wrong drops to box 1", () => {
    let deck: ReviewDeck = {};
    deck = recordReview(deck, "a", true, today);
    expect(deck.a).toEqual({ box: 1, due: "2026-11-16", lapses: 0 });
    deck = recordReview(deck, "a", true, today);
    expect(deck.a).toMatchObject({ box: 2, due: "2026-11-17" });
    for (let i = 0; i < 10; i++) deck = recordReview(deck, "a", true, today);
    expect(deck.a).toMatchObject({ box: 5, due: "2026-12-01" });
    deck = recordReview(deck, "a", false, today);
    expect(deck.a).toEqual({ box: 1, due: "2026-11-16", lapses: 1 });
  });
  test("due items: weakest box first, then most overdue, then id", () => {
    const deck: ReviewDeck = {
      strong: { box: 4, due: "2026-11-10", lapses: 0 },
      weakNew: { box: 1, due: "2026-11-15", lapses: 0 },
      weakOld: { box: 1, due: "2026-11-12", lapses: 2 },
      weakOld2: { box: 1, due: "2026-11-12", lapses: 2 },
      later: { box: 1, due: "2026-11-16", lapses: 5 },
    };
    expect(dueItems(deck, today)).toEqual(["weakOld", "weakOld2", "weakNew", "strong"]);
    expect(buildReviewSession(deck, today, 2)).toEqual(["weakOld", "weakOld2"]);
    // Tops up with the shakiest not-yet-due items.
    expect(buildReviewSession(deck, today, 10)).toEqual(["weakOld", "weakOld2", "weakNew", "strong", "later"]);
    expect(buildReviewSession({}, today)).toEqual([]);
  });
  test("top-up prefers lapses, then lower box", () => {
    const deck: ReviewDeck = {
      a: { box: 3, due: "2026-12-01", lapses: 0 },
      b: { box: 2, due: "2026-12-01", lapses: 0 },
      c: { box: 5, due: "2026-12-01", lapses: 3 },
      d: { box: 2, due: "2026-12-01", lapses: 0 },
    };
    expect(buildReviewSession(deck, today)).toEqual(["c", "b", "d", "a"]);
  });
});

describe("placement", () => {
  const pool = Array.from({ length: 12 }, (_, i) => [
    { id: `q${i + 1}a`, level: i + 1 },
    { id: `q${i + 1}b`, level: i + 1 },
  ]).flat();

  const run = (answers: (level: number) => boolean) => {
    let s = startPlacement();
    while (!s.done) {
      const q = nextQuestion(s, pool);
      if (!q) break;
      s = answerPlacement(s, q, answers(q.level));
    }
    return { s, r: placementResult(s) };
  };

  test("total beginner bottoms out early and starts at unit 1", () => {
    const { s, r } = run(() => false);
    expect(r).toMatchObject({ unit: 1, correct: 0 });
    expect(s.answers.length).toBeLessThan(7);
    expect(nextQuestion(s, pool)).toBeNull();
  });
  test("fluent speaker is sent to the top", () => {
    const { r } = run(() => true);
    expect(r.unit).toBe(12);
    expect(r.correct).toBe(r.total);
  });
  test("heritage learner who knows units 1 to 5 lands mid-course", () => {
    const { r, s } = run((level) => level <= 5);
    expect(s.answers.length).toBe(7);
    expect(r.unit).toBeGreaterThanOrEqual(4);
    expect(r.unit).toBeLessThanOrEqual(6);
  });
  test("a miss below the top pulls the suggestion back", () => {
    let s = startPlacement();
    s = answerPlacement(s, { id: "a", level: 2 }, true);
    s = answerPlacement(s, { id: "b", level: 4 }, false);
    s = answerPlacement(s, { id: "c", level: 3 }, false);
    s = answerPlacement(s, { id: "d", level: 6 }, true);
    expect(placementResult(s)).toEqual({ unit: 5, correct: 2, total: 4 });
  });
  test("answers after done are ignored, ties prefer the easier question, empty pool is null", () => {
    let s = startPlacement(5);
    expect(nextQuestion(s, [{ id: "hi", level: 6 }, { id: "lo", level: 4 }])?.id).toBe("lo");
    expect(nextQuestion(s, [{ id: "lo", level: 4 }, { id: "hi", level: 6 }])?.id).toBe("lo");
    expect(nextQuestion(s, [])).toBeNull();
    s = answerPlacement(s, { id: "x", level: 5 }, true, 1);
    expect(s.done).toBe(true);
    expect(answerPlacement(s, { id: "y", level: 5 }, true)).toBe(s);
  });
});
