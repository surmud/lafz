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

/** Equivalence classes for short or irregular words. The first entry is the canonical spelling. */
const LEXICON_CLASSES: readonly (readonly string[])[] = [
  ["hai", "hain", "hay", "he", "hy", "h", "hein", "hen", "hae", "hei", "hn"],
  ["main", "mai", "mein", "me", "mei", "mn", "mien", "mey"],
  ["haan", "han", "ha", "haa", "hanh", "haaan"],
  ["hoon", "hun", "hu", "hon", "hoo", "houn"],
  ["kyun", "kyon", "kyu", "kiun", "kiyun", "q", "kyoun", "kiu", "kyo"],
  ["nahin", "nahi", "nai", "nhi", "nahe", "ni", "nahee", "naheen", "nae", "nhn", "nahn"],
  ["ke", "kay", "k", "kai"],
  ["ki", "kee", "ky"],
  ["kya", "kia", "kiya", "kiaa", "kyaa", "kyah"],
  ["aap", "ap", "aaap", "app"],
  ["aur", "or", "aor", "our", "awr"],
  ["yeh", "ye", "yah", "yeah", "yey", "yay"],
  ["woh", "wo", "voh", "vo", "wah", "who"],
  ["theek", "thik", "teek", "tik", "thk", "theak", "thek", "thekh", "thikh", "theekh", "tk"],
  ["bohat", "bahut", "bohot", "boht", "bhot", "bahot", "buhat", "bohut", "bht", "bahoot", "bohat"],
  ["se", "say", "sy"],
  ["ne", "nay", "ny"],
  ["par", "per", "pe", "pay", "py"],
  ["toh", "to", "tou"],
  ["bhi", "b", "bi", "bhe", "bhee", "bee"],
  ["hum", "ham"],
  ["sab", "sub"],
  ["bas", "bus"],
  ["tum", "tm", "tumm"],
  ["ko", "koo"],
  ["chahiye", "chahie", "chaiye", "chahye", "chaye", "chahiay", "chaheye", "chahiyay", "chahiey"],
  ["ramzan", "ramadan", "ramazan", "ramadhan", "ramzaan", "ramadaan"],
  ["liye", "lie", "liay", "lye", "liyay", "leye"],
  ["ji", "jee", "g", "jii"],
  ["acha", "achha", "accha", "achcha", "achchha", "acha", "axha"],
  ["kaise", "kese", "kaisay", "kesay", "kesy", "kaisey", "kaisy"],
  ["kaisi", "kesi", "kaisee", "kesee"],
  ["kaisa", "kesa", "kaysa"],
  ["ek", "aik", "eik", "ik", "aek"],
  ["koi", "koyi", "koee", "koii"],
  ["gaya", "gya", "giya", "gia", "gayaa"],
  ["gayi", "gai", "gayee", "gyi", "gaee"],
  ["gaye", "gae", "gayay", "gye", "gaey"],
  ["hua", "huwa", "howa", "hoa", "huaa"],
  ["hui", "hoi", "huwi", "huee", "hoee"],
  ["rahi", "rhi", "rahee"],
  ["raha", "rha", "rahaa"],
  ["rahe", "rhe", "rahay", "rahey", "rhy", "rahy"],
  ["assalam", "asalam", "aslam", "assalaam", "asalaam", "assalamu", "asalamu", "salam", "salaam", "slam"],
  ["alaikum", "alaykum", "alekum", "alikum", "aleikum", "alaikom", "elaikum", "alykum"],
  ["walaikum", "waalaikum", "walaykum", "walekum", "walikum", "waleikum", "valaikum", "wailaikum"],
  ["insha", "inshaa", "insh", "in sha"],
  ["mashallah", "mashaallah", "mashaalah", "mashalla", "mashaallaah", "masha allah", "mashalah"],
  ["inshallah", "inshaallah", "inshaalah", "inshalla", "insha allah", "inshalah", "inshaallaah"],
  ["shukriya", "shukria", "shukrya", "shukriyah", "shukriyaa", "shukrea", "sukriya", "shukreya"],
  ["meherbani", "meharbani", "mehrbani", "mehrabani", "maherbani", "merbani", "meherbaani", "mehrbaani"],
  ["mubarak", "mubaarak", "mobarak", "mubark", "mubarik", "mubarakh"],
  ["hafiz", "hafez", "hafis", "haafiz"],
  ["khuda", "khudha", "khoda"],
  ["allah", "alah", "allaah"],
  ["zyada", "ziada", "zada", "zyadah", "ziyada", "jyada", "zayada", "zyaada"],
  ["thora", "thoda", "tora", "thorra", "thorha", "toda"],
  ["thori", "thodi", "tori", "thorri"],
  ["larka", "ladka", "lrka", "larrka"],
  ["larki", "ladki", "lrki", "larrki"],
  ["bara", "bada", "barra", "baraa"],
  ["bari", "badi", "barri", "baree"],
  ["bare", "bade", "barre", "baray", "barey"],
  ["parhna", "padhna", "parna", "parrhna", "parhnaa"],
  ["sarak", "sadak", "sarrak"],
  ["garhi", "gari", "gaadi", "gaari", "gadi", "garri"],
  ["phuppo", "phupho", "phuphi", "phupo", "fuppo", "phuppi", "phoopho", "phuphu", "phuppho"],
  ["mujhe", "mujhay", "mujhy", "muje", "mjhe", "mujhey", "mujay"],
  ["tumhe", "tumhein", "tumhen", "tumhay", "tume", "tumein", "tumhain"],
  ["hamein", "hame", "humein", "humain", "hamen", "humen", "hamain", "hume"],
  ["unhein", "unhe", "unhen", "unhain", "une"],
  ["wahan", "vahan", "wahaan", "waha", "vaha", "wahn", "whan"],
  ["yahan", "yahaan", "yaha", "yhan", "yahn"],
  ["kahan", "kahaan", "kaha"],
  ["pehle", "pahle", "pehlay", "phle", "pehley", "pahlay", "pehly", "pele"],
  ["behen", "bahan", "behn", "behan", "bhen", "bahen", "bahn", "behin"],
  ["mehndi", "mehendi", "mehandi", "mendi", "menhdi"],
  ["subah", "suba", "subha", "subh", "subaah"],
  ["jagah", "jaga", "jagha", "jgah", "jaggah"],
  ["tarah", "tarha", "trah", "tarhan"],
  ["waqt", "wakt", "vaqt", "waqat", "wakat", "wqt"],
  ["zaroor", "zarur", "zrur", "zaror", "zarroor", "jaroor"],
  ["zaroorat", "zarurat", "zrurat", "zarorat"],
  ["maaf", "maf", "muaf", "moaf", "mauf", "maff"],
  ["dua", "duaa", "doa", "duwa"],
  ["chai", "chae", "chaay", "chay", "cha"],
  ["paani", "pani", "panee", "paany"],
  ["khana", "khaana", "khanaa"],
  ["kahna", "kehna", "kehnaa", "kahnaa", "kehnna"],
];

