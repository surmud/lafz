import { addDays, daysBetween } from "./streak";

/**
 * Spaced review: a simple Leitner scheme. Items move up a box when answered right and drop back to
 * box 1 when answered wrong. Higher boxes wait longer before they are due again.
 */
export const BOX_INTERVALS = [1, 2, 4, 8, 16] as const;
export const MAX_BOX = BOX_INTERVALS.length;

export interface ReviewItem {
  box: number;
  /** Local day the item is next due. */
  due: string;
  /** Times answered wrong, ever. */
  lapses: number;
}

export type ReviewDeck = Record<string, ReviewItem>;

export function recordReview(deck: ReviewDeck, id: string, correct: boolean, today: string): ReviewDeck {
  const prev = deck[id];
  const box = correct ? Math.min(MAX_BOX, (prev?.box ?? 0) + 1) : 1;
  const interval = BOX_INTERVALS[box - 1] ?? 1;
  return {
    ...deck,
    [id]: { box, due: addDays(today, interval), lapses: (prev?.lapses ?? 0) + (correct ? 0 : 1) },
  };
}

/** Add newly learned items in box 1 without touching items already in the deck. */
export function introduce(deck: ReviewDeck, ids: readonly string[], today: string): ReviewDeck {
  const out = { ...deck };
  for (const id of ids) {
    if (out[id] === undefined) out[id] = { box: 1, due: addDays(today, 1), lapses: 0 };
  }
  return out;
}

export function dueItems(deck: ReviewDeck, today: string): string[] {
  return Object.entries(deck)
    .filter(([, item]) => daysBetween(item.due, today) >= 0)
    .sort(([aId, a], [bId, b]) => a.box - b.box || daysBetween(b.due, a.due) || aId.localeCompare(bId))
    .map(([id]) => id);
}

/**
 * Pick a review session: due items first (weakest box first), topped up with the shakiest items that
 * are not due yet so a session is never empty once anything has been learned.
 */
export function buildReviewSession(deck: ReviewDeck, today: string, size = 10): string[] {
  const due = dueItems(deck, today);
  if (due.length >= size) return due.slice(0, size);
  const rest = Object.entries(deck)
    .filter(([id]) => !due.includes(id))
    .sort(([aId, a], [bId, b]) => b.lapses - a.lapses || a.box - b.box || aId.localeCompare(bId))
    .map(([id]) => id);
  return [...due, ...rest].slice(0, size);
}
