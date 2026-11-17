"use client";
import { useEffect, useMemo, useState } from "react";
import type { Phrase } from "@/content/schema";
import { foldTokens } from "@/engine/matcher";
import { useStore } from "@/lib/store";
import { AudioButton, PhraseText } from "./Phrase";
import { TopBar } from "./ui";

type Lite = Pick<Phrase, "id" | "roman" | "urdu" | "en">;

/** Every phrase in the course, searchable by Roman (forgiving spelling), Urdu script or English. */
export function Phrasebook() {
  const { progress } = useStore();
  const [all, setAll] = useState<Lite[] | null>(null);
  const [q, setQ] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  useEffect(() => {
    void fetch("/lafz/phrases.json")
      .then((r) => r.json() as Promise<Lite[]>)
      .then(setAll)
      .catch(() => setAll([]));
  }, []);

  const results = useMemo(() => {
    if (!all) return [];
    const learned = new Set(Object.keys(progress.review));
    const base = onlyMine ? all.filter((p) => learned.has(p.id)) : all;
    const query = q.trim();
    if (!query) return base.slice(0, 60);
    const urduQ = /[؀-ۿ]/.test(query);
    const folded = foldTokens(query).join(" ");
    const en = query.toLowerCase();
    return base
      .filter((p) => (urduQ ? p.urdu.includes(query) : foldTokens(p.roman).join(" ").includes(folded) || p.en.toLowerCase().includes(en)))
      .slice(0, 60);
  }, [all, q, onlyMine, progress.review]);

  return (
    <>
      <TopBar back="/me/" title="Phrasebook" />
      <main className="flex flex-col gap-3 px-4 pb-16">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Search in Roman, Urdu or English</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="e.g. shukria, چائے, goodbye"
            className="min-h-12 rounded-2xl border-2 border-line bg-surface px-4 text-lg outline-none focus:border-primary"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} className="size-5" />
          Only phrases I&apos;ve learned
        </label>
        {all === null ? (
          <p className="text-ink-soft" aria-busy="true">
            Loading…
          </p>
        ) : results.length === 0 ? (
          <p className="rounded-2xl bg-surface-2 p-4 text-ink-soft">Nothing found. Try a different spelling, Urdu script, or the English.</p>
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Phrases">
            {results.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-3">
                <AudioButton phrase={p} size="sm" />
                <div className="min-w-0">
                  <PhraseText phrase={p} size="sm" />
                  <p className="text-sm text-ink-soft">{p.en}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {all && !q && !onlyMine ? <p className="text-center text-xs text-ink-soft">Showing 60 of {all.length}. Search to find the rest.</p> : null}
      </main>
    </>
  );
}