/** Pairs of real words that fold close to each other but mean different things. */
const CONFUSABLES: readonly (readonly [string, string])[] = [
  ["khana", "kahna"],
  ["tu", "tum"],
  ["tum", "aap"],
  ["kal", "kala"],
  ["mama", "mami"],
  ["chacha", "chachi"],
  ["dada", "dadi"],
  ["nana", "nani"],
  ["khala", "khalu"],
  ["beta", "beti"],
  ["mera", "meri"],
  ["tha", "thi"],
  ["hai", "ho"],
  ["hoon", "ho"],
  ["jao", "aao"],
  ["jana", "aana"],
  ["lena", "dena"],
  ["lo", "do"],
  ["yahan", "wahan"],
  ["yeh", "woh"],
  ["kab", "kya"],
  ["kaun", "kahan"],
];

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

/** Phonetic folding without the lexicon. */
function foldRaw(token: string): string {
  let t = token;
  t = t.replace(/c+h+/g, "C").replace(/C+/g, "C");
  t = t.replace(/s+h+/g, "S").replace(/S+/g, "S");
  t = t.replace(/ph/g, "f");
  t = t.replace(/zh/g, "z");
  // aspiration after a consonant
  t = t.replace(/([bdgjkptrlmnz])h/g, "$1");
  t = t.replace(/w/g, "v").replace(/q/g, "k").replace(/x/g, "ks");
  // trailing h after a vowel
  t = t.replace(/([aeiou])h$/, "$1");
  // long vowels
  t = t.replace(/a{2,}/g, "a").replace(/e{2,}|i{2,}/g, "i").replace(/o{2,}|u{2,}/g, "u");
  // glides
  t = t.replace(/iy(?=[aeiou])/g, "y").replace(/i(?=a)/g, "y").replace(/i(?=e$)/g, "y");
  t = t.replace(/a[ie]|ei/g, "e");
  t = t.replace(/[ae]y(?![aeiou])/g, "e");
  t = t.replace(/a[uv](?![aeiou])|ou(?![aeiou])/g, "o");
  // trailing y after a consonant (sms style: mujhy, kesy)
  t = t.replace(/([^aeiouy])y$/, "$1e");
  // merge e/i and o/u except word-finally
  if (t.length > 1) {
    const body = t.slice(0, -1).replace(/e/g, "i").replace(/o/g, "u");
    t = body + t.slice(-1);
  }
  // doubled letters
  t = t.replace(/(.)\1+/g, "$1");
  return t;
}

const LEXICON: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const cls of LEXICON_CLASSES) {
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
  CONFUSABLES.flatMap(([a, b]) => [`${foldToken(a)}|${foldToken(b)}`, `${foldToken(b)}|${foldToken(a)}`]),
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

/** Normalise Urdu-script text for loose comparison (speech recognition transcripts). */
export function normaliseUrdu(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[ً-ٰٟۖ-ۭ]/g, "") // harakat and Quranic marks
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[هھة]/g, "ہ")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ی")
    .replace(/[^؀-ۿ\s]/g, " ")
    .replace(/[،۔؟؛]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Similarity 0..1 between two Urdu-script strings, ignoring spacing and diacritics. */
export function urduSimilarity(a: string, b: string): number {
  const x = normaliseUrdu(a).replace(/\s/g, "");
  const y = normaliseUrdu(b).replace(/\s/g, "");
  if (x.length === 0 || y.length === 0) return 0;
  return 1 - editDistance(x, y) / Math.max(x.length, y.length);
}

const ARABIC_SCRIPT = /[؀-ۿ]/;

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
