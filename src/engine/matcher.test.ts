import { describe, expect, test } from "vitest";
import {
  editDistance,
  foldToken,
  matchAnswer,
  matchSpeech,
  normalise,
  normaliseUrdu,
  tolerance,
  urduSimilarity,
} from "./matcher";

type Row = [given: string, expected: string];

/** Real-world spelling variants that must all count as correct (same after folding). */
const SAME: Row[] = [
  // greetings
  ["assalam o alaikum", "assalam-o-alaikum"],
  ["Assalam-o-Alaikum!", "assalam-o-alaikum"],
  ["asalam o alaikum", "assalam-o-alaikum"],
  ["aslam o alikum", "assalam-o-alaikum"],
  ["salam o alaikum", "assalam-o-alaikum"],
  ["assalaam o alaykum", "assalam-o-alaikum"],
  ["assalamualaikum", "assalam-o-alaikum"],
  ["asalamualaikum", "assalam-o-alaikum"],
  ["walaikum assalam", "walaikum assalam"],
  ["walaikum salam", "walaikum assalam"],
  ["waalaikum asalam", "walaikum assalam"],
  ["walekum salaam", "walaikum assalam"],
  ["valaikum assalam", "walaikum assalam"],
  ["khuda hafiz", "khuda hafiz"],
  ["khudahafiz", "khuda hafiz"],
  ["Khuda Hafiz.", "khuda hafiz"],
  ["khuda haafiz", "khuda hafiz"],
  ["khoda hafez", "khuda hafiz"],
  ["allah hafiz", "allah hafiz"],
  ["alah hafiz", "allah hafiz"],
  // how are you
  ["aap kaise hain", "aap kaise hain?"],
  ["ap kese hain", "aap kaise hain?"],
  ["ap kaisay hai", "aap kaise hain?"],
  ["aap kesy hein", "aap kaise hain?"],
  ["AAP KAISE HAIN", "aap kaise hain?"],
  ["ap kese hn", "aap kaise hain?"],
  ["aap kaisi hain", "aap kaisi hain?"],
  ["ap kesi hai", "aap kaisi hain?"],
  ["kya haal hai", "kya haal hai?"],
  ["kia hal h", "kya haal hai?"],
  ["kia haal hai", "kya haal hai?"],
  ["kya hal hy", "kya haal hai?"],
  ["kiya haal he", "kya haal hai?"],
  ["main theek hoon", "main theek hoon"],
  ["me thik hun", "main theek hoon"],
  ["mein theek hoon", "main theek hoon"],
  ["mai teek hu", "main theek hoon"],
  ["main thik hon", "main theek hoon"],
  ["mn thk hun", "main theek hoon"],
  ["sab theek hai", "sab theek hai"],
  ["sab thik h", "sab theek hai"],
  ["sub theek hai", "sab theek hai"],
  // thanks
  ["shukriya", "shukriya"],
  ["shukria", "shukriya"],
  ["shukrya", "shukriya"],
  ["Shukriyah", "shukriya"],
  ["sukriya", "shukriya"],
  ["bohat shukriya", "bohat shukriya"],
  ["bahut shukria", "bohat shukriya"],
  ["boht shukrya", "bohat shukriya"],
  ["bohot shukriya", "bohat shukriya"],
  ["meherbani", "meherbani"],
  ["meharbani", "meherbani"],
  ["mehrbani", "meherbani"],
  // yes / no
  ["ji haan", "ji haan"],
  ["jee han", "ji haan"],
  ["g han", "ji haan"],
  ["ji ha", "ji haan"],
  ["ji nahin", "ji nahin"],
  ["jee nahi", "ji nahin"],
  ["ji nai", "ji nahin"],
  ["g nhi", "ji nahin"],
  ["nahin", "nahin"],
  ["nahee", "nahin"],
  // names and questions
  ["aap ka naam kya hai", "aap ka naam kya hai?"],
  ["apka nam kia hai", "aap ka naam kya hai?"],
  ["aapka naam kya h", "aap ka naam kya hai?"],
  ["ap ka nam kya hy", "aap ka naam kya hai?"],
  ["mera naam sara hai", "mera naam Sara hai"],
  ["mera nam sara h", "mera naam Sara hai"],
  ["yeh kya hai", "yeh kya hai?"],
  ["ye kia hai", "yeh kya hai?"],
  ["yah kya he", "yeh kya hai?"],
  ["woh kaun hai", "woh kaun hai?"],
  ["wo kon hai", "woh kaun hai?"],
  ["voh kaun h", "woh kaun hai?"],
  ["kyun", "kyun?"],
  ["kyon", "kyun?"],
  ["kyu", "kyun?"],
  ["q", "kyun?"],
  // aspiration and doubled letters
  ["acha", "achha"],
  ["accha", "achha"],
  ["achcha", "achha"],
  ["bohat acha", "bohat achha"],
  ["bhai", "bhai"],
  ["mujhe chai chahiye", "mujhe chai chahiye"],
  ["mujhay chai chahie", "mujhe chai chahiye"],
  ["mujhy chae chaiye", "mujhe chai chahiye"],
  ["muje chai chahye", "mujhe chai chahiye"],
  ["tumhara", "tumhara"],
  ["tumara", "tumhara"],
  ["tumhaara", "tumhara"],
  ["thoda", "thora"],
  ["thora sa", "thora sa"],
  ["tora sa", "thora sa"],
  ["ghar", "ghar"],
  ["gar", "ghar"],
  ["phir milenge", "phir milenge"],
  ["fir milenge", "phir milenge"],
  ["phir milengay", "phir milenge"],
  ["phir milaingay", "phir milenge"],
  // w/v, q/k, z
  ["alvida", "alvida"],
  ["alwida", "alvida"],
  ["waqt", "waqt"],
  ["wakt", "waqt"],
  ["vaqt", "waqt"],
  ["qeemat", "qeemat"],
  ["kimat", "qeemat"],
  ["keemat", "qeemat"],
  ["zaroor", "zaroor"],
  ["zarur", "zaroor"],
  ["ramadan mubarak", "ramzan mubarak"],
  ["ramzaan mubaarak", "ramzan mubarak"],
  ["eid mubarak", "eid mubarak"],
  ["eed mubarak", "eid mubarak"],
  ["id mubarik", "eid mubarak"],
  // vowels and glides
  ["paani", "paani"],
  ["pani", "paani"],
  ["khaana", "khana"],
  ["khana kha lo", "khana kha lo"],
  ["khaana khaa lo", "khana kha lo"],
  ["aur", "aur"],
  ["or", "aur"],
  ["ek chai", "ek chai"],
  ["aik chai", "ek chai"],
  ["koi baat nahin", "koi baat nahin"],
  ["koi bat nahi", "koi baat nahin"],
  ["koyi baat nai", "koi baat nahin"],
  ["theek hai", "theek hai"],
  ["thik hai", "theek hai"],
  ["tk h", "theek hai"],
  ["zyada", "zyada"],
  ["ziada", "zyada"],
  ["bas bas", "bas, bas!"],
  ["bus bus", "bas, bas!"],
  ["mashallah", "mashallah"],
  ["mashaallah", "mashallah"],
  ["masha allah", "mashallah"],
  ["inshallah", "inshallah"],
  ["insha allah", "inshallah"],
  ["inshaAllah", "inshallah"],
  // merged / split words
  ["ho gaya", "ho gaya"],
  ["hogaya", "ho gaya"],
  ["ho gya", "ho gaya"],
  ["kar raha hoon", "kar raha hoon"],
  ["kar rha hun", "kar raha hoon"],
  ["karraha hoon", "kar raha hoon"],
  ["awaz aa rahi hai", "awaaz aa rahi hai?"],
  ["awaaz a rhi h", "awaaz aa rahi hai?"],
  ["aawaz aa rahi hai", "awaaz aa rahi hai?"],
  ["wahan", "wahan"],
  ["vahan", "wahan"],
  ["waha", "wahan"],
  ["pehle aap", "pehle aap"],
  ["pahle ap", "pehle aap"],
  ["pehlay aap", "pehle aap"],
  ["maaf kijiye", "maaf kijiye"],
  ["maf kijiye", "maaf kijiye"],
  ["maaf kijiay", "maaf kijiye"],
  ["maaf kijye", "maaf kijiye"],
  ["tashreef rakhye", "tashreef rakhiye"],
  ["tashrif rakhiye", "tashreef rakhiye"],
];

