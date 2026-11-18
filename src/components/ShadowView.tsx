"use client";
import { useEffect, useRef, useState } from "react";
import type { Phrase } from "@/content/schema";
import { playToEnd, stopAudio } from "@/lib/audio";
import { PhraseText } from "./Phrase";
import { Button, TopBar } from "./ui";

type Lite = Pick<Phrase, "id" | "roman" | "urdu" | "en" | "speaker">;
interface UnitLite {
  id: string;
  title: string;
  order: number;
  emoji: string;
}

function pickMime(): string | undefined {
  for (const m of ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"]) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) return m;
  }
  return undefined;
}

function playBlob(url: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio(url);
    a.onended = () => resolve();
    a.onerror = () => resolve();
    void a.play().catch(() => resolve());
  });
}

/**
 * Shadowing: hear a line, say it straight back while it's fresh, then hear the original and your
 * version back to back. Recordings stay in memory only and are thrown away when you move on.
 * Sentences only: rhythm and intonation are what shadowing trains.
 */
export function ShadowView({ units }: { units: UnitLite[] }) {
  const [all, setAll] = useState<Lite[] | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const [state, setState] = useState<"idle" | "listening" | "recording" | "compare">("idle");
  const [mine, setMine] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const rec = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSupported(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices));
    void fetch("/lafz/phrases.json")
      .then((r) => r.json() as Promise<Lite[]>)
      .then(setAll)
      .catch(() => setAll([]));
    return stopAudio;
  }, []);
  useEffect(() => () => {
    if (mine) URL.revokeObjectURL(mine);
  }, [mine]);

  const list = (all ?? []).filter((p) => unit !== null && p.id.startsWith(`${unit}.`) && p.roman.trim().split(/\s+/).length >= 3);
  const p = list[i];

  const listenThenRecord = async () => {
    if (!p) return;
    setMine(null);
    setState("listening");
    await playToEnd(p);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setMine(URL.createObjectURL(new Blob(chunks, { type: r.mimeType || "audio/webm" })));
        setState("compare");
      };
      rec.current = r;
      r.start();
      setState("recording");
      // Stop on its own after a little longer than the line takes to say.
      setTimeout(() => r.state === "recording" && r.stop(), 2500 + p.roman.length * 110);
    } catch {
      setSupported(false);
      setState("idle");
    }
  };

  const compare = async () => {
    if (!p || !mine) return;
    await playToEnd(p);
    await new Promise((r) => setTimeout(r, 300));
    await playBlob(mine);
  };

  const go = (n: number) => {
    stopAudio();
    setMine(null);
    setState("idle");
    setI(n);
  };

  if (unit === null) {
    return (
      <>
        <TopBar back="/practice/" title="Shadowing" />
        <main className="flex flex-col gap-3 px-4 pb-12">
          <p className="text-ink-soft">
            Hear a sentence, say it straight back, then hear the original and yours side by side. It trains rhythm and
            sound, the things that make you sound like family rather than a textbook. Your recordings are not saved.
          </p>
          {units.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                setUnit(u.id);
                setI(0);
              }}
              className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-3 text-left shadow-[0_3px_0_var(--line)]"
            >
              <span className="text-3xl" aria-hidden>
                {u.emoji}
              </span>
              <span>
                <span className="block text-xs font-black tracking-wider text-ink-soft uppercase">Unit {u.order}</span>
                <span className="font-display text-lg font-bold">{u.title}</span>
              </span>
            </button>
          ))}
        </main>
      </>
    );
  }

  const u = units.find((x) => x.id === unit);
  return (
    <>
      <TopBar back="/practice/" title={u ? `${u.emoji} Shadowing` : "Shadowing"} />
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col gap-5 px-4 pb-8">
        <p className="text-sm font-bold text-ink-soft">{list.length === 0 ? "Loading…" : `${i + 1} of ${list.length}`}</p>
        {!supported ? (
          <p className="rounded-2xl bg-bad-soft p-3 text-[15px]">
            This browser can&apos;t record audio (or the microphone is blocked). You can still listen and repeat out loud.
          </p>
        ) : null}
        <div className="grid flex-1 place-items-center rounded-[2rem] bg-surface-2 p-6 text-center">
          {p ? (
            <div className="flex flex-col items-center gap-3">
              <PhraseText phrase={p} size="xl" align="center" />
              <p className="text-ink-soft">{p.en}</p>
              <p className="mt-2 font-display text-xl font-bold" aria-live="polite">
                {state === "listening" ? "👂 Listen…" : state === "recording" ? "🎙️ Now you. Say it!" : state === "compare" ? "Compare the two" : ""}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          {state === "recording" ? (
            <Button variant="bad" block onClick={() => rec.current?.stop()}>
              ■ Done
            </Button>
          ) : (
            <Button block disabled={!p || state === "listening" || !supported} onClick={() => void listenThenRecord()}>
              {state === "compare" ? "↻ Try again" : "▶ Listen, then say it"}
            </Button>
          )}
          {state === "compare" ? (
            <Button variant="secondary" block onClick={() => void compare()}>
              🔊 Original, then mine
            </Button>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" disabled={i === 0} onClick={() => go(i - 1)}>
              ← Previous
            </Button>
            <Button variant="secondary" disabled={i >= list.length - 1} onClick={() => go(i + 1)}>
              Next →
            </Button>
          </div>
          <button
            type="button"
            className="min-h-11 text-sm font-bold text-ink-soft underline"
            onClick={() => {
              go(0);
              setUnit(null);
            }}
          >
            Choose another unit
          </button>
        </div>
      </main>
    </>
  );
}
