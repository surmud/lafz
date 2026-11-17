import { describe, expect, test } from "vitest";
import type { Exercise } from "@/content/schema";
import { checkChoice, checkSort, checkSpot, ContentError, harden, phraseRefs, resolveExercise, skillOf, targetsOf, type ResolveContext } from "./exercises";
import { PHRASE_MAP, PHRASES } from "./fixtures";
import { troubleItems } from "./review";

const ctx: ResolveContext = { phrases: PHRASE_MAP, pool: PHRASES };
const resolve = (ex: Exercise, id = "y#0") => resolveExercise(ex, id, ctx);
const two = PHRASES.filter((p) => p.roman.split(" ").length >= 2);
const sentence = two[0]!;
const [w0] = sentence.roman.replace(/[?!.,]/g, "").split(" ");
const [u0] = sentence.urdu.replace(/[؟!۔،]/g, "").split(" ");

describe("scene", () => {
  const ex: Exercise = {
    type: "scene",
    lines: [
      { speaker: "khala", phrase: PHRASES[0]!.id },
      { speaker: "nani", phrase: PHRASES[1]!.id },
    ],
    question: "Who spoke first?",
    options: [{ text: "Khala" }, { text: "Nani", feedback: "No." }],
    answer: 0,
  };
  test("resolves lines, shuffles options, checks the answer", () => {
    const r = resolve(ex);
    if (r.type !== "scene") throw new Error("expected scene");
    expect(r.lines.map((l) => l.phrase.id)).toEqual([PHRASES[0]!.id, PHRASES[1]!.id]);
    expect(r.hideText).toBe(false);
    expect(checkChoice(r, r.answerKey)).toBe("correct");
    expect(checkChoice(r, r.options.find((o) => o.key !== r.answerKey)!.key)).toBe("wrong");
    expect(targetsOf(r)).toHaveLength(2);
    expect(skillOf(r)).toBe("listening");
    expect(phraseRefs(ex)).toHaveLength(2);
  });
  test("rejects a bad answer index", () => {
    expect(() => resolve({ ...ex, answer: 5 } as Exercise)).toThrow(ContentError);
  });
});

describe("spot", () => {
  const ex: Exercise = { type: "spot", phrase: sentence.id, word: { roman: w0!, urdu: u0! }, wrong: { roman: "pizza", urdu: "پیزا" }, explain: "because" };
  test("plants the wrong word in both scripts", () => {
    const r = resolve(ex);
    if (r.type !== "spot") throw new Error("expected spot");
    expect(r.tokens.roman[0]).toMatchObject({ text: "pizza", wrong: true });
    expect(r.tokens.urdu[0]).toMatchObject({ text: "پیزا", wrong: true });
    expect(r.tokens.roman.filter((t) => t.wrong)).toHaveLength(1);
    expect(checkSpot(r, r.tokens.roman[0]!.key, "roman")).toBe("correct");
    expect(checkSpot(r, r.tokens.roman[1]!.key, "roman")).toBe("wrong");
    expect(checkSpot(r, "nope", "urdu")).toBe("wrong");
    expect(skillOf(r)).toBe("grammar");
    expect(targetsOf(r)).toEqual([sentence.id]);
  });
  test("errors when the word is missing or unchanged", () => {
    expect(() => resolve({ ...ex, word: { roman: "zzz", urdu: u0! } } as Exercise)).toThrow(/not in/);
    expect(() => resolve({ ...ex, wrong: { roman: w0!, urdu: "پیزا" } } as Exercise)).toThrow(/equals/);
  });
});