/** Small typos: accepted, but the canonical spelling is shown. */
const ALMOST: Row[] = [
  ["shukirya", "shukriya"],
  ["shukriyq", "shukriya"],
  ["khuda hafix", "khuda hafiz"],
  ["meherbni", "meherbani"],
  ["mubrak", "mubarak"],
  ["aap kaise hian", "aap kaise hain?"],
  ["walaikm assalam", "walaikum assalam"],
  ["zaroot", "zaroor"],
  ["alvdia", "alvida"],
  ["phir milege", "phir milenge"],
  ["mera naam sraa hai", "mera naam Saraa hai"],
  ["bohat ahcha", "bohat achha"],
  ["dastarkhan", "dastarkhwan"],
];

/** Different meaning, different register or different grammar: never accepted. */
const WRONG: Row[] = [
  ["khana", "kahna"],
  ["kahna", "khana"],
  ["tum kaise ho", "aap kaise hain?"],
  ["tu kaisa hai", "aap kaise hain?"],
  ["tu", "tum"],
  ["tum", "tu"],
  ["tum", "aap"],
  ["meri naam sara hai", "mera naam Sara hai"],
  ["mera", "meri"],
  ["mere", "mera"],
  ["achi", "achha"],
  ["khala", "khalu"],
  ["nana", "nani"],
  ["dada", "dadi"],
  ["chacha", "chachi"],
  ["mama", "mami"],
  ["beta", "beti"],
  ["ji nahin", "ji haan"],
  ["haan", "nahin"],
  ["main theek ho", "main theek hoon"],
  ["shukriya", "khuda hafiz"],
  ["hello", "assalam-o-alaikum"],
  ["", "shukriya"],
  ["   ", "shukriya"],
  ["???", "shukriya"],
  ["yahan", "wahan"],
  ["yeh", "woh"],
  ["jao", "aao"],
  ["lo", "do"],
  ["tha", "thi"],
  ["kab", "kya"],
  ["aap ka naam", "aap ka naam kya hai?"],
  ["aap ka naam kya hai aur aap kahan se hain", "aap ka naam kya hai?"],
  ["chai", "paani"],
  ["ek", "do"],
  ["khana kha li", "khana kha lo"],
  ["bhi", "bhai"],
  ["aap kaise haan", "aap kaise hain?"],
  ["main theek nahin", "main theek hoon"],
];

