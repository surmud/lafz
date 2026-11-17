import type { Exercise, Phrase, TokenPair } from "@/content/schema";
import { matchAnswer, normalise, type MatchResult } from "./matcher";
import { hashString, seededRng, shuffle, type Rng } from "./rng";

/**
 * Turns authored exercises into concrete, shuffled exercises the UI can render, and checks answers.
 * Pure and deterministic: the same exercise id and seed always give the same option order.
 */

export type Script = "roman" | "urdu";

export interface ChoiceOption {
  key: string;
  phrase?: Phrase;
  text?: string;
  glyph?: string;
  feedback?: string;
}

export interface ResolvedChoice {
  type: "choice";
  id: string;
  /** Which authored type this came from; the UI uses it for the heading. */
  flavour: "meaning" | "say" | "mc" | "listen";
  prompt: string;
  show?: Phrase;
  glyph?: string;
  audio?: Phrase;
  /** When true the phrase is only heard, never shown. */
  audioOnly: boolean;
  /** Show the prompt phrase in Urdu script only (reading track). */
  urduOnly?: boolean;
  speed: "normal" | "aunty";
  options: ChoiceOption[];
  answerKey: string;
  explain?: string;
  /** The phrase being practised, for review tracking. */
  target?: Phrase;
}

export interface ResolvedMatch {
  type: "match";
  id: string;
  mode: "meaning" | "audio";
  phrases: Phrase[];
  /** Right-hand column order. */
  rightOrder: string[];
}

export interface ResolvedType {
  type: "type";
  id: string;
  prompt: string;
  phrase: Phrase;
  accept: string[];
  reject: string[];
  /** Dictation: the phrase is only heard, at this speed. */
  dictation?: "normal" | "aunty";
}

export interface ResolvedScene {
  type: "scene";
  id: string;
  setup?: string;
  lines: { speaker: string; phrase: Phrase }[];
  question: string;
  options: { key: string; text: string; feedback?: string }[];
  answerKey: string;
  hideText: boolean;
  explain?: string;
}

export interface ResolvedSpot {
  type: "spot";
  id: string;
  prompt: string;
  phrase: Phrase;
  /** The sentence as shown (with the wrong word), per script. `wrong` marks the planted word. */
  tokens: Record<Script, { key: string; text: string; wrong: boolean }[]>;
  word: TokenPair;
  wrong: TokenPair;
  explain: string;
}

export interface ResolvedSort {
  type: "sort";
  id: string;
  prompt: string;
  buckets: string[];
  items: { key: string; phrase?: Phrase; text?: string; bucket: number }[];
  explain?: string;
}

export interface Tile {
  key: string;
  roman: string;
  urdu: string;
}

export interface ResolvedBuild {
  type: "build";
  id: string;
  prompt: string;
  phrase: Phrase;
  /** Shuffled tiles per script. Urdu and Roman are tokenised separately. */
  tiles: Record<Script, { key: string; text: string }[]>;
}

export interface ResolvedRespect {
  type: "respect";
  id: string;
  situation: string;
  listener: string;
  options: { key: string; phrase: Phrase; verdict: "right" | "ok" | "wrong"; feedback: string }[];
}

export interface ResolvedGap {
  type: "gap";
  id: string;
  phrase: Phrase;
  /** The sentence split around the gap, per script. */
  parts: Record<Script, [before: string, after: string]>;
  bank: Tile[];
  answerKey: string;
  explain?: string;
}

export interface ResolvedSpeak {
  type: "speak";
  id: string;
  phrase: Phrase;
}

export interface ResolvedTrace {
  type: "trace";
  id: string;
  glyph: string;
  label: string;
}

export type Resolved =
  | ResolvedChoice
  | ResolvedMatch
  | ResolvedType
  | ResolvedBuild
  | ResolvedRespect
  | ResolvedGap
  | ResolvedSpeak
  | ResolvedTrace
  | ResolvedScene
  | ResolvedSpot
  | ResolvedSort;

export interface ResolveContext {
  /** All phrases that may be referenced, by id. */
  phrases: ReadonlyMap<string, Phrase>;
  /** Phrases to draw automatic distractors from (usually the unit). */
  pool: readonly Phrase[];
  seed?: number;
}

export class ContentError extends Error {}

