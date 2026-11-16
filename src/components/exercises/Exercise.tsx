"use client";
import type { Resolved } from "@/engine/exercises";
import { BuildExercise } from "./Build";
import { ChoiceExercise } from "./Choice";
import { GapExercise } from "./Gap";
import { MatchExercise } from "./Match";
import { RespectExercise } from "./Respect";
import { SpeakExercise } from "./Speak";
import { TraceExercise } from "./Trace";
import { TypeExercise } from "./TypeAnswer";
import type { ExerciseProps } from "./types";

export function ExerciseView(props: ExerciseProps<Resolved>) {
  const { ex } = props;
  switch (ex.type) {
    case "choice":
      return <ChoiceExercise {...props} ex={ex} />;
    case "match":
      return <MatchExercise {...props} ex={ex} />;
    case "type":
      return <TypeExercise {...props} ex={ex} />;
    case "build":
      return <BuildExercise {...props} ex={ex} />;
    case "respect":
      return <RespectExercise {...props} ex={ex} />;
    case "gap":
      return <GapExercise {...props} ex={ex} />;
    case "speak":
      return <SpeakExercise {...props} ex={ex} />;
    case "trace":
      return <TraceExercise {...props} ex={ex} />;
  }
}

/** Exercises that submit themselves; the player hides Check for these. */
export function selfSubmitting(ex: Resolved): boolean {
  return ex.type === "match" || ex.type === "speak" || ex.type === "trace";
}