describe("sort", () => {
  const ex: Exercise = {
    type: "sort",
    prompt: "Sort",
    buckets: ["A", "B"],
    items: [{ phrase: PHRASES[0]!.id, bucket: 0 }, { text: "x", bucket: 1 }, { text: "y", bucket: 0 }, { text: "z", bucket: 1 }],
  };
  test("checks placements", () => {
    const r = resolve(ex);
    if (r.type !== "sort") throw new Error("expected sort");
    const right = Object.fromEntries(r.items.map((i) => [i.key, i.bucket]));
    expect(checkSort(r, right)).toEqual({ verdict: "correct", wrong: [] });
    const first = r.items[0]!;
    const bad = { ...right, [first.key]: 1 - first.bucket };
    expect(checkSort(r, bad)).toEqual({ verdict: "wrong", wrong: [first.key] });
    expect(checkSort(r, {}).wrong).toHaveLength(4);
    expect(targetsOf(r)).toEqual([PHRASES[0]!.id]);
    expect(phraseRefs(ex)).toEqual([PHRASES[0]!.id]);
  });
  test("rejects empty buckets, bad indexes and blank items", () => {
    expect(() => resolve({ ...ex, buckets: ["A", "B", "C"] } as Exercise)).toThrow(/empty/);
    expect(() => resolve({ ...ex, items: [...ex.items.slice(0, 3), { text: "q", bucket: 4 }] } as Exercise)).toThrow(/range/);
    expect(() => resolve({ ...ex, items: [...ex.items.slice(0, 3), { bucket: 1 }] } as Exercise)).toThrow(/needs/);
  });
});

describe("dictation and hard mode", () => {
  test("dictation resolves to an audio-only typing exercise", () => {
    const r = resolve({ type: "dictation", phrase: sentence.id, speed: "aunty" });
    if (r.type !== "type") throw new Error("expected type");
    expect(r.dictation).toBe("aunty");
    expect(r.prompt).toMatch(/Aunty/);
    expect(skillOf(r)).toBe("listening");
    expect(resolve({ type: "dictation", phrase: sentence.id, speed: "normal" })).toMatchObject({ prompt: "Type what you hear" });
  });
  test("harden turns picking into producing", () => {
    expect(harden({ type: "say", phrase: "a", prompt: "Say it" })).toEqual({ type: "type", phrase: "a", prompt: "Say it" });
    expect(harden({ type: "say", phrase: "a" })).toEqual({ type: "type", phrase: "a" });
    expect(harden({ type: "listen", phrase: "a", speed: "normal" })).toEqual({ type: "dictation", phrase: "a", speed: "normal" });
    const m: Exercise = { type: "meaning", phrase: "a" };
    expect(harden(m)).toBe(m);
  });
  test("skills for the older types", () => {
    const skill = (ex: Exercise) => skillOf(resolve(ex));
    expect(skill({ type: "listen", phrase: sentence.id, speed: "normal" })).toBe("listening");
    expect(skill({ type: "meaning", phrase: sentence.id })).toBe("recognition");
    expect(skill({ type: "type", phrase: sentence.id })).toBe("recall");
    expect(skill({ type: "build", phrase: sentence.id })).toBe("recall");
    expect(skill({ type: "speak", phrase: sentence.id })).toBe("speaking");
    expect(skill({ type: "trace", glyph: "ب", label: "be" })).toBe("reading");
    expect(skill({ type: "match", phrases: PHRASES.slice(0, 3).map((p) => p.id), mode: "audio" })).toBe("listening");
    expect(skill({ type: "match", phrases: PHRASES.slice(0, 3).map((p) => p.id), mode: "meaning" })).toBe("recognition");
    expect(skill({ type: "mc", prompt: "?", glyph: "ب", options: [{ text: "a" }, { text: "b" }], answer: 0 })).toBe("reading");
  });
});

test("troubleItems: most-missed first, never-missed excluded", () => {
  const deck = { a: { box: 1, due: "2026-01-01", lapses: 1 }, b: { box: 2, due: "2026-01-01", lapses: 3 }, c: { box: 1, due: "2026-01-01", lapses: 0 } };
  expect(troubleItems(deck)).toEqual(["b", "a"]);
  expect(troubleItems(deck, 1)).toEqual(["b"]);
});
