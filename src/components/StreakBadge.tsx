"use client";
import { viewStreak } from "@/engine/streak";
import { today, useStore } from "@/lib/store";

export function useStreak() {
  const { progress } = useStore();
  return viewStreak(progress.streak, today());
}

export function StreakBadge() {
  const s = useStreak();
  const icon = s.status === "resting" ? "😴" : s.status === "paused" ? "⏸️" : "🔥";
  const label =
    s.status === "resting" ? "Streak resting" : s.status === "paused" ? "Streak paused" : s.status === "done-today" ? "Done today" : "Day streak";
  return (
    <span
      aria-label={`${label}: ${s.current} days`}
      className={`inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-sm font-black ${s.status === "done-today" ? "bg-accent-soft text-accent-deep" : "bg-surface-2 text-ink-soft"}`}
    >
      <span aria-hidden>{icon}</span>
      {s.current}
    </span>
  );
}

/** Warm, guilt-free welcome back. Shown only when the learner has been away. */
export function WelcomeBack() {
  const s = useStreak();
  if (s.status !== "resting" && s.status !== "paused") return null;
  const msg =
    s.status === "resting"
      ? `You were away ${s.missedDays} days. Your streak is paused at ${s.current} and continues when you practise.`
      : `Your streak used ${s.missedDays} pause day${s.missedDays === 1 ? "" : "s"} and is still ${s.current}.`;
  return (
    <div role="status" className="animate-rise rounded-3xl border-2 border-primary/40 bg-primary-soft p-4">
      <p className="font-display text-xl font-bold">Welcome back</p>
      <p className="mt-1 text-[15px] leading-relaxed">{msg}</p>
    </div>
  );
}
