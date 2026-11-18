"use client";
import Link from "next/link";
import { useSettings } from "@/lib/settings";
import { useStore } from "@/lib/store";
import { Pill, TopBar } from "./ui";

export function StoriesList({ stories }: { stories: { unitId: string; order: number; unitTitle: string; reading: boolean; title: string; emoji: string; blurb: string }[] }) {
  const { progress } = useStore();
  const { mode } = useSettings();
  return (
    <>
      <TopBar back="/practice/" title="Stories" />
      <main className="flex flex-col gap-3 px-4 pb-12">
        <p className="text-ink-soft">
          {mode === "read"
            ? "Read mode: each line appears in Urdu script first. Tap it to check the Roman and English."
            : "Speak mode: each line is read aloud first. Tap to see the text."}{" "}
          Switch modes on the home screen.
        </p>
        {stories.map((s) => (
          <Link key={s.unitId} href={`/story/${s.unitId}/`} className="flex items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-3xl" aria-hidden>
              {s.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-xs font-black tracking-wider text-ink-soft uppercase">
                {s.reading ? `Reading ${s.order}` : `Unit ${s.order}`} · {s.unitTitle}
                {progress.lessons[`${s.unitId}-story`] ? <Pill tone="good">✓ Read</Pill> : null}
              </span>
              <span className="block font-display text-lg font-bold">{s.title}</span>
              <span className="block text-sm text-ink-soft">{s.blurb}</span>
            </span>
          </Link>
        ))}
      </main>
    </>
  );
}
