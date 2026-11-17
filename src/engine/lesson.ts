/**
 * Lesson state machine (pure, no React).
 *
 * A lesson is a queue of steps. "teach" steps just advance. "exercise" steps are answered, then
 * the player shows feedback, then advances. A wrong answer costs nothing: the step is queued again a
 * few steps later, and getting it right on the way back earns a comeback bonus. After `maxAttempts`
 * tries the step is let go, so the learner can never get stuck.
 */

export type StepKind = "teach" | "exercise";
export type Outcome = "correct" | "almost" | "wrong" | "skipped";

export interface LessonStep {
  id: string;
  kind: StepKind;
}

export interface QueuedStep extends LessonStep {
  /** 1 for the first time the step is shown, 2+ for a comeback. */
  attempt: number;
}

export interface LessonStats {
  /** Distinct exercises in the lesson. */
  exercises: number;
  firstTry: number;
  comebacks: number;
  mistakes: number;
  skipped: number;
  /** Exercises let go after the maximum number of attempts. */
  letGo: number;
}

export interface LessonState {
  queue: QueuedStep[];
  cursor: number;
  phase: "active" | "feedback" | "complete";
  lastOutcome: Outcome | null;
  stats: LessonStats;
  /** Step ids answered wrong at least once (feeds spaced review). */
  missed: string[];
  options: Required<LessonOptions>;
}

export interface LessonOptions {
  /** How many times one exercise can be shown in total. */
  maxAttempts?: number;
  /** How many steps later a missed exercise comes back. */
  requeueGap?: number;
}

/**
 * Order a lesson's steps so that long lessons alternate teaching and practice: teach a few phrases,
 * practise those, teach the next few. An exercise becomes eligible once every phrase it uses that
 * this lesson teaches has been taught (phrases from earlier lessons, or distractors, never block it).
 * Short lessons (fewer than `minCards` phrase cards) keep the classic teach-then-practise order.
 *
 * `teach[i]` is the phrase ids card i teaches ([] for an explanation card), `exercises[j]` the phrase
 * ids exercise j refers to. Returns step ids: "t<i>" and "e<j>".
 */
export function interleave(teach: readonly (readonly string[])[], exercises: readonly (readonly string[])[], chunk = 3, minCards = 5): LessonStep[] {
  const t = (i: number): LessonStep => ({ id: `t${i}`, kind: "teach" });
  const e = (j: number): LessonStep => ({ id: `e${j}`, kind: "exercise" });
  const phraseCards = teach.filter((c) => c.length > 0).length;
  if (phraseCards < minCards) return [...teach.map((_, i) => t(i)), ...exercises.map((_, j) => e(j))];
  const lessonTaught = new Set(teach.flat());
  const taught = new Set<string>();
  const done = new Set<number>();
  const out: LessonStep[] = [];
  let sinceBreak = 0;
  const flush = () => {
    exercises.forEach((refs, j) => {
      if (done.has(j)) return;
      if (refs.every((r) => !lessonTaught.has(r) || taught.has(r))) {
        done.add(j);
        out.push(e(j));
      }
    });
    sinceBreak = 0;
  };
  teach.forEach((card, i) => {
    out.push(t(i));
    for (const id of card) taught.add(id);
    if (card.length > 0 && ++sinceBreak >= chunk && phraseCards - taught.size >= 2) flush();
  });
  flush();
  return out;
}

export function createLesson(steps: readonly LessonStep[], options: LessonOptions = {}): LessonState {
  const queue = steps.map((s) => ({ ...s, attempt: 1 }));
  return {
    queue,
    cursor: 0,
    phase: queue.length === 0 ? "complete" : "active",
    lastOutcome: null,
    stats: {
      exercises: steps.filter((s) => s.kind === "exercise").length,
      firstTry: 0,
      comebacks: 0,
      mistakes: 0,
      skipped: 0,
      letGo: 0,
    },
    missed: [],
    options: { maxAttempts: options.maxAttempts ?? 3, requeueGap: options.requeueGap ?? 3 },
  };
}

export function currentStep(state: LessonState): QueuedStep | null {
  if (state.phase === "complete") return null;
  return state.queue[state.cursor] ?? null;
}

/** Record the outcome of the current exercise and move to the feedback phase. */
export function submit(state: LessonState, outcome: Outcome): LessonState {
  const step = currentStep(state);
  if (state.phase !== "active" || step === null || step.kind !== "exercise") return state;
  const stats = { ...state.stats };
  let missed = state.missed;
  if (outcome === "correct" || outcome === "almost") {
    if (step.attempt === 1) stats.firstTry += 1;
    else stats.comebacks += 1;
  } else if (outcome === "wrong") {
    stats.mistakes += 1;
    if (!missed.includes(step.id)) missed = [...missed, step.id];
  } else {
    stats.skipped += 1;
  }
  return { ...state, phase: "feedback", lastOutcome: outcome, stats, missed };
}

/** Leave a teach step or a feedback screen. A wrong answer is requeued here. */
export function advance(state: LessonState): LessonState {
  const step = currentStep(state);
  if (step === null) return state;
  if (step.kind === "exercise" && state.phase !== "feedback") return state;

  let queue = state.queue;
  const stats = { ...state.stats };
  if (step.kind === "exercise" && state.lastOutcome === "wrong") {
    if (step.attempt < state.options.maxAttempts) {
      const at = Math.min(queue.length, state.cursor + 1 + state.options.requeueGap);
      queue = [...queue.slice(0, at), { ...step, attempt: step.attempt + 1 }, ...queue.slice(at)];
    } else {
      stats.letGo += 1;
    }
  }
  const cursor = state.cursor + 1;
  return {
    ...state,
    queue,
    cursor,
    stats,
    lastOutcome: null,
    phase: cursor >= queue.length ? "complete" : "active",
  };
}

/** 0..1, counting requeued steps so the bar never goes backwards by much. */
export function progress(state: LessonState): number {
  if (state.queue.length === 0) return 1;
  return Math.min(1, state.cursor / state.queue.length);
}

export function isComeback(state: LessonState): boolean {
  const step = currentStep(state);
  return step !== null && step.attempt > 1;
}
