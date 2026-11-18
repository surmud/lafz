"use client";
import { tipsEnabled, config } from "@/lib/config";
import { showChaiCard } from "@/engine/tips";
import { setSettings, useSettings } from "@/lib/settings";

const TIERS = "Ek chai · Chai + samosa · Poori dawat";

/** The permanent row on the Me page. Renders nothing unless a tip link is configured (web only). */
export function ChaiRow() {
  if (!tipsEnabled()) return null;
  return (
    <a
      href={config.chaiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]"
    >
      <span className="text-3xl" aria-hidden>
        ☕
      </span>
      <span>
        <span className="block font-bold">Loving Lafz? Buy me a chai</span>
        <span className="block text-sm text-ink-soft">
          Lafz is free with no ads. A tip helps keep it that way. {TIERS}: you pick on the next page.
        </span>
      </span>
    </a>
  );
}

/** One gentle card on home after about five lessons. Dismissed once, gone for good. Never mid-lesson. */
export function ChaiCard({ lessonsDone }: { lessonsDone: number }) {
  const { chaiDismissed } = useSettings();
  if (!showChaiCard({ enabled: tipsEnabled(), lessonsDone, dismissed: chaiDismissed })) return null;
  return (
    <div role="complementary" aria-label="Support Lafz" className="relative rounded-3xl border-2 border-accent/60 bg-accent-soft/50 p-4 pr-12">
      <button
        type="button"
        onClick={() => setSettings({ chaiDismissed: true })}
        aria-label="Dismiss"
        className="absolute top-2 right-2 grid size-11 place-items-center rounded-full text-xl text-ink-soft"
      >
        ×
      </button>
      <p className="font-display text-lg font-bold">☕ Five lessons in. Shabash!</p>
      <p className="mt-1 text-[15px]">
        Lafz is free and has no ads. If it&apos;s helping, you can support it with a tip: {TIERS}.
      </p>
      <a
        href={config.chaiUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setSettings({ chaiDismissed: true })}
        className="mt-3 inline-flex min-h-11 items-center rounded-2xl bg-accent px-4 font-bold text-[#2b1a12]"
      >
        Buy me a chai
      </a>
    </div>
  );
}
