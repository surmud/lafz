import type { Verdict } from "@/engine/exercises";

export interface ExerciseResult {
  verdict: Verdict;
  /** Extra explanation shown in the feedback sheet. */
  feedback?: string;
  /** The right answer, in both scripts, shown after a miss or an "almost". */
  answer?: { roman: string; urdu?: string; en?: string };
  /** A memory hook for the phrase, shown after a miss. */
  hook?: string;
}

export interface ExerciseProps<T> {
  ex: T;
  /** True once the answer has been checked; inputs lock. */
  locked: boolean;
  /** Report the current answer (null = nothing chosen yet). The player's Check button submits it. */
  onChange: (r: ExerciseResult | null) => void;
  /** Submit immediately (match pairs and speech finish on their own). */
  onSubmit: (r: ExerciseResult) => void;
}