function need(ctx: ResolveContext, id: string): Phrase {
  const p = ctx.phrases.get(id);
  if (!p) throw new ContentError(`unknown phrase "${id}"`);
  return p;
}

/** Strip sentence punctuation so tiles and comparisons are about words only. */
export function stripPunct(s: string): string {
  return s.replace(/[?!.,،۔؟!"“”…]/g, "").replace(/\s+/g, " ").trim();
}

function sameMeaning(a: Phrase, b: Phrase): boolean {
  return (
    a.id === b.id ||
    (a.sense !== undefined && a.sense === b.sense) ||
    normalise(a.en) === normalise(b.en) ||
    normalise(a.roman) === normalise(b.roman) ||
    stripPunct(a.urdu) === stripPunct(b.urdu)
  );
}

function autoDistractors(target: Phrase, ctx: ResolveContext, rng: Rng, n: number): Phrase[] {
  const out: Phrase[] = [];
  const targetWords = target.roman.split(/\s+/).length;
  // Prefer distractors of a similar length so the answer is not guessable from its shape.
  const candidates = shuffle(ctx.pool, rng).sort(
    (a, b) =>
      Math.abs(a.roman.split(/\s+/).length - targetWords) - Math.abs(b.roman.split(/\s+/).length - targetWords),
  );
  for (const c of candidates) {
    if (out.length >= n) break;
    if (sameMeaning(c, target) || out.some((o) => sameMeaning(o, c))) continue;
    out.push(c);
  }
  return out;
}

function withKeys<T>(items: T[], prefix: string): (T & { key: string })[] {
  return items.map((item, i) => ({ ...item, key: `${prefix}${i}` }));
}

function tilesFor(text: string, extra: string[], rng: Rng, prefix: string) {
  const words = [...stripPunct(text).split(" "), ...extra];
  return shuffle(
    words.map((w, i) => ({ key: `${prefix}${i}`, text: w })),
    rng,
  );
}

export function resolveExercise(ex: Exercise, exId: string, ctx: ResolveContext): Resolved {
  const rng = seededRng(hashString(exId) ^ (ctx.seed ?? 0));
  switch (ex.type) {
    case "meaning":
    case "listen": {
      const target = need(ctx, ex.phrase);
      const wrong = ex.distractors ?? autoDistractors(target, ctx, rng, 3).map((p) => p.en);
      const options = shuffle(withKeys([{ text: target.en }, ...wrong.map((text) => ({ text }))], "o"), rng);
      const listen = ex.type === "listen";
      return {
        type: "choice",
        id: exId,
        flavour: ex.type,
        prompt: listen ? "What did you hear?" : "What does this mean?",
        show: listen ? undefined : target,
        audio: target,
        audioOnly: listen,
        speed: listen ? ex.speed : "normal",
        options,
        answerKey: "o0",
        target,
      };
    }
    case "say": {
      const target = need(ctx, ex.phrase);
      const wrong = ex.distractors ? ex.distractors.map((d) => need(ctx, d)) : autoDistractors(target, ctx, rng, 2);
      const options = shuffle(withKeys([{ phrase: target }, ...wrong.map((phrase) => ({ phrase }))], "o"), rng);
      return {
        type: "choice",
        id: exId,
        flavour: "say",
        prompt: ex.prompt ?? `How do you say: “${target.en}”`,
        audioOnly: false,
        speed: "normal",
        options,
        answerKey: "o0",
        explain: ex.explain,
        target,
      };
    }
    case "mc": {
      if (ex.answer >= ex.options.length) throw new ContentError(`${exId}: answer index out of range`);
      const keyed = withKeys(
        ex.options.map((o) => ({
          text: o.text,
          glyph: o.glyph,
          feedback: o.feedback,
          phrase: o.phrase ? need(ctx, o.phrase) : undefined,
        })),
        "o",
      );
      const answer = keyed[ex.answer];
      return {
        type: "choice",
        id: exId,
        flavour: "mc",
        prompt: ex.prompt,
        show: ex.show ? need(ctx, ex.show) : undefined,
        glyph: ex.glyph,
        audio: ex.audio ? need(ctx, ex.audio) : ex.show ? need(ctx, ex.show) : undefined,
        audioOnly: false,
        urduOnly: ex.urduOnly,
        speed: "normal",
        options: shuffle(keyed, rng),
        answerKey: `o${ex.answer}`,
        explain: ex.explain,
        target: answer?.phrase ?? (ex.show ? need(ctx, ex.show) : undefined),
      };
    }
    case "match": {
      const phrases = ex.phrases.map((p) => need(ctx, p));
      return {
        type: "match",
        id: exId,
        mode: ex.mode,
        phrases: shuffle(phrases, rng),
        rightOrder: shuffle(
          phrases.map((p) => p.id),
          rng,
        ),
      };
    }
    case "type": {
      const phrase = need(ctx, ex.phrase);
      return {
        type: "type",
        id: exId,
        prompt: ex.prompt ?? `Type it in Roman Urdu: “${phrase.en}”`,
        phrase,
        accept: [...(phrase.accept ?? []), ...(ex.accept ?? [])],
        reject: ex.reject ?? [],
      };
    }
    case "build": {
      const phrase = need(ctx, ex.phrase);
      const d = ex.distractors ?? [];
      return {
        type: "build",
        id: exId,
        prompt: ex.prompt ?? `Build the sentence: “${phrase.en}”`,
        phrase,
        tiles: {
          roman: tilesFor(
            phrase.roman,
            d.map((t) => t.roman),
            rng,
            "r",
          ),
          urdu: tilesFor(
            phrase.urdu,
            d.map((t) => t.urdu),
            rng,
            "u",
          ),
        },
      };
    }
    case "respect": {
      if (!ex.options.some((o) => o.verdict === "right")) {
        throw new ContentError(`${exId}: respect pick needs a right option`);
      }
      return {
        type: "respect",
        id: exId,
        situation: ex.situation,
        listener: ex.listener,
        options: shuffle(
          withKeys(
            ex.options.map((o) => ({ phrase: need(ctx, o.phrase), verdict: o.verdict, feedback: o.feedback })),
            "o",
          ),
          rng,
        ),
      };
    }
    case "gap": {
      const phrase = need(ctx, ex.phrase);
      return {
        type: "gap",
        id: exId,
        phrase,
        parts: { roman: splitAround(phrase.roman, ex.word.roman, exId), urdu: splitAround(phrase.urdu, ex.word.urdu, exId) },
        bank: shuffle(withKeys<TokenPair>([ex.word, ...ex.distractors], "o"), rng),
        answerKey: "o0",
        explain: ex.explain,
      };
    }
    case "speak":
      return { type: "speak", id: exId, phrase: need(ctx, ex.phrase) };
    case "trace":
      return { type: "trace", id: exId, glyph: ex.glyph, label: ex.label };
    case "dictation": {
      const phrase = need(ctx, ex.phrase);
      return {
        type: "type",
        id: exId,
        prompt: ex.speed === "aunty" ? "Aunty speed. Type what she said." : "Type what you hear",
        phrase,
        accept: phrase.accept ?? [],
        reject: [],
        dictation: ex.speed,
      };
    }
    case "scene": {
      if (ex.answer >= ex.options.length) throw new ContentError(`${exId}: answer index out of range`);
      return {
        type: "scene",
        id: exId,
        setup: ex.setup,
        lines: ex.lines.map((l) => ({ speaker: l.speaker, phrase: need(ctx, l.phrase) })),
        question: ex.question,
        options: shuffle(withKeys(ex.options, "o"), rng),
        answerKey: `o${ex.answer}`,
        hideText: ex.hideText ?? false,
        explain: ex.explain,
      };
    }
    case "spot": {
      const phrase = need(ctx, ex.phrase);
      const plant = (sentence: string, right: string, wrong: string, prefix: string) => {
        const words = stripPunct(sentence).split(" ");
        const i = words.findIndex((w) => w.toLowerCase() === right.toLowerCase());
        if (i < 0) throw new ContentError(`${exId}: spot word "${right}" is not in "${sentence}"`);
        return words.map((w, j) => ({ key: `${prefix}${j}`, text: j === i ? wrong : w, wrong: j === i }));
      };
      if (normalise(ex.word.roman) === normalise(ex.wrong.roman)) throw new ContentError(`${exId}: spot wrong word equals the right one`);
      return {
        type: "spot",
        id: exId,
        prompt: ex.prompt ?? "One word is wrong. Tap it.",
        phrase,
        tokens: { roman: plant(phrase.roman, ex.word.roman, ex.wrong.roman, "r"), urdu: plant(phrase.urdu, ex.word.urdu, ex.wrong.urdu, "u") },
        word: ex.word,
        wrong: ex.wrong,
        explain: ex.explain,
      };
    }
    case "sort": {
      const items = ex.items.map((it) => {
        if (it.bucket >= ex.buckets.length) throw new ContentError(`${exId}: sort bucket out of range`);
        if (!it.phrase && !it.text) throw new ContentError(`${exId}: sort item needs a phrase or text`);
        return { phrase: it.phrase ? need(ctx, it.phrase) : undefined, text: it.text, bucket: it.bucket };
      });
      for (let b = 0; b < ex.buckets.length; b++) {
        if (!items.some((it) => it.bucket === b)) throw new ContentError(`${exId}: sort bucket "${ex.buckets[b]}" is empty`);
      }
      return { type: "sort", id: exId, prompt: ex.prompt, buckets: ex.buckets, items: shuffle(withKeys(items, "i"), rng), explain: ex.explain };
    }
  }
}

/** Phrase ids an authored exercise refers to (for shipping only what a page needs). */
export function phraseRefs(ex: Exercise): string[] {
  switch (ex.type) {
    case "match":
      return ex.phrases;
    case "mc":
      return [ex.show, ex.audio, ...ex.options.map((o) => o.phrase)].filter((x): x is string => Boolean(x));
    case "respect":
      return ex.options.map((o) => o.phrase);
    case "say":
      return [ex.phrase, ...(ex.distractors ?? [])];
    case "trace":
      return [];
    case "scene":
      return ex.lines.map((l) => l.phrase);
    case "sort":
      return ex.items.map((i) => i.phrase).filter((x): x is string => Boolean(x));
    default:
      return [ex.phrase];
  }
}

export function checkSpot(ex: ResolvedSpot, key: string, script: Script): Verdict {
  return ex.tokens[script].find((t) => t.key === key)?.wrong ? "correct" : "wrong";
}

/** All items in the right bucket is correct; exactly one misplaced is "almost". */
export function checkSort(ex: ResolvedSort, placed: Readonly<Record<string, number>>): { verdict: Verdict; wrong: string[] } {
  const wrong = ex.items.filter((it) => placed[it.key] !== it.bucket).map((it) => it.key);
  return { verdict: wrong.length === 0 ? "correct" : "wrong", wrong };
}

/** Split a sentence around the first whole-word occurrence of `word`. */
export function splitAround(sentence: string, word: string, where = ""): [string, string] {
  const tokens = sentence.split(" ");
  const i = tokens.findIndex((t) => stripPunct(t).toLowerCase() === word.toLowerCase());
  if (i < 0) throw new ContentError(`${where}: gap word "${word}" is not in "${sentence}"`);
  const token = tokens[i] ?? "";
  const tail = token.slice(stripPunct(token).length); // keep trailing punctuation with the sentence
  return [tokens.slice(0, i).join(" "), [tail, ...tokens.slice(i + 1)].join(" ").replace(/^ (?=\S)/, "")];
}

/** Hard mode: swap recognition for production (type instead of pick, dictation instead of listen-and-pick). */
export function harden(ex: Exercise): Exercise {
  if (ex.type === "say") return { type: "type", phrase: ex.phrase, ...(ex.prompt ? { prompt: ex.prompt } : {}) };
  if (ex.type === "listen") return { type: "dictation", phrase: ex.phrase, speed: ex.speed };
  return ex;
}

export type Verdict = "correct" | "almost" | "wrong";

export function checkChoice(ex: ResolvedChoice | ResolvedGap | ResolvedScene, key: string): Verdict {
  return key === ex.answerKey ? "correct" : "wrong";
}

export function checkType(ex: ResolvedType, input: string): MatchResult {
  return matchAnswer(input, ex.phrase.roman, { accept: ex.accept, reject: ex.reject });
}

export function checkBuild(ex: ResolvedBuild, chosen: readonly string[], script: Script): Verdict {
  const target = script === "roman" ? ex.phrase.roman : ex.phrase.urdu;
  const norm = (s: string) => stripPunct(s).toLowerCase();
  return norm(chosen.join(" ")) === norm(target) ? "correct" : "wrong";
}

/** "ok" counts as correct (it works socially) but the feedback explains the better choice. */
export function checkRespect(ex: ResolvedRespect, key: string): { verdict: Verdict; feedback: string } {
  const o = ex.options.find((x) => x.key === key);
  if (!o) return { verdict: "wrong", feedback: "" };
  return { verdict: o.verdict === "right" ? "correct" : o.verdict === "ok" ? "almost" : "wrong", feedback: o.feedback };
}

export function checkMatchPair(leftId: string, rightId: string): boolean {
  return leftId === rightId;
}

/** Phrase ids an exercise practises, for spaced review bookkeeping. */
export function targetsOf(ex: Resolved): string[] {
  switch (ex.type) {
    case "choice":
      return ex.target ? [ex.target.id] : [];
    case "match":
      return ex.phrases.map((p) => p.id);
    case "respect":
      return ex.options.filter((o) => o.verdict === "right").map((o) => o.phrase.id);
    case "trace":
      return [];
    case "scene":
      return ex.lines.map((l) => l.phrase.id);
    case "sort":
      return ex.items.flatMap((i) => (i.phrase ? [i.phrase.id] : []));
    default:
      return [ex.phrase.id];
  }
}

export type Skill = "listening" | "speaking" | "recall" | "recognition" | "reading" | "grammar";

/** Which skill an exercise mostly trains, for the skill model (engine/skills.ts). */
export function skillOf(ex: Resolved): Skill {
  switch (ex.type) {
    case "choice":
      if (ex.flavour === "listen") return "listening";
      return ex.urduOnly || ex.glyph || ex.options.some((o) => o.glyph) ? "reading" : "recognition";
    case "match":
      return ex.mode === "audio" ? "listening" : "recognition";
    case "type":
      return ex.dictation ? "listening" : "recall";
    case "build":
      return "recall";
    case "respect":
    case "gap":
    case "spot":
    case "sort":
      return "grammar";
    case "speak":
      return "speaking";
    case "trace":
      return "reading";
    case "scene":
      return "listening";
  }
}

/**
 * Generate a varied drill for a list of phrases (used by review sessions and prep packs).
 * Production-heavy on purpose: heritage learners recognise far more than they can produce.
 */
const SAY_PROMPTS = [
  "Khala is waiting. Say: “{en}”",
  "Nani raises one eyebrow. Quick: “{en}”",
  "The whole dawat goes quiet. Your line: “{en}”",
  "Ammi is watching from the kitchen. Say: “{en}”",
  "Bilal thinks you can't say “{en}”. Prove him wrong.",
  "Voice note time. Say: “{en}”",
];
const TYPE_PROMPTS = [
  "WhatsApp the family group: “{en}”",
  "Type it before Khala calls back: “{en}”",
  "Text your cousin: “{en}”",
  "Type it in Roman Urdu: “{en}”",
];

function fill(templates: readonly string[], en: string, rng: () => number): string {
  const t = templates[Math.floor(rng() * templates.length)] ?? templates[0] ?? "{en}";
  return t.replace("{en}", en.replace(/\s*\(.*?\)\s*/g, " ").trim());
}

export function generateDrill(
  phraseIds: readonly string[],
  seed: number,
  english?: ReadonlyMap<string, string>,
): Exercise[] {
  const rng = seededRng(seed);
  const out: Exercise[] = [];
  const cycle: Exercise["type"][] = ["say", "type", "listen", "build", "meaning", "type"];
  phraseIds.forEach((phrase, i) => {
    const type = cycle[(i + Math.floor(rng() * 2)) % cycle.length] ?? "say";
    const en = english?.get(phrase);
    if (type === "say") out.push(en ? { type: "say", phrase, prompt: fill(SAY_PROMPTS, en, rng) } : { type: "say", phrase });
    else if (type === "type") out.push(en ? { type: "type", phrase, prompt: fill(TYPE_PROMPTS, en, rng) } : { type: "type", phrase });
    else if (type === "listen") out.push({ type: "listen", phrase, speed: rng() < 0.4 ? "aunty" : "normal" });
    else if (type === "build") out.push({ type: "build", phrase });
    else out.push({ type: "meaning", phrase });
  });
  if (phraseIds.length >= 3) {
    out.splice(Math.min(out.length, 3), 0, {
      type: "match",
      phrases: phraseIds.slice(0, Math.min(5, phraseIds.length)),
      mode: "meaning",
    });
  }
  return out;
}
