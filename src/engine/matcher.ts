/**
 * Forgiving Roman Urdu matching (SPEC §8).
 *
 * Roman Urdu has no standard spelling: "shukriya", "shukria" and "shukrya" are all the same word.
 * The matcher therefore works in three layers:
 *
 * 1. normalise()  – lowercase, strip diacritics and punctuation, `-` and `'` become spaces.
 * 2. foldToken()  – phonetic folding so that spelling variants collapse to one key:
 *      - short-word lexicon (h = hai, k = ke, kia = kya …) for words too short for edit distance
 *      - ch/chh/cch → one symbol, sh → one symbol, ph → f
 *      - aspiration dropped after a consonant (bhai ≈ bai, mujhe ≈ muje, tumhara ≈ tumara)
 *      - trailing h after a vowel dropped (woh ≈ wo, yeh ≈ ye, jagah ≈ jaga)
 *      - w → v, q → k, zh → z
 *      - vowels: aa → a, ee/ii → i, oo/uu → u, ai/ae/ei/ay/ey → e, au/aw → o, ia/iya → ya
 *      - e/i and o/u are merged except at the end of a word, where they carry grammar
 *      - doubled letters collapse
 * 3. compare      – per token Damerau-Levenshtein with a tolerance that grows with word length, plus a
 *    whole-answer similarity floor. A difference in the *final vowel* is never forgiven, because in
 *    Urdu that is grammar (mera/meri/mere, acha/achi).
 *
 * Deviation from the SPEC wording: `dh → z` is not applied globally because `dh` is far more often
 * the aspirated د (doodh, dhoop) than ذ/ض. Words such as ramzan/ramadan are handled by the lexicon.
 *
 * Results: "correct" (same after folding), "almost" (small typo; show the canonical spelling, still
 * counts as correct) or "incorrect". Per-exercise `accept` and `reject` lists are honoured;
 * `reject` catches near-misses that mean something else (khana "food" vs kahna "to say").
 */

import { pack } from "@/lang";

export type MatchVerdict = "correct" | "almost" | "incorrect";

export interface MatchResult {
  verdict: MatchVerdict;
  /** The canonical answer the learner was closest to. */
  canonical: string;
  /** True if a reject-list entry was hit. */
  rejected?: boolean;
}

export interface MatchOptions {
  accept?: readonly string[];
  reject?: readonly string[];
}

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export function normalise(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[-'’‘`_]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Phonetic folding without the lexicon: the active language pack's rules. */
const foldRaw = (token: string): string => pack.romanization.fold(token);

const LEXICON: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const cls of pack.romanization.lexicon) {
    const first = cls[0];
    if (first === undefined) continue;
    const key = foldRaw(normalise(first).replace(/\s/g, ""));
    for (const variant of cls) {
      const v = normalise(variant).replace(/\s/g, "");
      if (!map.has(v)) map.set(v, key);
    }
  }
  return map;
})();

const CONFUSABLE_KEYS: ReadonlySet<string> = new Set(
  pack.romanization.confusables.flatMap(([a, b]) => [`${foldToken(a)}|${foldToken(b)}`, `${foldToken(b)}|${foldToken(a)}`]),
);

export function foldToken(token: string): string {
  const hit = LEXICON.get(token);
  if (hit !== undefined) return hit;
  return foldRaw(token);
}

export function foldTokens(input: string): string[] {
  const n = normalise(input);
  return n === "" ? [] : n.split(" ").map(foldToken);
}

/** Damerau-Levenshtein distance (optimal string alignment). */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: bl + 1 }, (_, j) => j);
  for (let i = 1; i <= al; i++) {
    const cur: number[] = [i];
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min((prev[j] ?? 0) + 1, (cur[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, (prev2[j - 2] ?? 0) + 1);
      }
      cur.push(v);
    }
    prev2 = prev;
    prev = cur;
  }
  return prev[bl] ?? 0;
}

export function tolerance(length: number): number {
  if (length <= 3) return 0;
  if (length <= 5) return 1;
  if (length <= 8) return 2;
  return 3;
}

function finalVowelClash(a: string, b: string): boolean {
  if (!pack.romanization.finalVowelIsGrammar) return false;
  const la = a[a.length - 1];
  const lb = b[b.length - 1];
  if (la === undefined || lb === undefined) return false;
  return la !== lb && VOWELS.has(la) && VOWELS.has(lb);
}

type TokenVerdict = "same" | "close" | "different";

interface Tok {
  raw: string;
  folded: string;
}

function toToks(input: string): Tok[] {
  const n = normalise(input);
  return n === "" ? [] : n.split(" ").map((raw) => ({ raw, folded: foldToken(raw) }));
}

