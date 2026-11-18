"use client";
import { weekView } from "@/engine/skills";
import { viewStreak } from "@/engine/streak";
import { useSettings } from "@/lib/settings";
import { today, useStore } from "@/lib/store";

export function useStreak() {
  const { progress } = useStore();
  return viewStreak(progress.streak, today());
}

export function StreakBadge() {
  const s = useStreak();
  const { weeklyGoal } = useSettings();
  const { progress } = useStore();
  if (weeklyGoal) {
    const w = weekView(progress.days, today(), weeklyGoal);
    return (
      <span
        aria-label={`Weekly goal: ${w.done} of ${w.goal} days this week`}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-black ${w.met ? "bg-good-soft text-good-deep" : "bg-surface-2 text-ink-soft"}`}
      >
        <span aria-hidden className="flex gap-0.5">
          {w.days.map((d) => (
            <span key={d.day} className={`size-2 rounded-full ${d.practised ? (w.met ? "bg-good" : "bg-accent") : d.today ? "border border-ink-soft" : "bg-line"}`} />
          ))}
        </span>
        {w.done}/{w.goal}
      </span>
    );
  }
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
  const { weeklyGoal } = useSettings();
  if (weeklyGoal) return null;
  if (s.status !== "resting" && s.status !== "paused") return null;
  const msg =
    s.status === "resting"
      ? `Welcome back! You were away ${s.missedDays} days, so your streak has been resting. It's still ${s.current}, and it picks up the moment you practise. Nothing was lost.`
      : `Welcome back! Your streak used ${s.missedDays} pause day${s.missedDays === 1 ? "" : "s"} and is safe at ${s.current}.`;
  return (
    <div role="status" className="animate-rise rounded-3xl border-2 border-primary/40 bg-primary-soft p-4">
      <p className="font-display text-xl font-bold">{s.status === "resting" ? "Aa gaye! You're back 🫶" : "Good to see you 🫶"}</p>
      <p className="mt-1 text-[15px] leading-relaxed">{msg}</p>
      <p className="mt-2 text-sm text-ink-soft">Khala noticed you were gone, but Khala notices everything. We don&apos;t keep score.</p>
    </div>
  );
}
