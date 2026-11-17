/**
 * Adaptive placement (SPEC §11). A short staircase over the speaking units: a right answer jumps up
 * two units (one unit once past the core course, where each unit is its own topic), a wrong one steps
 * down one. Seven questions, unless the learner is still on a winning run: then it keeps climbing
 * into the advanced course. Placement only *suggests* a starting unit. Nothing is ever locked.
 */
export const MAX_LEVEL = 12;
export const PLACEMENT_LENGTH = 7;
/** A run that never misses keeps going, up to this many questions. */
export const PLACEMENT_MAX_LENGTH = 12;

export interface PlacementQuestionRef {
  id: string;
  /** Speaking unit this question tests (1..12). */
  level: number;
}

export interface PlacementAnswer {
  id: string;
  level: number;
  correct: boolean;
}

export interface PlacementState {
  level: number;
  answers: PlacementAnswer[];
  done: boolean;
}

export function startPlacement(startLevel = 2): PlacementState {
  return { level: startLevel, answers: [], done: false };
}

/** The unused question closest to the current level (ties go to the easier one). */
export function nextQuestion<T extends PlacementQuestionRef>(state: PlacementState, pool: readonly T[]): T | null {
  if (state.done) return null;
  const used = new Set(state.answers.map((a) => a.id));
  let best: T | null = null;
  for (const q of pool) {
    if (used.has(q.id)) continue;
    if (best === null) {
      best = q;
      continue;
    }
    const d = Math.abs(q.level - state.level);
    const bd = Math.abs(best.level - state.level);
    if (d < bd || (d === bd && q.level < best.level)) best = q;
  }
  return best;
}

export function answerPlacement(
  state: PlacementState,
  question: PlacementQuestionRef,
  correct: boolean,
  length = PLACEMENT_LENGTH,
  maxLevel = MAX_LEVEL,
): PlacementState {
  if (state.done) return state;
  const answers = [...state.answers, { id: question.id, level: question.level, correct }];
  const up = question.level >= MAX_LEVEL ? 1 : 2;
  const level = Math.max(1, Math.min(maxLevel, question.level + (correct ? up : -1)));
  // Two misses in a row at the bottom means there is nothing more to learn from asking.
  const last2 = answers.slice(-2);
  const floored = last2.length === 2 && last2.every((a) => !a.correct && a.level <= 1);
  // Past the usual length, carry on only while the learner is still climbing without a miss.
  const climbing =
    maxLevel > MAX_LEVEL && correct && last2.every((a) => a.correct) && question.level < maxLevel && answers.length < PLACEMENT_MAX_LENGTH;
  return { level, answers, done: floored || (answers.length >= length && !climbing) };
}

export interface PlacementResult {
  /** Suggested speaking unit to start at (1..maxLevel). */
  unit: number;
  correct: number;
  total: number;
}

/**
 * Suggest the unit after the highest level answered correctly, pulled back by one unit for each miss
 * at or below that level. No correct answers means start at unit 1.
 */
export function placementResult(state: PlacementState, maxLevel = MAX_LEVEL): PlacementResult {
  const correct = state.answers.filter((a) => a.correct);
  const total = state.answers.length;
  if (correct.length === 0) return { unit: 1, correct: 0, total };
  const top = Math.max(...correct.map((a) => a.level));
  const missesBelow = state.answers.filter((a) => !a.correct && a.level <= top).length;
  const unit = Math.max(1, Math.min(maxLevel, top + 1 - missesBelow));
  return { unit, correct: correct.length, total };
}