function compareToken(given: Tok, expected: Tok): TokenVerdict {
  if (given.folded === expected.folded) return "same";
  if (CONFUSABLE_KEYS.has(`${given.folded}|${expected.folded}`)) return "different";
  // A known word that folds differently is a different word, not a typo (haan vs hain).
  if (LEXICON.has(given.raw)) return "different";
  if (finalVowelClash(given.folded, expected.folded)) return "different";
  const d = editDistance(given.folded, expected.folded);
  if (d <= tolerance(Math.max(given.folded.length, expected.folded.length))) return "close";
  // Typos inside lexicon words (hian for hain) only show up in the raw spelling.
  const rawD = editDistance(given.raw, expected.raw);
  return rawD <= tolerance(Math.max(given.raw.length, expected.raw.length)) ? "close" : "different";
}

/** Whole-answer similarity floor for multi-word answers. */
const SIMILARITY_FLOOR = 0.7;

function compareOne(given: Tok[], expected: string): MatchVerdict {
  const exp = toToks(expected);
  if (exp.length === 0 || given.length === 0) return "incorrect";
  const gJoined = given.map((t) => t.folded).join("");
  const eJoined = exp.map((t) => t.folded).join("");
  if (gJoined === eJoined) return "correct";

  if (given.length === exp.length) {
    let close = false;
    for (let i = 0; i < exp.length; i++) {
      const g = given[i];
      const e = exp[i];
      if (g === undefined || e === undefined) return "incorrect";
      const v = compareToken(g, e);
      if (v === "different") return "incorrect";
      if (v === "close") close = true;
    }
    if (!close) return "correct";
    if (exp.length === 1) return "almost";
    const whole = editDistance(gJoined, eJoined);
    const similarity = 1 - whole / Math.max(gJoined.length, eJoined.length);
    return similarity >= SIMILARITY_FLOOR ? "almost" : "incorrect";
  }

  // Different token counts: words were merged or split ("ho gaya" vs "hogaya"). Compare the joined
  // strings, folded both with and without the lexicon.
  if (Math.abs(given.length - exp.length) > 2) return "incorrect";
  const gRaw = foldRaw(given.map((t) => t.raw).join(""));
  const eRaw = foldRaw(exp.map((t) => t.raw).join(""));
  const gLex = foldRaw(gJoined);
  const eLex = foldRaw(eJoined);
  if (gRaw === eRaw || gLex === eLex) return "correct";
  if (finalVowelClash(gRaw, eRaw)) return "incorrect";
  const whole = Math.min(editDistance(gRaw, eRaw), editDistance(gLex, eLex));
  const longest = Math.max(gRaw.length, eRaw.length);
  const allowed = Math.min(2, tolerance(longest));
  if (whole <= allowed && 1 - whole / longest >= SIMILARITY_FLOOR) return "almost";
  return "incorrect";
}

/**
 * Compare what the learner typed against the canonical answer and any accepted alternatives.
 * The best verdict wins; a reject-list hit always loses.
 */
export function matchAnswer(given: string, canonical: string, options: MatchOptions = {}): MatchResult {
  const tokens = toToks(given);
  if (tokens.length === 0) return { verdict: "incorrect", canonical };
  const key = tokens.map((t) => t.folded).join(" ");

  for (const r of options.reject ?? []) {
    if (foldTokens(r).join(" ") === key) {
      return { verdict: "incorrect", canonical, rejected: true };
    }
  }

  let best: MatchResult = { verdict: "incorrect", canonical };
  for (const candidate of [canonical, ...(options.accept ?? [])]) {
    const verdict = compareOne(tokens, candidate);
    if (verdict === "correct") return { verdict, canonical: candidate };
    if (verdict === "almost" && best.verdict === "incorrect") best = { verdict, canonical: candidate };
  }
  return best;
}

/** Normalise native-script text for loose comparison (speech recognition transcripts). */
export function normaliseUrdu(input: string): string {
  return pack.script.normalise(input);
}

/** Similarity 0..1 between two Urdu-script strings, ignoring spacing and diacritics. */
export function urduSimilarity(a: string, b: string): number {
  const x = normaliseUrdu(a).replace(/\s/g, "");
  const y = normaliseUrdu(b).replace(/\s/g, "");
  if (x.length === 0 || y.length === 0) return 0;
  return 1 - editDistance(x, y) / Math.max(x.length, y.length);
}

const ARABIC_SCRIPT = pack.script.chars;

/**
 * Judge a speech transcript, which may come back in Nastaliq or Roman. Deliberately generous:
 * speech recognition for Urdu is rough, and speaking is never required.
 */
export function matchSpeech(
  transcripts: readonly string[],
  phrase: { roman: string; urdu: string; accept?: readonly string[] },
): MatchVerdict {
  let best: MatchVerdict = "incorrect";
  for (const t of transcripts) {
    if (ARABIC_SCRIPT.test(t)) {
      const s = urduSimilarity(t, phrase.urdu);
      if (s >= 0.8) return "correct";
      if (s >= 0.55) best = "almost";
    } else {
      const r = matchAnswer(t, phrase.roman, { accept: phrase.accept }).verdict;
      if (r === "correct") return "correct";
      if (r === "almost") best = "almost";
    }
  }
  return best;
}
