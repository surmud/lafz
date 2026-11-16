import { describe, expect, test } from "vitest";
import type { Exercise } from "@/content/schema";
import {
  checkBuild,
  checkChoice,
  checkMatchPair,
  checkRespect,
  checkType,
  ContentError,
  generateDrill,
  resolveExercise,
  splitAround,
  stripPunct,
  targetsOf,
  type ResolveContext,
} from "./exercises";
import { PHRASE_MAP, PHRASES } from "./fixtures";
import { hashString, pick, seededRng, shuffle } from "./rng";

const ctx: ResolveContext = { phrases: PHRASE_MAP, pool: PHRASES };
const resolve = (ex: Exercise, id = "x#0") => resolveExercise(ex, id, ctx);

describe("rng", () => {
  test("seeded and reproducible", () => {
    const a = seededRng(42);
    const b = seededRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(shuffle([1, 2, 3, 4, 5], seededRng(1))).toEqual(shuffle([1, 2, 3, 4, 5], seededRng(1)));
    expect(shuffle([1, 2, 3, 4, 5], seededRng(1)).sort()).toEqual([1, 2, 3, 4, 5]);
    expect(pick([], seededRng(1))).toBeUndefined();
    expect(pick(["a"], seededRng(1))).toBe("a");
    expect(hashString("a")).not.toBe(hashString("b"));
  });
});

