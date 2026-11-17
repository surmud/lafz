"use client";
import { useEffect, useRef, useState } from "react";
import type { Phrase } from "@/content/schema";
import { keywordRank, rank } from "@/engine/find";
import { embed, embedCached, loadEmbedder } from "@/lib/embed";
import { AudioButton, PhraseText } from "./Phrase";
import { Button, TopBar } from "./ui";

type Lite = Pick<Phrase, "id" | "roman" | "urdu" | "en" | "speaker">;
interface Index {
  dim: number;
  ids: string[];
  text: string[];
  matrix: Int8Array;
}

const EXAMPLES = ["politely refuse more food", "I'm running late", "ask someone to slow down", "say sorry to an elder", "what to say at a funeral", "compliment the cooking"];

/** Describe a situation in English; get the phrases that fit. Meaning-based when the model is loaded. */
export function FindView() {
  const [phrases, setPhrases] = useState<Map<string, Lite> | null>(null);
  const index = useRef<Index | null>(null);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ p: Lite; score: number }[] | null>(null);
  const [smart, setSmart] = useState<"off" | "loading" | "on" | "failed">("off");
  const [pct, setPct] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [lite, meta, bin] = await Promise.all([
          fetch("/lafz/phrases.json").then((r) => r.json() as Promise<Lite[]>),
          fetch("/lafz/ai/phrases.json").then((r) => r.json() as Promise<Omit<Index, "matrix">>),
          fetch("/lafz/ai/phrases.bin").then((r) => r.arrayBuffer()),
        ]);
        index.current = { ...meta, matrix: new Int8Array(bin) };
        setPhrases(new Map(lite.map((p) => [p.id, p])));
      } catch {
        setPhrases(new Map());
      }
    })();
  }, []);

  const enable = async () => {
    setSmart("loading");
    try {
      await loadEmbedder(setPct);
      setSmart("on");
    } catch {
      setSmart("failed");
    }
  };
  // If the model is already in the browser cache, switch the smart search on without asking again.
  useEffect(() => {
    if (embedCached()) queueMicrotask(() => void enable());
  }, []);

  const search = async (text: string) => {
    const idx = index.current;
    if (!idx || !phrases || !text.trim()) return;
    setBusy(true);
    let hits: { index: number; score: number }[];
    if (smart === "on") {
      try {
        hits = rank(idx.matrix, idx.dim, await embed(text));
      } catch {
        hits = keywordRank(idx.text, text);
      }
    } else hits = keywordRank(idx.text, text);
    setResults(hits.map((h) => ({ p: phrases.get(idx.ids[h.index] ?? ""), score: h.score })).filter((r): r is { p: Lite; score: number } => Boolean(r.p)));
    setBusy(false);
  };

  return (
    <>
      <TopBar back="/practice/" title="How do I say…?" />
      <main className="flex flex-col gap-4 px-4 pb-12">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void search(q);
          }}
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Describe the situation in English"
            aria-label="Describe the situation"
            className="min-h-12 min-w-0 flex-1 rounded-2xl border-2 border-line bg-surface px-4 text-lg outline-none focus:border-primary"
          />
          <Button type="submit" disabled={!phrases || busy || !q.trim()}>
            Find
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQ(ex);
                void search(ex);
              }}
              className="min-h-9 rounded-full border-2 border-line bg-surface px-3 text-sm font-bold text-ink-soft"
            >
              {ex}
            </button>
          ))}
        </div>

        {smart === "on" ? (
          <p className="text-sm text-ink-soft">🧠 Smart search is on. It runs on this device; nothing you type is sent anywhere.</p>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-line p-3 text-sm">
            <p className="text-ink-soft">
              {smart === "failed"
                ? "The smart search couldn't load (are you offline?). Keyword search still works."
                : "Right now this matches keywords. Smart search understands meaning (“I ate too much” finds “bas, bas”). It downloads a 23 MB model once and then runs on your device."}
            </p>
            <Button variant="secondary" className="mt-2" onClick={() => void enable()} disabled={smart === "loading"}>
              {smart === "loading" ? `Loading… ${pct}%` : "Turn on smart search"}
            </Button>
          </div>
        )}

        <div aria-live="polite" className="flex flex-col gap-2">
          {results === null ? null : results.length === 0 ? (
            <p className="text-ink-soft">Nothing matched. Try other words{smart === "on" ? "" : ", or turn on smart search"}.</p>
          ) : (
            results.map(({ p }) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-3">
                <AudioButton phrase={p} size="sm" />
                <div className="min-w-0 flex-1">
                  <PhraseText phrase={p} size="md" />
                  <p className="text-sm text-ink-soft">{p.en}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
