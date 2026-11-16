"use client";
import { useState } from "react";
import type { ResolvedSpeak } from "@/engine/exercises";
import { matchSpeech } from "@/engine/matcher";
import { listen, speechSupported, type Listening } from "@/lib/speech";
import { canRecord, loadWhisper, record, transcribeUrdu, whisperCached } from "@/lib/whisper";
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
        <WhisperFallback phrase={ex.phrase} locked={locked} onSubmit={onSubmit} />
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

/** Browsers without the Web Speech API: opt-in on-device Whisper (G9). */
function WhisperFallback({ phrase, locked, onSubmit }: { phrase: ResolvedSpeak["phrase"]; locked: boolean; onSubmit: ExerciseProps<ResolvedSpeak>["onSubmit"] }) {
  const [state, setState] = useState<"off" | "loading" | "ready" | "recording" | "thinking" | "heard" | "error">(() =>
    typeof window !== "undefined" && whisperCached() ? "ready" : "off",
  );
  const [pct, setPct] = useState(0);
  const [heard, setHeard] = useState("");
  const [stopper, setStopper] = useState<(() => void) | null>(null);

  if (!canRecord()) {
    return (
      <p className="rounded-2xl bg-accent-soft p-4 text-sm">
        This browser can&apos;t listen. Say it out loud anyway (seriously, it helps), then tap “I said it”, or ask family to listen.
      </p>
    );
  }
  if (state === "off" || state === "loading") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-accent-soft p-4 text-sm">
        <p>This browser has no built-in Urdu speech recognition. Lafz can run a speech model on your phone instead: about 80 MB, downloaded once, and your voice never leaves the device.</p>
        <button
          type="button"
          disabled={state === "loading" || locked}
          onClick={async () => {
            setState("loading");
            try {
              await loadWhisper(setPct);
              setState("ready");
            } catch {
              setState("error");
            }
          }}
          className="min-h-11 rounded-full bg-primary px-4 font-bold text-primary-ink disabled:opacity-60"
        >
          {state === "loading" ? `Downloading… ${pct}%` : "Turn on on-device listening"}
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={locked || state === "thinking"}
        aria-label={state === "recording" ? "Stop recording" : "Start speaking"}
        onClick={async () => {
          if (state === "recording") return stopper?.();
          setState("recording");
          const r = record();
          setStopper(() => r.stop);
          try {
            const audio = await r.result;
            setState("thinking");
            const text = await transcribeUrdu(audio);
            setHeard(text);
            setState("heard");
            const v = matchSpeech([text], { roman: phrase.roman, urdu: phrase.urdu, accept: phrase.accept });
            if (v !== "incorrect") onSubmit({ verdict: v, answer: { roman: phrase.roman, urdu: phrase.urdu, en: phrase.en } });
          } catch {
            setState("error");
          }
        }}
        className={`grid size-24 place-items-center rounded-full bg-rose text-4xl text-white shadow-[0_5px_0_var(--rose-deep)] ${state === "recording" ? "animate-pulse" : ""}`}
      >
        {state === "recording" ? "■" : "🎙️"}
      </button>
      <p className="text-center text-sm text-ink-soft" aria-live="polite">
        {state === "ready" && "On-device listening is on. Tap, say it, tap again."}
        {state === "recording" && "Listening… tap to stop."}
        {state === "thinking" && "Thinking…"}
        {state === "heard" && (heard ? `Heard: “${heard}”. Not quite. Try again, or skip.` : "Didn't catch anything. Try again?")}
        {state === "error" && "The microphone or the model isn't available. No problem, skip this one."}
      </p>
    </div>
  );
}
