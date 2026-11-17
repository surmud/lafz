"use client";
import Link from "next/link";
import { useState } from "react";
import { TopBar } from "./ui";

interface Section {
  id: string;
  label: string;
  title: string;
  notes: { title: string; body: string }[];
}

/** Every unit's grammar notes on one page, with a filter. */
export function GrammarGuide({ sections }: { sections: Section[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = sections
    .map((s) => ({ ...s, notes: needle ? s.notes.filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(needle)) : s.notes }))
    .filter((s) => s.notes.length > 0);
  return (
    <>
      <TopBar back="/practice/" title="Grammar guide" />
      <main className="flex flex-col gap-4 px-4 pb-12">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: past tense, ko, respect…"
          aria-label="Search grammar notes"
          className="min-h-12 rounded-2xl border-2 border-line bg-surface px-4 text-lg outline-none focus:border-primary"
        />
        {shown.length === 0 ? <p className="text-ink-soft">No notes match “{q}”.</p> : null}
        {shown.map((s) => (
          <section key={s.id} aria-labelledby={`g-${s.id}`}>
            <h2 id={`g-${s.id}`} className="mb-2 flex items-baseline gap-2">
              <span className="text-xs font-black tracking-wider text-ink-soft uppercase">{s.label}</span>
              <Link href={`/unit/${s.id}/`} className="font-display text-lg font-bold underline decoration-line underline-offset-4">
                {s.title}
              </Link>
            </h2>
            <div className="flex flex-col gap-2">
              {s.notes.map((n) => (
                <div key={n.title} className="rounded-2xl border-2 border-line bg-surface p-4">
                  <h3 className="font-bold">{n.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{n.body}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