describe("resolveExercise", () => {
  test("meaning: Urdu shown, English options, auto distractors exclude same meaning", () => {
    const r = resolve({ type: "meaning", phrase: "t.khuda" });
    if (r.type !== "choice") throw new Error("expected choice");
    expect(r.show?.id).toBe("t.khuda");
    expect(r.options).toHaveLength(4);
    const answer = r.options.find((o) => o.key === r.answerKey);
    expect(answer?.text).toBe("Goodbye");
    expect(r.options.map((o) => o.text)).not.toContain("Bye"); // t.khuda2 is the same phrase
    expect(checkChoice(r, r.answerKey)).toBe("correct");
    expect(checkChoice(r, "nope")).toBe("wrong");
    expect(targetsOf(r)).toEqual(["t.khuda"]);
  });

  test("same id gives the same order; a different seed can change it", () => {
    const ex: Exercise = { type: "meaning", phrase: "t.salam" };
    expect(resolve(ex)).toEqual(resolve(ex));
    const orders = new Set(
      [1, 2, 3, 4, 5, 6].map((seed) => {
        const r = resolveExercise(ex, "x#0", { ...ctx, seed });
        return r.type === "choice" ? r.options.map((o) => o.text).join("|") : "";
      }),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  test("meaning with authored distractors", () => {
    const r = resolve({ type: "meaning", phrase: "t.salam", distractors: ["Go away", "More chai"] });
    if (r.type !== "choice") throw new Error();
    expect(r.options.map((o) => o.text).sort()).toEqual(["Go away", "More chai", "Peace be upon you (hello)"]);
  });

  test("listen hides the text and can run at aunty speed", () => {
    const r = resolve({ type: "listen", phrase: "t.shukriya", speed: "aunty" });
    if (r.type !== "choice") throw new Error();
    expect(r).toMatchObject({ audioOnly: true, speed: "aunty", show: undefined, flavour: "listen" });
    expect(r.audio?.id).toBe("t.shukriya");
  });

  test("say: Urdu options, default and custom prompts, authored distractors", () => {
    const auto = resolve({ type: "say", phrase: "t.theek" });
    if (auto.type !== "choice") throw new Error();
    expect(auto.prompt).toContain("I am fine");
    expect(auto.options).toHaveLength(3);
    expect(auto.options.every((o) => o.phrase)).toBe(true);
    const custom = resolve({
      type: "say",
      phrase: "t.theek",
      prompt: "Khala asks how you are.",
      distractors: ["t.salam", "t.khuda"],
      explain: "theek = fine",
    });
    if (custom.type !== "choice") throw new Error();
    expect(custom.prompt).toBe("Khala asks how you are.");
    expect(custom.options.map((o) => o.phrase?.id).sort()).toEqual(["t.khuda", "t.salam", "t.theek"]);
    expect(custom.explain).toBe("theek = fine");
  });

  test("mc keeps the answer key through shuffling", () => {
    const r = resolve({
      type: "mc",
      prompt: "Who gets aap?",
      show: "t.kaise",
      options: [{ text: "Nani" }, { text: "Your cat", feedback: "The cat does not care." }, { phrase: "t.tu" }],
      answer: 0,
      explain: "Elders get aap.",
    });
    if (r.type !== "choice") throw new Error();
    expect(r.options.find((o) => o.key === r.answerKey)?.text).toBe("Nani");
    expect(r.audio?.id).toBe("t.kaise");
    expect(r.options.find((o) => o.phrase)?.phrase?.id).toBe("t.tu");
    expect(targetsOf(r)).toEqual(["t.kaise"]);
    const glyph = resolve({ type: "mc", prompt: "Which is be?", glyph: "ب", audio: "t.salam", options: [{ glyph: "ب" }, { glyph: "پ" }], answer: 0 });
    if (glyph.type !== "choice") throw new Error();
    expect(glyph.audio?.id).toBe("t.salam");
    expect(targetsOf(glyph)).toEqual([]);
    const phraseAnswer = resolve({ type: "mc", prompt: "Pick", options: [{ phrase: "t.tu" }, { text: "x" }], answer: 0 });
    expect(targetsOf(phraseAnswer)).toEqual(["t.tu"]);
    expect(() => resolve({ type: "mc", prompt: "x", options: [{ text: "a" }, { text: "b" }], answer: 5 })).toThrow(ContentError);
  });

  test("match", () => {
    const r = resolve({ type: "match", phrases: ["t.salam", "t.shukriya", "t.khuda"], mode: "meaning" });
    if (r.type !== "match") throw new Error();
    expect(r.phrases.map((p) => p.id).sort()).toEqual([...r.rightOrder].sort());
    expect(checkMatchPair("a", "a")).toBe(true);
    expect(checkMatchPair("a", "b")).toBe(false);
    expect(targetsOf(r)).toHaveLength(3);
  });

  test("type merges phrase and exercise accept lists", () => {
    const r = resolve({ type: "type", phrase: "t.khuda", accept: ["bye bye"], reject: ["khuda"] });
    if (r.type !== "type") throw new Error();
    expect(r.accept).toEqual(["allah hafiz", "bye bye"]);
    expect(checkType(r, "khudahafiz").verdict).toBe("correct");
    expect(checkType(r, "Allah Hafiz").verdict).toBe("correct");
    expect(checkType(r, "khuda").verdict).toBe("incorrect");
    expect(r.prompt).toContain("Goodbye");
    const plain = resolve({ type: "type", phrase: "t.shukriya", prompt: "Thank her" });
    if (plain.type !== "type") throw new Error();
    expect(plain).toMatchObject({ prompt: "Thank her", accept: [], reject: [] });
  });

  test("build tokenises each script on its own and ignores punctuation", () => {
    const r = resolve({
      type: "build",
      phrase: "t.kaise",
      distractors: [{ roman: "tum", urdu: "تم" }],
    });
    if (r.type !== "build") throw new Error();
    expect(r.tiles.roman.map((t) => t.text).sort()).toEqual(["aap", "hain", "kaise", "tum"]);
    expect(r.tiles.urdu.map((t) => t.text).sort()).toEqual(["آپ", "تم", "کیسے", "ہیں"].sort());
    expect(checkBuild(r, ["aap", "kaise", "hain"], "roman")).toBe("correct");
    expect(checkBuild(r, ["kaise", "aap", "hain"], "roman")).toBe("wrong");
    expect(checkBuild(r, ["آپ", "کیسے", "ہیں"], "urdu")).toBe("correct");
    expect(checkBuild(r, ["تم", "کیسے", "ہیں"], "urdu")).toBe("wrong");
    const plain = resolve({ type: "build", phrase: "t.theek", prompt: "Say it" });
    if (plain.type !== "build") throw new Error();
    expect(plain.prompt).toBe("Say it");
    expect(plain.tiles.roman).toHaveLength(3);
  });

  test("respect pick: ok counts but explains", () => {
    const r = resolve({
      type: "respect",
      situation: "Nani opens the door.",
      listener: "Nani",
      options: [
        { phrase: "t.kaise", verdict: "right", feedback: "Perfect." },
        { phrase: "t.tum", verdict: "ok", feedback: "She'll allow it." },
        { phrase: "t.tu", verdict: "wrong", feedback: "Tu to Nani?? Bold choice." },
      ],
    });
    if (r.type !== "respect") throw new Error();
    const key = (id: string) => r.options.find((o) => o.phrase.id === id)?.key ?? "";
    expect(checkRespect(r, key("t.kaise"))).toEqual({ verdict: "correct", feedback: "Perfect." });
    expect(checkRespect(r, key("t.tum")).verdict).toBe("almost");
    expect(checkRespect(r, key("t.tu")).verdict).toBe("wrong");
    expect(checkRespect(r, "zzz")).toEqual({ verdict: "wrong", feedback: "" });
    expect(targetsOf(r)).toEqual(["t.kaise"]);
    expect(() =>
      resolve({
        type: "respect",
        situation: "",
        listener: "",
        options: [
          { phrase: "t.tum", verdict: "ok", feedback: "" },
          { phrase: "t.tu", verdict: "wrong", feedback: "" },
        ],
      }),
    ).toThrow(ContentError);
  });

  test("gap splits both scripts around the word", () => {
    const r = resolve({
      type: "gap",
      phrase: "t.kaise",
      word: { roman: "kaise", urdu: "کیسے" },
      distractors: [
        { roman: "kaisa", urdu: "کیسا" },
        { roman: "kaisi", urdu: "کیسی" },
      ],
      explain: "aap takes the plural form",
    });
    if (r.type !== "gap") throw new Error();
    expect(r.parts.roman).toEqual(["aap", "hain?"]);
    expect(r.parts.urdu).toEqual(["آپ", "ہیں؟"]);
    expect(r.bank).toHaveLength(3);
    expect(r.bank.find((b) => b.key === r.answerKey)?.roman).toBe("kaise");
    expect(checkChoice(r, r.answerKey)).toBe("correct");
    expect(targetsOf(r)).toEqual(["t.kaise"]);
  });

  test("splitAround handles the last word, punctuation and missing words", () => {
    expect(splitAround("aap kaise hain?", "hain")).toEqual(["aap kaise", "?"]);
    expect(splitAround("Shukriya, Khala!", "shukriya")).toEqual(["", ", Khala!"]);
    expect(() => splitAround("aap kaise hain?", "tum", "ex1")).toThrow(/ex1/);
    expect(stripPunct("  Bas, bas!  ")).toBe("Bas bas");
  });

  test("speak, trace and unknown phrases", () => {
    const s = resolve({ type: "speak", phrase: "t.salam" });
    expect(targetsOf(s)).toEqual(["t.salam"]);
    const t = resolve({ type: "trace", glyph: "ب", label: "be" });
    expect(t).toMatchObject({ type: "trace", glyph: "ب" });
    expect(targetsOf(t)).toEqual([]);
    expect(() => resolve({ type: "speak", phrase: "nope" })).toThrow(ContentError);
  });
});

describe("generateDrill", () => {
  test("covers every phrase, mixes types and resolves cleanly", () => {
    const ids = PHRASES.slice(0, 6).map((p) => p.id);
    const drill = generateDrill(ids, 7);
    expect(drill.length).toBe(ids.length + 1);
    expect(new Set(drill.map((d) => d.type)).size).toBeGreaterThanOrEqual(3);
    expect(drill).toEqual(generateDrill(ids, 7));
    drill.forEach((ex, i) => expect(() => resolveExercise(ex, `d#${i}`, ctx)).not.toThrow());
    const all = new Set([1, 2, 3, 4, 5, 6, 7, 8].flatMap((seed) => generateDrill(ids, seed).map((d) => d.type)));
    expect([...all].sort()).toEqual(["build", "listen", "match", "meaning", "say", "type"]);
  });
  test("short lists get no match exercise", () => {
    expect(generateDrill(["t.salam", "t.khuda"], 1).some((d) => d.type === "match")).toBe(false);
  });
});

describe("distractor senses", () => {
  test("phrases with the same sense never distract each other", () => {
    const withSense = PHRASES.map((p) =>
      p.id === "t.salam" || p.id === "t.wsalam" ? { ...p, sense: "greet" } : p,
    );
    const c: ResolveContext = { phrases: new Map(withSense.map((p) => [p.id, p])), pool: withSense };
    for (let seed = 0; seed < 20; seed++) {
      const r = resolveExercise({ type: "meaning", phrase: "t.salam" }, `s#${seed}`, c);
      if (r.type !== "choice") throw new Error();
      expect(r.options.map((o) => o.text)).not.toContain("And peace upon you (reply)");
    }
  });
});
