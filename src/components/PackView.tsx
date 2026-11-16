"use client";
import Link from "next/link";
import type { Pack } from "@/content/schema";
import { useStore } from "@/lib/store";
import { ProgressBar, TopBar } from "./ui";

export function PackView({ pack }: { pack: Pack }) {
  const { progress } = useStore();
  const done = pack.sessions.filter((s) => progress.lessons[`pack.${pack.id}.${s.id}`]).length;
  const nextIdx = pack.sessions.findIndex((s) => !progress.lessons[`pack.${pack.id}.${s.id}`]);
  return (
    <>
      <TopBar title="Prep pack" />
      <main className="flex flex-col gap-5 px-4 pb-16">
        <section className="rounded-[2rem] bg-accent-soft p-5">
          <p className="text-5xl" aria-hidden>
            {pack.emoji}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold">{pack.title}</h1>
          <p className="mt-1">{pack.tagline}</p>
          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={done / pack.sessions.length} label="Pack progress" tone="accent" />
            <span className="text-sm font-bold">
              {done}/{pack.sessions.length}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold">🎯 {pack.canDo}</p>
        </section>
        <ol className="flex flex-col gap-3">
          {pack.sessions.map((s, i) => {
            const isDone = Boolean(progress.lessons[`pack.${pack.id}.${s.id}`]);
            return (
              <li key={s.id}>
                <Link
                  href={`/pack/${pack.id}/${s.id}/`}
                  className={`flex items-center gap-4 rounded-3xl border-2 bg-surface p-4 shadow-[0_3px_0_var(--line)] ${i === nextIdx ? "border-accent" : isDone ? "border-good/60" : "border-line"}`}
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-black ${isDone ? "bg-good text-white" : i === nextIdx ? "bg-accent text-[#2b1a12]" : "bg-surface-2 text-ink-soft"}`} aria-hidden>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{s.title}</span>
                    <span className="block text-sm text-ink-soft">{s.blurb}</span>
                    <span className="block text-xs text-ink-soft">{s.phrases.length} phrases · about 3 minutes</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="text-center text-sm text-ink-soft">Packs reuse phrases from the course. Everything you practise here also feeds your Review.</p>
      </main>
    </>
  );
}
