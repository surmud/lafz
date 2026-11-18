import type { LanguagePack } from "./types";

/**
 * Urdu. Roman Urdu has no standard spelling, so the folding rules below make "shukriya", "shukria"
 * and "shukrya" one word (see src/engine/matcher.ts for how they are used).
 */
const LEXICON: readonly (readonly string[])[] = [
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

/** Phonetic folding without the lexicon. */
function fold(token: string): string {
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


/** Normalise Urdu-script text for loose comparison: drop harakat, unify Arabic/Urdu letter forms. */
function normalise(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[\u064B-\u0670\u065F\u06D6-\u06ED]/g, "") // harakat and Quranic marks
    .replace(/[\u064A\u0649]/g, "\u06CC")
    .replace(/\u0643/g, "\u06A9")
    .replace(/[\u0647\u06BE\u0629]/g, "\u06C1")
    .replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627")
    .replace(/\u0624/g, "\u0648")
    .replace(/\u0626/g, "\u06CC")
    .replace(/[^\u0600-\u06FF\s]/g, " ")
    .replace(/[\u060C\u06D4\u061F\u061B]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const ur: LanguagePack = {
  code: "ur",
  name: "Urdu",
  nativeName: "اردو",
  script: {
    name: "Nastaliq",
    dir: "rtl",
    lang: "ur",
    fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif',
    chars: /[\u0600-\u06FF]/,
    normalise,
  },
  romanization: { name: "Roman Urdu", fold, lexicon: LEXICON, confusables: CONFUSABLES, finalVowelIsGrammar: true },
  speech: { recognition: "ur-PK", whisper: "ur" },
  voices: { female: "matcha-f1", male: "matcha-m1", maleSpeakers: ["bilal", "abbu", "pervez", "bashir"] },
};
