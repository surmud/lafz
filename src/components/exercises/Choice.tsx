"use client";
import { useState } from "react";
import { checkChoice, type ResolvedChoice } from "@/engine/exercises";
import { AudioButton, Nastaliq, PhraseText } from "../Phrase";
import type { ExerciseProps } from "./types";
import { mark } from "@/lib/e2e";

export function ChoiceExercise({ ex, locked, onChange }: ExerciseProps<ResolvedChoice>) {
  const [picked, setPicked] = useState<string | null>(null);
  const answer = ex.options.find((o) => o.key === ex.answerKey);

  const choose = (key: string) => {
    if (locked) return;
    setPicked(key);
    const opt = ex.options.find((o) => o.key === key);
    const verdict = checkChoice(ex, key);
    onChange({
      verdict,
      feedback: opt?.feedback ?? (verdict === "wrong" ? ex.explain : undefined) ?? (verdict === "correct" ? ex.explain : undefined),
      answer: answer
        ? answer.phrase
          ? { roman: answer.phrase.roman, urdu: answer.phrase.urdu, en: answer.phrase.en }
          : { roman: answer.text ?? answer.glyph ?? "" }
        : undefined,
    });
  };

  const heading =
    ex.flavour === "listen" ? (ex.speed === "aunty" ? "Aunty speed! What did she say?" : "What did you hear?") : ex.prompt;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl leading-tight font-bold">{heading}</h2>
      {ex.flavour === "listen" && ex.audio ? (
        <div className="flex items-center justify-center gap-4 py-2">
          <AudioButton phrase={ex.audio} speed={ex.speed} size="lg" autoPlay />
          <AudioButton phrase={ex.audio} speed="slow" size="md" />
        </div>
      ) : null}
      {ex.show ? (
        <div className="flex items-center gap-3 rounded-3xl bg-surface-2 p-4">
          {ex.audio ? <AudioButton phrase={ex.audio} autoPlay={ex.flavour === "meaning"} /> : null}
          <PhraseText phrase={ex.show} size="lg" mode={ex.urduOnly ? "urdu" : undefined} />
        </div>
      ) : ex.audio && ex.flavour === "mc" ? (
        <div className="flex justify-center">
          <AudioButton phrase={ex.audio} size="lg" />
        </div>
      ) : null}
      {ex.glyph ? (
        <div className="grid place-items-center rounded-3xl bg-surface-2 py-6">
          <Nastaliq className="text-7xl">{ex.glyph}</Nastaliq>
        </div>
      ) : null}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Answers">
        {ex.options.map((o) => {
          const isPicked = picked === o.key;
          const isAnswer = o.key === ex.answerKey;
          let tone = "border-line bg-surface shadow-[0_3px_0_var(--line)]";
          if (isPicked && !locked) tone = "border-primary bg-primary-soft shadow-[0_3px_0_var(--primary)]";
          if (locked && isAnswer) tone = "border-good bg-good-soft shadow-[0_3px_0_var(--good)]";
          if (locked && isPicked && !isAnswer) tone = "border-bad bg-bad-soft shadow-[0_3px_0_var(--bad)] animate-shake";
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={locked}
              {...mark(isAnswer)}
              onClick={() => choose(o.key)}
              className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition active:translate-y-[2px] ${tone}`}
            >
              {o.phrase ? (
                <PhraseText phrase={o.phrase} size="md" />
              ) : o.glyph ? (
                <Nastaliq className="text-4xl">{o.glyph}</Nastaliq>
              ) : (
                <span className="text-lg font-semibold">{o.text}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
