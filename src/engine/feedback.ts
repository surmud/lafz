import { hashString } from "./rng";

/**
 * Feedback lines. Jokes are about the family and the situation, never the learner. Wrong-answer
 * lines are always warm and always say the mistake was free.
 */
export const LINES = {
  correct: [
    "Shabash!",
    "Wah wah!",
    "Bilkul theek!",
    "Nani nodded. That's basically a standing ovation.",
    "Khala is already telling the WhatsApp group.",
    "Your mum just felt a disturbance in the Force. A good one.",
    "Kya baat hai!",
    "Zabardast!",
    "Even Bilal couldn't do better. (Don't tell him.)",
    "That's going straight in the family newsletter.",
    "Nailed it. Have a samosa.",
    "Ekdum perfect.",
  ],
  comeback: [
    "Comeback! That's how it's done.",
    "Wapsi! Back and better. +2",
    "Second time's the charm. Comeback bonus!",
    "Plot twist: you remembered. Comeback bonus!",
    "Bounced back like a rishta aunty after a 'no'. +2",
  ],
  almost: [
    "Close enough to count! Here's the usual spelling:",
    "Counted! Roman Urdu has no spelling police. Most people write:",
    "Yes! Just so you know, it's usually spelled:",
  ],
  wrong: [
    "Not quite. That one's coming back later, free of charge.",
    "Koi baat nahin! It'll come round again.",
    "Mistakes are free here. Here's the right one:",
    "Nope, but Khala has said worse at weddings. Here's the answer:",
    "Almost had it. You'll see it again in a minute.",
    "Not this time. No hearts lost, because there are no hearts.",
    "That's okay. Even Bilal got this wrong once. Once.",
  ],
  skipped: ["No problem, we'll skip that one.", "Skipped. No judgement. (Nani is judging, but that's just her face.)"],
} as const;

export type LineKind = keyof typeof LINES;

export function feedbackLine(kind: LineKind, seed: string): string {
  const pool = LINES[kind];
  return pool[hashString(seed) % pool.length] ?? pool[0];
}

/** Lesson-complete headline, picked by how the lesson went. */
export function completionLine(stats: { mistakes: number; comebacks: number; exercises: number }, seed: string): string {
  if (stats.mistakes === 0) {
    const perfect = ["Flawless. Are you sure you're not secretly fluent?", "Perfect lesson. Khala is suspicious.", "Not one mistake. Nani almost smiled."];
    return perfect[hashString(seed) % perfect.length] ?? "Flawless.";
  }
  if (stats.comebacks > 0) {
    const back = ["Mistakes made, mistakes fixed. That's how learning works.", "Every miss came back as a win. Comeback XP earned!", "You stumbled, then fixed it. That's the whole game."];
    return back[hashString(seed) % back.length] ?? "Comeback XP earned!";
  }
  return "Lesson done! The tricky ones will show up again in Review.";
}
