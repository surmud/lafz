import type { Conversation, Phrase } from "@/content/schema";

const src = [{ ref: "platts" as const, checked: "2026-11-15" }];
const p = (id: string, roman: string, urdu: string, en: string, accept?: string[]): Phrase => ({
  id,
  roman,
  urdu,
  en,
  register: "neutral",
  confidence: "high",
  sources: src,
  accept,
});

export const PHRASES: Phrase[] = [
  p("t.salam", "assalam-o-alaikum", "السلام علیکم", "Peace be upon you (hello)"),
  p("t.wsalam", "walaikum assalam", "وعلیکم السلام", "And peace upon you (reply)"),
  p("t.kaise", "aap kaise hain?", "آپ کیسے ہیں؟", "How are you? (respectful)"),
  p("t.theek", "main theek hoon", "میں ٹھیک ہوں", "I am fine"),
  p("t.shukriya", "shukriya", "شکریہ", "Thank you"),
  p("t.khuda", "khuda hafiz", "خدا حافظ", "Goodbye", ["allah hafiz"]),
  p("t.tum", "tum kaise ho?", "تم کیسے ہو؟", "How are you? (casual)"),
  p("t.tu", "tu kaisa hai?", "تو کیسا ہے؟", "How are you? (intimate)"),
  p("t.khuda2", "Khuda hafiz!", "خدا حافظ!", "Bye"),
];

export const PHRASE_MAP = new Map(PHRASES.map((x) => [x.id, x]));

export const CONVO: Conversation = {
  id: "t-boss",
  title: "Test call",
  blurb: "",
  character: "khala",
  scene: "",
  canDo: "You can test",
  start: "n1",
  nodes: {
    n1: { type: "npc", speaker: "khala", say: "t.salam", next: "n2" },
    n2: {
      type: "you",
      prompt: "Reply to the greeting",
      hint: "walaikum…",
      options: [
        { phrase: "t.wsalam", next: "n3", quality: "great" },
        { phrase: "t.khuda", next: "rude", quality: "bold", reaction: "You hung up on Khala. Bold." },
      ],
    },
    n3: { type: "narration", text: "She beams.", next: "n4" },
    n4: { type: "npc", speaker: "khala", say: "t.kaise", next: "n5" },
    n5: {
      type: "you",
      prompt: "Say you're fine",
      options: [
        { phrase: "t.theek", next: "good", quality: "fine" },
        { phrase: "t.shukriya", next: "good", quality: "fine" },
      ],
    },
    good: { type: "end", title: "Done", text: "Nice.", outcome: "good" },
    rude: { type: "end", title: "Oops", text: "She'll call back.", outcome: "rude" },
  },
};