describe("matchAnswer variant table", () => {
  test.each(SAME)("correct: %j ≈ %j", (given, expected) => {
    expect(matchAnswer(given, expected).verdict).toBe("correct");
  });
  test.each(ALMOST)("almost: %j ~ %j", (given, expected) => {
    expect(matchAnswer(given, expected).verdict).toBe("almost");
  });
  test.each(WRONG)("incorrect: %j ≠ %j", (given, expected) => {
    expect(matchAnswer(given, expected).verdict).toBe("incorrect");
  });
  test("table is big enough", () => {
    expect(SAME.length + ALMOST.length + WRONG.length).toBeGreaterThanOrEqual(150);
  });
});

describe("accept and reject lists", () => {
  test("accept list adds alternatives", () => {
    const r = matchAnswer("allah hafiz", "khuda hafiz", { accept: ["allah hafiz"] });
    expect(r).toEqual({ verdict: "correct", canonical: "allah hafiz" });
  });
  test("code-switched answers are accepted where the exercise allows them", () => {
    expect(matchAnswer("line kharab hai", "line kharab hai").verdict).toBe("correct");
    expect(matchAnswer("homework ho gaya", "kaam ho gaya", { accept: ["homework ho gaya"] }).verdict).toBe(
      "correct",
    );
  });
  test("almost on an accepted alternative reports that alternative", () => {
    const r = matchAnswer("allah hafix", "khuda hafiz", { accept: ["allah hafiz"] });
    expect(r).toEqual({ verdict: "almost", canonical: "allah hafiz" });
  });
  test("reject list beats everything", () => {
    const r = matchAnswer("mujhe kahna hai", "mujhe khana hai", { reject: ["mujhe kahna hai"] });
    expect(r.verdict).toBe("incorrect");
    expect(r.rejected).toBe(true);
  });
  test("reject is compared after folding", () => {
    expect(matchAnswer("Tum kese ho", "aap kaise hain", { reject: ["tum kaise ho"] }).rejected).toBe(true);
  });
});

describe("helpers", () => {
  test("normalise strips punctuation, case and diacritics", () => {
    expect(normalise("  Khudā-Hāfiz!!  ")).toBe("khuda hafiz");
    expect(normalise("ma'af")).toBe("ma af");
  });
  test("foldToken uses the lexicon for short words", () => {
    expect(foldToken("h")).toBe(foldToken("hai"));
    expect(foldToken("k")).toBe(foldToken("ke"));
    expect(foldToken("o")).toBe("o");
  });
  test("editDistance handles transpositions and empties", () => {
    expect(editDistance("abc", "abc")).toBe(0);
    expect(editDistance("", "abc")).toBe(3);
    expect(editDistance("abc", "")).toBe(3);
    expect(editDistance("abcd", "abdc")).toBe(1);
    expect(editDistance("kitten", "sitting")).toBe(3);
  });
  test("tolerance scales with length", () => {
    expect([2, 3, 4, 5, 6, 8, 9, 20].map(tolerance)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });
});

describe("urdu-script and speech matching", () => {
  test("normaliseUrdu unifies Arabic and Urdu code points", () => {
    expect(normaliseUrdu("كيا حال ہے؟")).toBe(normaliseUrdu("کیا حال ہے"));
    expect(normaliseUrdu("آپ")).toBe("اپ");
  });
  test("urduSimilarity", () => {
    expect(urduSimilarity("شکریہ", "شکریہ")).toBe(1);
    expect(urduSimilarity("", "شکریہ")).toBe(0);
    expect(urduSimilarity("شکریا", "شکریہ")).toBeGreaterThan(0.7);
  });
  const phrase = { roman: "aap kaise hain?", urdu: "آپ کیسے ہیں؟", accept: ["kya haal hai"] };
  test("accepts Urdu-script transcripts", () => {
    expect(matchSpeech(["آپ کیسے ہیں"], phrase)).toBe("correct");
    expect(matchSpeech(["اپ کیسی ہے"], phrase)).toBe("almost");
    expect(matchSpeech(["شکریہ"], phrase)).toBe("incorrect");
  });
  test("accepts Roman transcripts and alternatives", () => {
    expect(matchSpeech(["something else", "ap kese hain"], phrase)).toBe("correct");
    expect(matchSpeech(["kia hal hai"], phrase)).toBe("correct");
    expect(matchSpeech(["aap kaise hian"], phrase)).toBe("almost");
    expect(matchSpeech([], phrase)).toBe("incorrect");
  });
});
