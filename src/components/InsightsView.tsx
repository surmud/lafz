"use client";
import Link from "next/link";
import { useState } from "react";
import type { UnitMeta } from "@/engine/course";
import { troubleItems } from "@/engine/review";
import { BANDS, estimateLevel, extremes, recentDays, SKILL_LABEL, skillScores, snapshot } from "@/engine/skills";
import { today, useStore } from "@/lib/store";
import { setSharing, sharing, telemetryAvailable } from "@/lib/telemetry";
import { Card, ProgressBar, TopBar } from "./ui";

/** Where the learner stands: level estimate, skills, activity, and what is (optionally) shared. */
export function InsightsView({ units }: { units: UnitMeta[] }) {
  const { progress, ready } = useStore();
  const [share, setShare] = useState(() => sharing());
  const [showData, setShowData] = useState(false);
  if (!ready) return <TopBar back="/me/" title="Insights" />;

  const level = estimateLevel(units, progress);
  const band = BANDS[level.band];
  const scores = skillScores(progress.skills);
  const ex = extremes(scores);
  const days = recentDays(progress.days, today(), 14);
  const peak = Math.max(1, ...days.map((d) => d.answers));
  const total = scores.reduce((n, s) => n + s.seen, 0);
  const trouble = troubleItems(progress.review, 99).length;
  const snap = snapshot(units, progress);

  return (
    <>
      <TopBar back="/me/" title="Insights" />
      <main className="flex flex-col gap-5 px-4 pb-12">
        <Card className="bg-primary-soft">
          <p className="text-xs font-black tracking-widest text-ink-soft uppercase">Estimated level</p>
          <p className="font-display text-3xl font-bold">
            {band.title} <span className="text-lg text-ink-soft">({band.cefr})</span>
          </p>
          <p className="mt-1 text-[15px]">{band.blurb}</p>
          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={level.coreTotal ? level.coreCovered / level.coreTotal : 0} label="Core course covered" />
            <span className="shrink-0 text-xs font-bold text-ink-soft">
              {level.coreCovered}/{level.coreTotal} core units
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            An estimate from the units you&apos;ve finished or placed out of
            {level.advancedDone > 0 ? ` and ${level.advancedDone} advanced unit${level.advancedDone === 1 ? "" : "s"}` : ""}. Not a certificate.
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { n: level.met, l: "phrases met" },
            { n: level.solid, l: "phrases solid" },
            { n: progress.seconds > 0 && progress.seconds < 60 ? "<1" : Math.round(progress.seconds / 60), l: "minutes" },
          ].map((x) => (
            <Card key={x.l} className="px-2 py-3">
              <p className="font-display text-2xl font-bold">{x.n}</p>
              <p className="text-xs font-bold text-ink-soft">{x.l}</p>
            </Card>
          ))}
        </div>

        <section aria-labelledby="skills">
          <h2 id="skills" className="mb-2 font-display text-xl font-bold">
            Skills
          </h2>
          {total === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-line p-4 text-ink-soft">Finish a lesson and your skills show up here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {scores.map((s) => {
                const meta = SKILL_LABEL[s.skill];
                return (
                  <div key={s.skill} className="rounded-2xl border-2 border-line bg-surface p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold">
                        <span aria-hidden>{meta.icon}</span> {meta.title}
                      </p>
                      <p className="text-sm font-bold text-ink-soft">
                        {s.accuracy === null ? (s.seen === 0 ? "not practised yet" : `${s.seen} answer${s.seen === 1 ? "" : "s"} so far`) : `${Math.round(s.accuracy * 100)}% · ${s.seen} answers`}
                      </p>
                    </div>
                    <p className="mb-2 text-xs text-ink-soft">{meta.what}</p>
                    <ProgressBar value={s.accuracy ?? 0} label={`${meta.title} accuracy`} tone={s.accuracy !== null && s.accuracy >= 0.8 ? "good" : "primary"} />
                  </div>
                );
              })}
              {ex ? (
                <p className="text-[15px] text-ink-soft">
                  Strongest: <strong className="text-ink">{SKILL_LABEL[ex.best.skill].title}</strong>. Needs the most practice:{" "}
                  <strong className="text-ink">{SKILL_LABEL[ex.worst.skill].title}</strong>.
                  {ex.worst.skill === "recall" || ex.worst.skill === "listening" ? (
                    <>
                      {" "}
                      <Link className="underline" href="/practice/">
                        Hard mode and Listening mode
                      </Link>{" "}
                      train exactly that.
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section aria-labelledby="activity">
          <h2 id="activity" className="mb-2 font-display text-xl font-bold">
            Last 14 days
          </h2>
          <div className="flex h-28 items-end gap-1 rounded-2xl border-2 border-line bg-surface p-3" role="img" aria-label={`Answers per day over the last 14 days. ${days.filter((d) => d.sessions > 0).length} active days.`}>
            {days.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col justify-end" title={`${d.day}: ${d.answers} answers`}>
                <div className={`w-full rounded-t ${d.answers > 0 ? "bg-primary" : "bg-surface-2"}`} style={{ height: `${Math.max(6, (d.answers / peak) * 100)}%` }} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            {days.filter((d) => d.sessions > 0).length} active days · {days.reduce((n, d) => n + d.answers, 0)} answers
            {trouble > 0 ? (
              <>
                {" · "}
                <Link className="underline" href="/practice/trouble/">
                  {trouble} trouble words
                </Link>
              </>
            ) : null}
          </p>
        </section>

        <section aria-labelledby="share" className="flex flex-col gap-2">
          <h2 id="share" className="font-display text-xl font-bold">
            Anonymous statistics
          </h2>
          <p className="text-[15px] text-ink-soft">
            Everything above is worked out on this device.{" "}
            {telemetryAvailable()
              ? "If you switch sharing on, Lafz sends the summary below (numbers only: no names, nothing you typed, no recordings) so the course can be improved where people get stuck."
              : "This copy of Lafz has nowhere to send statistics, so nothing leaves your device."}
          </p>
          {telemetryAvailable() ? (
            <label className="flex items-center gap-4 rounded-2xl border-2 border-line bg-surface p-4">
              <span className="flex-1 font-bold">Share anonymous statistics</span>
              <input
                type="checkbox"
                className="size-6 accent-[var(--primary)]"
                checked={share}
                onChange={(e) => {
                  setSharing(e.target.checked);
                  setShare(e.target.checked);
                }}
              />
            </label>
          ) : null}
          <button type="button" className="min-h-11 self-start text-sm font-bold text-ink-soft underline" onClick={() => setShowData((v) => !v)}>
            {showData ? "Hide the summary" : "See exactly what the summary contains"}
          </button>
          {showData ? (
            <pre className="overflow-x-auto rounded-2xl bg-surface-2 p-3 text-xs leading-relaxed" data-testid="snapshot">
              {JSON.stringify(snap, null, 2)}
            </pre>
          ) : null}
        </section>
      </main>
    </>
  );
}
