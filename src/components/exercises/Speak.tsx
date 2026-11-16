"use client";
import { useState } from "react";
import type { ResolvedSpeak } from "@/engine/exercises";
import { matchSpeech } from "@/engine/matcher";
import { listen, speechSupported, type Listening } from "@/lib/speech";
import { AudioButton, PhraseText } from "../Phrase";
import { AskAmmiButton } from "../AskAmmi";
import type { ExerciseProps } from "./types";

export function SpeakExercise({ ex, locked, onSubmit }: ExerciseProps<ResolvedSpeak>) {
  const [state, setState] = useState<"idle" | "listening" | "heard" | "error">("idle");
  const [heard, setHeard] = useState<string>("");
  const [session, setSession] = useState<Listening | null>(null);
  const supported = typeof window !== "undefined" && speechSupported();

  const start = async () => {
    if (state === "listening") {
      session?.stop();
      return;
    }
    const s = listen();
    setSession(s);
    setState("listening");
    try {
      const transcripts = await s.result;
      setHeard(transcripts[0] ?? "");
      setState("heard");
      const v = matchSpeech(transcripts, { roman: ex.phrase.roman, urdu: ex.phrase.urdu, accept: ex.phrase.accept });
      if (v !== "incorrect") {
        onSubmit({ verdict: v, answer: { roman: ex.phrase.roman, urdu: ex.phrase.urdu, en: ex.phrase.en } });
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-bold">Say it out loud</h2>
      <div className="flex items-center gap-3 rounded-3xl bg-surface-2 p-4">
        <AudioButton phrase={ex.phrase} />
        <div className="min-w-0">
          <PhraseText phrase={ex.phrase} size="lg" />
          <p className="text-sm text-ink-soft">{ex.phrase.en}</p>
        </div>
      </div>
      {supported ? (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={locked}
            onClick={start}
            aria-label={state === "listening" ? "Stop listening" : "Start speaking"}
            className={`grid size-24 place-items-center rounded-full text-4xl text-white shadow-[0_5px_0_var(--rose-deep)] transition active:translate-y-1 active:shadow-none ${state === "listening" ? "animate-pulse bg-rose" : "bg-rose"}`}
          >
            🎙️
          </button>
          <p className="text-center text-sm text-ink-soft" aria-live="polite">
            {state === "idle" && "Tap, then say it. Speech recognition for Urdu is rough, so we're generous."}
            {state === "listening" && "Listening…"}
            {state === "heard" && (heard ? `Heard: “${heard}”. Not quite. Try again, or skip.` : "Didn't catch anything. Try again?")}
            {state === "error" && "The microphone isn't available. No problem, skip this one."}
          </p>
        </div>
      ) : (
        <p className="rounded-2xl bg-accent-soft p-4 text-sm">
          This browser can&apos;t do Urdu speech recognition. Say it out loud anyway (seriously, it helps), then skip, or ask
          family to listen.
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          disabled={locked}
          onClick={() => onSubmit({ verdict: "correct", feedback: "Honour system. We trust you. Nani doesn't, but we do." })}
          className="min-h-11 rounded-full border-2 border-line px-4 text-sm font-bold text-ink-soft"
        >
          I said it ✓
        </button>
        <AskAmmiButton phrase={ex.phrase} compact />
      </div>
    </div>
  );
}
