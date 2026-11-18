"use client";
import { BASE } from "@/lib/base";
import { useEffect, useRef, useState } from "react";
import type { Phrase } from "@/content/schema";
import { playToEnd, stopAudio } from "@/lib/audio";
import { PhraseText } from "./Phrase";
import { Button, TopBar } from "./ui";

type Lite = Pick<Phrase, "id" | "roman" | "urdu" | "en">;
interface UnitLite {
  id: string;
  title: string;
  order: number;
  emoji: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Say the English with the device voice, so the loop works with the screen off. */
function sayEnglish(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof speechSynthesis === "undefined") return resolve();
    const u = new SpeechSynthesisUtterance(text.replace(/\s*\(.*?\)/g, ""));
    u.lang = "en";
    u.rate = 1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
    setTimeout(resolve, 8000);
  });
}

/**
 * Hands-free practice: English prompt, a pause to say it yourself, then the Urdu twice.
 * No tapping, no scoring. For walks, dishes and commutes.
 */
export function ListenMode({ units }: { units: UnitLite[] }) {
  const [all, setAll] = useState<Lite[] | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<"idle" | "english" | "think" | "urdu">("idle");
  const [playing, setPlaying] = useState(false);
  const [english, setEnglish] = useState(true);
  const run = useRef(0);

  useEffect(() => {
    void fetch(`${BASE}/phrases.json`)
      .then((r) => r.json() as Promise<Lite[]>)
      .then(setAll)
      .catch(() => setAll([]));
    const r = run;
    return () => {
      r.current++;
      stopAudio();
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    };
  }, []);

  const list = (all ?? []).filter((p) => unit !== null && p.id.startsWith(`${unit}.`) && !p.id.includes(".b."));
  const current = list[index];

  const stop = () => {
    run.current++;
    stopAudio();
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    setPlaying(false);
    setStage("idle");
  };

  const start = async (from: number) => {
    const me = ++run.current;
    setPlaying(true);
    for (let i = from; i < list.length; i++) {
      const p = list[i];
      if (!p || run.current !== me) return;
      setIndex(i);
      if (english) {
        setStage("english");
        await sayEnglish(p.en);
        if (run.current !== me) return;
      }
      setStage("think");
      await wait(1200 + p.roman.length * 90);
      if (run.current !== me) return;
      setStage("urdu");
      await playToEnd(p);
      await wait(500);
      if (run.current !== me) return;
      await playToEnd(p, "slow");
      await wait(900);
    }
    if (run.current === me) {
      setPlaying(false);
      setStage("idle");
    }
  };

  if (unit === null) {
    return (
      <>
        <TopBar back="/practice/" title="Listening mode" />
        <main className="flex flex-col gap-3 px-4 pb-12">
          <p className="text-ink-soft">
            Pick a unit. You&apos;ll hear the English, get a moment to say it yourself, then hear the Urdu twice. Nothing to tap.
          </p>
          {units.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                setUnit(u.id);
                setIndex(0);
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
      <TopBar back="/practice/" title={u ? `${u.emoji} ${u.title}` : "Listening mode"} />
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col gap-5 px-4 pb-8">
        <p className="text-sm font-bold text-ink-soft" aria-live="polite">
          {list.length === 0 ? "Loading…" : `${index + 1} of ${list.length}`}
        </p>
        <div className="grid flex-1 place-items-center rounded-[2rem] bg-surface-2 p-6 text-center">
          {current ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-xl text-ink-soft">{current.en}</p>
              {stage === "urdu" || stage === "idle" ? (
                <PhraseText phrase={current} size="xl" align="center" />
              ) : (
                <p className="font-display text-2xl font-bold">{stage === "think" ? "Your turn. Say it." : "…"}</p>
              )}
            </div>
          ) : null}
        </div>
        <label className="flex items-center gap-3 text-sm font-bold">
          <input type="checkbox" className="size-5 accent-[var(--primary)]" checked={english} disabled={playing} onChange={(e) => setEnglish(e.target.checked)} />
          Say the English first
        </label>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="secondary" disabled={index === 0} onClick={() => (playing ? void start(index - 1) : setIndex(index - 1))} aria-label="Previous phrase">
            ⏮
          </Button>
          <Button onClick={() => (playing ? stop() : void start(index))}>{playing ? "⏸ Pause" : "▶ Play"}</Button>
          <Button variant="secondary" disabled={index >= list.length - 1} onClick={() => (playing ? void start(index + 1) : setIndex(index + 1))} aria-label="Next phrase">
            ⏭
          </Button>
        </div>
        <button type="button" className="min-h-11 text-sm font-bold text-ink-soft underline" onClick={() => { stop(); setUnit(null); }}>
          Choose another unit
        </button>
      </main>
    </>
  );
}
