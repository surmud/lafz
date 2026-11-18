"use client";
import Link from "next/link";
import { buildReviewSession, troubleItems } from "@/engine/review";
import { setSettings, useSettings } from "@/lib/settings";
import { today, useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./ui";

/** Everything that isn't the course path: review, weak spots, listening, look-up. */
export function PracticeView() {
  const { progress, ready } = useStore();
  const { hard } = useSettings();
  const review = ready ? buildReviewSession(progress.review, today()).length : 0;
  const trouble = ready ? troubleItems(progress.review, 99).length : 0;
  const items = [
    { href: "/review/", icon: "🔁", title: "Review", sub: review > 0 ? `${review} phrases ready` : "Phrases come back here when they're due" },
    { href: "/practice/trouble/", icon: "🧗", title: "Trouble words", sub: trouble > 0 ? `${trouble} phrases you've missed` : "The phrases you miss most collect here" },
    { href: "/stories/", icon: "📚", title: "Stories", sub: "Short stories to listen to or read, word by word" },
    { href: "/shadow/", icon: "🪞", title: "Shadowing", sub: "Hear it, say it straight back, compare" },
    { href: "/listen/", icon: "🎧", title: "Listening mode", sub: "Hands-free: hear it, say it, hear it again" },
    { href: "/find/", icon: "🔎", title: "How do I say…?", sub: "Describe a situation or ask a grammar question" },
    { href: "/phrasebook/", icon: "📖", title: "Phrasebook", sub: "Every phrase, with audio" },
    { href: "/grammar/", icon: "🧩", title: "Grammar guide", sub: "Every grammar note in one place" },
    { href: "/read/", icon: "📜", title: "Alphabet and reading", sub: "The reading course and letter chart" },
  ];
  return (
    <>
      <TopBar back={null} title="Practice" />
      <main className="flex flex-col gap-3 px-4 pb-28">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="flex items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-surface-2 text-3xl" aria-hidden>
              {it.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg leading-tight font-bold">{it.title}</span>
              <span className="block text-sm text-ink-soft">{it.sub}</span>
            </span>
          </Link>
        ))}
        <label className="mt-2 flex items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4">
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg leading-tight font-bold">Hard mode</span>
            <span className="block text-sm text-ink-soft">Type the answer instead of picking it, wherever that works.</span>
          </span>
          <input type="checkbox" className="size-6 accent-[var(--primary)]" checked={hard} onChange={(e) => setSettings({ hard: e.target.checked })} />
        </label>
      </main>
      <BottomNav />
    </>
  );
}
