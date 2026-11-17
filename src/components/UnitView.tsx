"use client";
import Link from "next/link";
import type { Character } from "@/content/schema";
import { unitProgress, type UnitMeta } from "@/engine/course";
import { useEffect, useState } from "react";
import { downloadUnit, isUnitDownloaded, offlineSupported } from "@/lib/offline";
import { useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { Nastaliq } from "./Phrase";
import { Pill, ProgressBar, TopBar } from "./ui";

export function UnitView({
  meta,
  grammar,
  character,
}: {
  meta: UnitMeta;
  grammar: { title: string; body: string }[];
  character?: Character;
}) {
  const { progress } = useStore();
  const up = unitProgress(meta, progress);
  const total = up.lessonsTotal + (meta.boss ? 1 : 0);
  const done = up.lessonsDone + (meta.boss && up.bossDone ? 1 : 0);
  const firstOpen = meta.lessons.findIndex((l) => !progress.lessons[l.id]);
  return (
    <>
      <TopBar back={meta.track === "reading" ? "/read/" : "/"} title={meta.track === "reading" ? `Reading R${meta.order}` : `Unit ${meta.order}`} />
      <main className="flex flex-col gap-5 px-4 pb-16">
        <section className="rounded-[2rem] bg-surface-2 p-5">
          <p className="text-5xl" aria-hidden>
            {meta.emoji}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold">{meta.title}</h1>
          {meta.titleUrdu ? <Nastaliq className="text-2xl text-ink-soft">{meta.titleUrdu}</Nastaliq> : null}
          <p className="mt-1 text-ink-soft">{meta.tagline}</p>
          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={total ? done / total : 0} label="Unit progress" tone={up.status === "done" ? "good" : "primary"} />
            <span className="text-sm font-bold text-ink-soft">
              {done}/{total}
            </span>
          </div>
          {up.status === "skipped" ? (
            <p className="mt-3 text-sm">
              <Pill tone="accent">Skipped by placement</Pill> Review anytime. Everything here is open.
            </p>
          ) : null}
        </section>

        <ol className="flex flex-col gap-3" aria-label="Lessons">
          {meta.lessons.map((l, i) => {
            const isDone = Boolean(progress.lessons[l.id]);
            const isNext = i === firstOpen;
            return (
              <li key={l.id}>
                <Link
                  href={`/lesson/${l.id}/`}
                  className={`flex items-center gap-4 rounded-3xl border-2 bg-surface p-4 shadow-[0_3px_0_var(--line)] ${isNext ? "border-primary" : isDone ? "border-good/60" : "border-line"}`}
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-black ${isDone ? "bg-good text-good-ink" : isNext ? "bg-primary text-primary-ink" : "bg-surface-2 text-ink-soft"}`}
                    aria-hidden
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{l.title}</span>
                    <span className="block text-sm text-ink-soft">{l.blurb}</span>
                    {isDone ? <span className="mt-1 block text-xs font-bold text-good-deep">✓ {l.canDo}</span> : null}
                  </span>
                  {isNext ? <Pill tone="primary">Next</Pill> : null}
                </Link>
              </li>
            );
          })}
          {meta.boss ? (
            <li>
              <Link
                href={`/boss/${meta.id}/`}
                className={`flex items-center gap-4 rounded-3xl border-2 p-4 shadow-[0_3px_0_var(--rose-deep)] ${up.bossDone ? "border-good bg-good-soft" : "border-rose bg-rose-soft"}`}
              >
                {character ? <Avatar character={character} /> : null}
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-black tracking-widest text-rose-deep uppercase">Boss conversation</span>
                  <span className="block font-display text-xl font-bold">{meta.boss.title}</span>
                  <span className="block text-sm">{meta.boss.blurb}</span>
                </span>
              </Link>
            </li>
          ) : null}
        </ol>

        <OfflineButton unitId={meta.id} />

        {grammar.length > 0 ? (
          <section aria-labelledby="grammar" className="flex flex-col gap-3">
            <h2 id="grammar" className="font-display text-xl font-bold">
              How it works
            </h2>
            {grammar.map((g) => (
              <details key={g.title} className="rounded-2xl border-2 border-line bg-surface p-4">
                <summary className="cursor-pointer font-bold">{g.title}</summary>
                <p className="mt-2 leading-relaxed text-ink-soft">{g.body}</p>
              </details>
            ))}
          </section>
        ) : null}
      </main>
    </>
  );
}

function OfflineButton({ unitId }: { unitId: string }) {
  const [state, setState] = useState<"unknown" | "idle" | "busy" | "done" | "unsupported">("unknown");
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let alive = true;
    if (!offlineSupported()) {
      queueMicrotask(() => alive && setState("unsupported"));
      return;
    }
    void isUnitDownloaded(unitId).then((d) => alive && setState(d ? "done" : "idle"));
    return () => {
      alive = false;
    };
  }, [unitId]);
  if (state === "unsupported" || state === "unknown") return null;
  return (
    <button
      type="button"
      disabled={state !== "idle"}
      onClick={async () => {
        setState("busy");
        try {
          await downloadUnit(unitId, (d, t) => setPct(Math.round((d / t) * 100)));
          setState("done");
        } catch {
          setState("idle");
        }
      }}
      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line px-4 text-sm font-bold text-ink-soft disabled:opacity-80"
    >
      {state === "done" ? "✓ Saved for offline (works on the plane)" : state === "busy" ? `Downloading… ${pct}%` : "⬇️ Download this unit for offline"}
    </button>
  );
}
