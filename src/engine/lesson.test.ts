import { describe, expect, test } from "vitest";
import { advance, createLesson, currentStep, interleave, isComeback, progress, submit, type LessonStep } from "./lesson";
import { levelFor, lessonXp } from "./xp";

const steps: LessonStep[] = [
  { id: "t1", kind: "teach" },
  { id: "e1", kind: "exercise" },
  { id: "e2", kind: "exercise" },
  { id: "e3", kind: "exercise" },
];

describe("lesson state machine", () => {
  test("an empty lesson is complete immediately", () => {
    const s = createLesson([]);
    expect(s.phase).toBe("complete");
    expect(currentStep(s)).toBeNull();
    expect(progress(s)).toBe(1);
    expect(advance(s)).toBe(s);
  });

  test("happy path: teach, then all correct on the first try", () => {
    let s = createLesson(steps);
    expect(currentStep(s)?.id).toBe("t1");
    expect(submit(s, "correct")).toBe(s); // teach steps cannot be answered
    s = advance(s);
    for (const id of ["e1", "e2", "e3"]) {
      expect(currentStep(s)?.id).toBe(id);
      expect(advance(s)).toBe(s); // must answer before advancing
      s = submit(s, "correct");
      expect(s.phase).toBe("feedback");
      expect(submit(s, "wrong")).toBe(s); // cannot answer twice
      s = advance(s);
    }
    expect(s.phase).toBe("complete");
    expect(s.stats).toMatchObject({ exercises: 3, firstTry: 3, comebacks: 0, mistakes: 0 });
    expect(progress(s)).toBe(1);
  });

  test("a wrong answer comes back later and earns a comeback bonus", () => {
    let s = createLesson(steps, { requeueGap: 1 });
    s = advance(s);
    s = advance(submit(s, "wrong")); // e1 wrong
    expect(s.queue.map((q) => q.id)).toEqual(["t1", "e1", "e2", "e1", "e3"]);
    s = advance(submit(s, "almost")); // e2
    expect(currentStep(s)).toMatchObject({ id: "e1", attempt: 2 });
    expect(isComeback(s)).toBe(true);
    s = advance(submit(s, "correct"));
    s = advance(submit(s, "correct"));
    expect(s.phase).toBe("complete");
    expect(s.stats).toMatchObject({ firstTry: 2, comebacks: 1, mistakes: 1, letGo: 0 });
    expect(s.missed).toEqual(["e1"]);
    expect(lessonXp(s.stats).total).toBe(12);
  });

  test("requeue lands at the end when the gap overshoots", () => {
    let s = createLesson([{ id: "e1", kind: "exercise" }]);
    s = advance(submit(s, "wrong"));
    expect(s.phase).toBe("active");
    expect(currentStep(s)).toMatchObject({ id: "e1", attempt: 2 });
  });

  test("never blocked: after max attempts the exercise is let go", () => {
    let s = createLesson([{ id: "e1", kind: "exercise" }], { maxAttempts: 2 });
    s = advance(submit(s, "wrong"));
    s = advance(submit(s, "wrong"));
    expect(s.phase).toBe("complete");
    expect(s.stats).toMatchObject({ mistakes: 2, letGo: 1, comebacks: 0 });
    expect(s.missed).toEqual(["e1"]);
  });

  test("skipping costs nothing and is not requeued", () => {
    let s = createLesson([{ id: "e1", kind: "exercise" }]);
    s = advance(submit(s, "skipped"));
    expect(s.phase).toBe("complete");
    expect(s.stats.skipped).toBe(1);
    expect(isComeback(s)).toBe(false);
  });

  test("progress never exceeds 1", () => {
    let s = createLesson(steps);
    expect(progress(s)).toBe(0);
    s = advance(s);
    expect(progress(s)).toBeCloseTo(0.25);
  });
});

describe("xp", () => {
  test("mistakes never cost xp and comebacks are capped", () => {
    expect(lessonXp({ comebacks: 0 })).toEqual({ base: 10, comeback: 0, total: 10 });
    expect(lessonXp({ comebacks: 3 }).total).toBe(16);
    expect(lessonXp({ comebacks: 50 }).comeback).toBe(10);
    expect(lessonXp({ comebacks: 1 }, "boss").total).toBe(22);
    expect(lessonXp({ comebacks: 0 }, "review").total).toBe(5);
  });
  test("levels", () => {
    expect(levelFor(0)).toMatchObject({ index: 0, title: "Mehmaan", next: 50 });
    expect(levelFor(49).index).toBe(0);
    expect(levelFor(50).index).toBe(1);
    expect(levelFor(999999)).toMatchObject({ title: "Ustad", next: null });
  });
});

describe("interleave", () => {
  const ids = (steps: { id: string }[]) => steps.map((x) => x.id).join(" ");
  test("short lessons keep teach-then-practise", () => {
    expect(ids(interleave([["a"], ["b"], []], [["a"], ["b"]]))).toBe("t0 t1 t2 e0 e1");
  });
  test("long lessons practise each chunk after it is taught", () => {
    const teach = [[], ["a"], ["b"], ["c"], ["d"], ["e"], ["f"]];
    const ex = [["a", "x"], ["d"], ["b", "c"], ["f"], ["zz"], ["a", "f"]];
    // Chunk 1 (a,b,c): exercises 0, 2 and 4 (uses nothing taught here). Then d,e,f and the rest.
    expect(ids(interleave(teach, ex))).toBe("t0 t1 t2 t3 e0 e2 e4 t4 t5 t6 e1 e3 e5");
  });
  test("does not break off with only one card left", () => {
    const teach = [["a"], ["b"], ["c"], ["d"]];
    expect(ids(interleave(teach, [["a"], ["d"]], 3, 4))).toBe("t0 t1 t2 t3 e0 e1");
  });
});
