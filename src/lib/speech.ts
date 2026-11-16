"use client";
/**
 * Speech recognition (SPEC §9). Primary: the Web Speech API with lang ur-PK. Where it is missing
 * (Firefox, iOS Safari without Siri dictation) the exercise is skipped gracefully. Speaking is
 * never required to finish a lesson. A Whisper fallback is a future backlog item.
 */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type Ctor = new () => SpeechRecognitionLike;

function ctor(): Ctor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechSupported(): boolean {
  return ctor() !== null;
}

export interface Listening {
  stop: () => void;
  result: Promise<string[]>;
}

/** Listen once. Resolves with all transcripts (Urdu and, as a second pass, Roman via en-IN). */
export function listen(lang = "ur-PK"): Listening {
  const C = ctor();
  if (!C) return { stop: () => undefined, result: Promise.reject(new Error("unsupported")) };
  const rec = new C();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = false;
  const result = new Promise<string[]>((resolve, reject) => {
    let got: string[] = [];
    rec.onresult = (e) => {
      got = [];
      for (let i = 0; i < e.results.length; i++) {
        const alts = e.results[i];
        if (!alts) continue;
        for (let j = 0; j < alts.length; j++) {
          const t = alts[j]?.transcript;
          if (t) got.push(t);
        }
      }
    };
    rec.onerror = (e) => reject(new Error(e.error));
    rec.onend = () => resolve(got);
  });
  rec.start();
  return { stop: () => rec.stop(), result };
}
