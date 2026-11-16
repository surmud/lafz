"use client";
import { useState } from "react";
import type { Phrase } from "@/content/schema";
import { playPhrase, type Speed } from "@/lib/audio";
import { setSettings, useSettings, type ScriptMode } from "@/lib/settings";

/** Urdu text with the right font, direction and language for screen readers. */
export function Nastaliq({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span lang="ur" dir="rtl" className={`urdu inline-block ${className}`}>
      {children}
    </span>
  );
}

const sizes = {
  sm: { roman: "text-base", urdu: "text-lg" },
  md: { roman: "text-lg", urdu: "text-xl" },
  lg: { roman: "text-2xl", urdu: "text-3xl" },
  xl: { roman: "text-3xl", urdu: "text-4xl" },
};

/** A phrase in Roman, Nastaliq or both, following the learner's script setting. */
export function PhraseText({
  phrase,
  size = "md",
  mode,
  align = "start",
  className = "",
}: {
  phrase: Pick<Phrase, "roman" | "urdu">;
  size?: keyof typeof sizes;
  mode?: ScriptMode;
  align?: "start" | "center";
  className?: string;
}) {
  const settings = useSettings();
  const m = mode ?? settings.script;
  const s = sizes[size];
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <span className={`flex flex-col ${alignCls} ${className}`}>
      {m !== "urdu" ? <span className={`${s.roman} font-bold leading-snug`}>{phrase.roman}</span> : null}
      {m !== "roman" ? (
        <Nastaliq className={`${m === "both" ? sizes.sm.urdu : s.urdu} ${m === "both" ? "opacity-80" : ""} pb-1.5 leading-[2.3]`}>
          {phrase.urdu}
        </Nastaliq>
      ) : null}
    </span>
  );
}

export function ScriptToggle() {
  const { script } = useSettings();
  const order: ScriptMode[] = ["roman", "both", "urdu"];
  const label = { roman: "Abc", both: "Abc + اب", urdu: "اب" };
  const next = order[(order.indexOf(script) + 1) % order.length] ?? "both";
  return (
    <button
      type="button"
      onClick={() => setSettings({ script: next })}
      className="min-h-11 rounded-full border-2 border-line bg-surface px-3 text-sm font-bold text-ink-soft"
      aria-label={`Script: ${script}. Tap for ${next}.`}
    >
      {label[script]}
    </button>
  );
}

export function AudioButton({
  phrase,
  speed = "normal",
  size = "md",
  label,
  autoPlay,
}: {
  phrase: Pick<Phrase, "id" | "urdu" | "tts" | "roman">;
  speed?: Speed;
  size?: "sm" | "md" | "lg";
  label?: string;
  autoPlay?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const play = async () => {
    setPlaying(true);
    const s = await playPhrase(phrase, speed);
    setSource(s);
    setTimeout(() => setPlaying(false), 600);
  };
  const dims = size === "lg" ? "size-20 text-4xl" : size === "sm" ? "size-11 text-lg" : "size-14 text-2xl";
  const icon = speed === "slow" ? "🐢" : speed === "aunty" ? "⚡" : "🔊";
  const tone = speed === "normal" ? "bg-primary text-primary-ink shadow-[0_4px_0_var(--primary-deep)]" : "bg-surface border-2 border-line shadow-[0_3px_0_var(--line)]";
  return (
    <button
      type="button"
      onClick={play}
      ref={(el) => {
        if (el && autoPlay && !el.dataset.played) {
          el.dataset.played = "1";
          void playPhrase(phrase, speed).then(setSource);
        }
      }}
      aria-label={label ?? `Play ${speed === "slow" ? "slowly" : speed === "aunty" ? "at aunty speed" : ""}: ${phrase.roman}`}
      data-source={source ?? undefined}
      className={`${dims} ${tone} grid shrink-0 place-items-center rounded-2xl transition active:translate-y-[3px] active:shadow-none ${playing ? "animate-pop" : ""}`}
    >
      <span aria-hidden>{icon}</span>
    </button>
  );
}
