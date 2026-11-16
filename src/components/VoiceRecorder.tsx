"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Phrase } from "@/content/schema";
import type { UnitMeta } from "@/engine/course";
import { playPhrase, stopAudio } from "@/lib/audio";
import { deleteRecording, listRecordingIds, saveRecording } from "@/storage/db";
import { Nastaliq } from "./Phrase";
import { TopBar } from "./ui";

/**
 * Family voice (SPEC §10): hand the phone to a parent, they record phrases, and their recordings
 * replace the TTS for this learner everywhere. Stored only on this device (IndexedDB); moves with the
 * backup file.
 */
const NAME_KEY = "lafz.voice.by";

export function VoiceIndex({ units }: { units: UnitMeta[] }) {
  const [count, setCount] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    void listRecordingIds().then((ids) => {
      const c: Record<string, number> = {};
      for (const id of ids) {
        const u = id.split(".")[0] ?? "";
        c[u] = (c[u] ?? 0) + 1;
      }
      setCount(c);
    });
  }, []);
  return (
    <>
      <TopBar back="/family/" title="Family voice" />
      <main className="flex flex-col gap-4 px-4 pb-16">
        <div className="rounded-[2rem] bg-good-soft p-5">
          <p className="text-4xl" aria-hidden>
            🎙️
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold">Hear Ammi, not a robot</h1>
          <p className="mt-1">
            Hand your phone to a parent or grandparent. They record phrases in their own voice, and from then on the course plays{" "}
            <em>their</em> recording instead of the computer voice. Recordings never leave this phone.
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {units.map((u) => (
            <li key={u.id}>
              <Link href={`/voice/${u.id}/`} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-3 shadow-[0_3px_0_var(--line)]">
                <span className="text-2xl" aria-hidden>
                  {u.emoji}
                </span>
                <span className="flex-1 font-bold">
                  {u.order}. {u.title}
                </span>
                <span className="text-sm text-ink-soft">{count ? `${count[u.id] ?? 0} recorded` : ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

function pickMime(): string {
  for (const m of ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg"]) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) return m;
  }
  return "";
}

export function VoiceRecorder({ title, phrases }: { title: string; phrases: Phrase[] }) {
  const [recorded, setRecorded] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const [by, setBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const supported = typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices;

  useEffect(() => {
    void listRecordingIds().then((ids) => setRecorded(new Set(ids)));
    try {
      queueMicrotask(() => setBy(localStorage.getItem(NAME_KEY) ?? "Ammi"));
    } catch {
      /* ignore */
    }
    return stopAudio;
  }, []);

  const start = async (p: Phrase) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: r.mimeType || "audio/webm" });
        if (blob.size < 1200) {
          setError("That was too short. Hold on a moment longer, then tap stop.");
        } else {
          await saveRecording({ phraseId: p.id, blob, mime: blob.type, at: new Date().toISOString(), by: by.trim() || "Family" });
          setRecorded((s) => new Set(s).add(p.id));
        }
        setActive(null);
      };
      rec.current = r;
      r.start();
      setActive(p.id);
      // Safety stop: phrases are short.
      setTimeout(() => r.state === "recording" && r.stop(), 12000);
    } catch {
      setError("The microphone isn't available. Check the browser's permission for this site.");
      setActive(null);
    }
  };

  const stop = () => rec.current?.state === "recording" && rec.current.stop();

  return (
    <>
      <TopBar back="/voice/" title={`Record: ${title}`} />
      <main className="flex flex-col gap-4 px-4 pb-16">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Who&apos;s recording?</span>
          <input
            value={by}
            onChange={(e) => {
              setBy(e.target.value);
              try {
                localStorage.setItem(NAME_KEY, e.target.value);
              } catch {
                /* ignore */
              }
            }}
            className="min-h-12 rounded-2xl border-2 border-line bg-surface px-4 text-lg outline-none focus:border-primary"
          />
        </label>
        {!supported ? <p className="rounded-2xl bg-accent-soft p-4">This browser can&apos;t record audio. Try Chrome or Safari.</p> : null}
        {error ? (
          <p role="alert" className="rounded-2xl bg-bad-soft p-3 text-sm">
            {error}
          </p>
        ) : null}
        <p className="text-sm text-ink-soft">
          {recorded.size > 0 ? `${phrases.filter((p) => recorded.has(p.id)).length} of ${phrases.length} recorded in this unit. ` : ""}
          Tap 🎙️, say the phrase naturally, tap ■.
        </p>
        <ul className="flex flex-col gap-2">
          {phrases.map((p) => {
            const has = recorded.has(p.id);
            const isActive = active === p.id;
            return (
              <li key={p.id} className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${has ? "border-good/60 bg-good-soft/40" : "border-line bg-surface"}`}>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{p.roman}</p>
                  <Nastaliq className="text-lg">{p.urdu}</Nastaliq>
                  <p className="text-xs text-ink-soft">{p.en}</p>
                </div>
                {has && !isActive ? (
                  <>
                    <button type="button" onClick={() => void playPhrase(p)} aria-label={`Play the family recording of ${p.roman}`} className="grid size-11 place-items-center rounded-xl bg-good text-white">
                      ▶
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteRecording(p.id);
                        setRecorded((s) => {
                          const n = new Set(s);
                          n.delete(p.id);
                          return n;
                        });
                      }}
                      aria-label={`Delete the recording of ${p.roman}`}
                      className="grid size-11 place-items-center rounded-xl border-2 border-line text-ink-soft"
                    >
                      🗑
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  disabled={!supported || (active !== null && !isActive)}
                  onClick={() => (isActive ? stop() : void start(p))}
                  aria-label={isActive ? "Stop recording" : `Record ${p.roman}`}
                  className={`grid size-12 place-items-center rounded-full text-xl text-white disabled:opacity-40 ${isActive ? "animate-pulse bg-bad" : "bg-rose"}`}
                >
                  {isActive ? "■" : "🎙️"}
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
