"use client";
import Link from "next/link";
import { useEffect } from "react";
import type { Character, Pack } from "@/content/schema";
import { nextUp, unitProgress, type UnitMeta } from "@/engine/course";
import { buildReviewSession } from "@/engine/review";
import { snapshot } from "@/engine/skills";
import { levelFor } from "@/engine/xp";
import { setSettings, useSettings, type Mode } from "@/lib/settings";
import { today, useStore } from "@/lib/store";
import { flush } from "@/lib/telemetry";
import { Avatar } from "./Avatar";
import { WelcomeView } from "./WelcomeView";
import { BottomNav } from "./BottomNav";
import { Nastaliq } from "./Phrase";
import { StreakBadge, WelcomeBack } from "./StreakBadge";
import { Card, Pill, ProgressBar, TruckStripe } from "./ui";

export function HomeView({ units, characters, packs }: { units: UnitMeta[]; characters: Character[]; packs: Pack[] }) {
  const { ready, progress } = useStore();

  const { mode } = useSettings();
  const read = mode === "read";
  const core = units.filter((u) => u.track === "speaking" && u.stage !== "advanced");
  const advanced = units.filter((u) => u.track === "speaking" && u.stage === "advanced");
  const reading = units.filter((u) => u.track === "reading");
  const next = nextUp(units, progress, read ? "reading" : "speaking");
  const trouble = Object.values(progress.review).filter((r) => r.lapses > 0).length;
  const stories = units.filter((u) => u.story).length;
  const level = levelFor(progress.xp);
  const reviewCount = buildReviewSession(progress.review, today()).length;
  const char = (id: string) => characters.find((c) => c.id === id);

  // Anonymous statistics: a no-op unless the build has an endpoint and the learner opted in.
  useEffect(() => {
    if (ready && progress.profile.onboarded) void flush(snapshot(units, progress));
  }, [ready, units, progress]);

  // First visit: onboarding renders right here (no redirect, so the first paint is real content).
  if (ready && !progress.profile.onboarded) return <WelcomeView characters={characters} />;

  return (
    <>
      <TruckStripe />
      <main className="flex flex-col gap-5 px-4 pt-4 pb-28">
        <header className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-display text-3xl leading-none font-bold">
              Lafz <Nastaliq className="text-2xl text-rose">لفظ</Nastaliq>
            </p>
            <p className="text-sm text-ink-soft">
              {level.title} · {progress.xp} XP
            </p>
          </div>
          <StreakBadge />
        </header>

        <ModeToggle mode={mode} />

        <WelcomeBack />

        {!ready ? (
          <div aria-busy="true" className="min-h-[13.5rem] rounded-[2rem] bg-primary p-5 text-primary-ink shadow-[0_6px_0_var(--primary-deep)]">
            <p className="font-display text-3xl font-bold">Lafz</p>
            <p className="mt-2 text-lg leading-relaxed opacity-95">
              Learn to speak, understand and read Urdu. Lessons take a few minutes each, and your progress stays on this
              device.
            </p>
          </div>
        ) : next.kind !== "finished" ? (
          <Link
            href={next.kind === "lesson" ? `/lesson/${next.lesson.id}/` : `/boss/${next.unit.id}/`}
            className="group relative overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-ink shadow-[0_6px_0_var(--primary-deep)] transition active:translate-y-1 active:shadow-none"
          >
            <p className="text-xs font-black tracking-widest uppercase">
              {Object.keys(progress.lessons).length === 0 ? "Start here" : "Continue"} · {read ? "Reading " : "Unit "}
              {next.unit.order}
            </p>
            <p className="mt-1 font-display text-3xl font-bold">
              {next.kind === "lesson" ? next.lesson.title : `Conversation: ${next.unit.boss?.title}`}
            </p>
            <p className="mt-1 text-[15px] opacity-90">{next.kind === "lesson" ? next.lesson.canDo : next.unit.boss?.canDo}</p>
            <span className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-white/95 px-5 font-black text-[#0a5651]">
              {next.kind === "lesson" ? "Start lesson →" : "Start conversation →"}
            </span>
            <span aria-hidden className="absolute -right-4 -bottom-6 text-8xl opacity-25">
              {next.unit.emoji}
            </span>
          </Link>
        ) : (
          <Card className="text-center">
            <p className="font-display text-2xl font-bold">You&apos;ve finished the {read ? "reading" : "speaking"} course 🎓</p>
            <p className="text-ink-soft">{read ? "You can read Urdu. Go and find a shop sign." : "Nani is speechless. (She always was.)"}</p>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link href="/review/" className="rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]">
            <p className="text-2xl" aria-hidden>
              🔁
            </p>
            <p className="font-bold">Review</p>
            <p className="text-sm text-ink-soft">{reviewCount > 0 ? `${reviewCount} phrases ready` : "Learn a lesson first"}</p>
          </Link>
          <Link href="/practice/" className="rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]">
            <p className="text-2xl" aria-hidden>
              🎯
            </p>
            <p className="font-bold">Practice</p>
            <p className="text-sm text-ink-soft">{trouble > 0 ? `${trouble} trouble words` : "Listening, phrasebook, grammar"}</p>
          </Link>
        </div>

        {packs.length > 0 && !read ? (
          <section aria-labelledby="packs">
            <h2 id="packs" className="mb-2 font-display text-xl font-bold">
              Prep packs
            </h2>
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
              {packs.map((p) => (
                <Link
                  key={p.id}
                  href={`/pack/${p.id}/`}
                  className="w-40 shrink-0 snap-start rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]"
                >
                  <p className="text-3xl" aria-hidden>
                    {p.emoji}
                  </p>
                  <p className="mt-1 leading-tight font-bold">{p.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{p.sessions.length} sessions</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {read ? (
          <section aria-labelledby="path">
            <h2 id="path" className="mb-2 font-display text-xl font-bold">
              Reading course
            </h2>
            <p className="mb-3 text-sm text-ink-soft">The alphabet first, then words, signs, messages and a short poem.</p>
            <UnitList units={reading} char={char} />
            <Link
              href="/stories/"
              className="mt-3 flex items-center gap-4 rounded-3xl border-2 border-accent/60 bg-accent-soft/50 p-4 shadow-[0_3px_0_var(--line)]"
            >
              <span className="text-4xl" aria-hidden>
                📚
              </span>
              <span>
                <span className="block font-display text-lg font-bold">Stories to read</span>
                <span className="block text-sm text-ink-soft">
                  {stories} short stories in Nastaliq. Tap a line to check it, tap a word for its meaning.
                </span>
              </span>
            </Link>
          </section>
        ) : (
          <>
            <section aria-labelledby="path">
              <h2 id="path" className="mb-2 font-display text-xl font-bold">
                Speaking course
              </h2>
              <UnitList units={core} char={char} />
            </section>
            {advanced.length > 0 ? (
              <section aria-labelledby="adv">
                <h2 id="adv" className="mb-1 font-display text-xl font-bold">
                  Advanced
                </h2>
                <p className="mb-3 text-sm text-ink-soft">For when the basics are easy: formal Urdu, idioms, arguing your point, poetry.</p>
                <UnitList units={advanced} char={char} />
              </section>
            ) : null}
          </>
        )}
        <p className="text-center text-sm text-ink-soft">All units are open. Start anywhere.</p>
      </main>
      <BottomNav />
    </>
  );
}

function ModeToggle({ mode }: { mode: Mode }) {
  const opts: { k: Mode; label: string; icon: string }[] = [
    { k: "speak", label: "Speak", icon: "🗣️" },
    { k: "read", label: "Read", icon: "📜" },
  ];
  return (
    <div role="group" aria-label="Mode" className="grid grid-cols-2 gap-1 rounded-2xl border-2 border-line bg-surface-2 p-1">
      {opts.map((o) => (
        <button
          key={o.k}
          type="button"
          aria-pressed={mode === o.k}
          onClick={() => setSettings({ mode: o.k })}
          className={`min-h-11 rounded-xl font-black transition ${mode === o.k ? "bg-surface text-primary shadow-[0_2px_0_var(--line)]" : "text-ink-soft"}`}
        >
          <span aria-hidden>{o.icon}</span> {o.label}
        </button>
      ))}
    </div>
  );
}

function UnitList({ units, char }: { units: UnitMeta[]; char: (id: string) => Character | undefined }) {
  return (
    <ol className="flex flex-col gap-3">
      {units.map((u) => (
        <li key={u.id}>
          <UnitCard unit={u} character={u.boss ? char(u.boss.character) : undefined} />
        </li>
      ))}
    </ol>
  );
}

export function UnitCard({ unit, character }: { unit: UnitMeta; character?: Character }) {
  const { progress } = useStore();
  const up = unitProgress(unit, progress);
  const total = up.lessonsTotal + (unit.boss ? 1 : 0);
  const done = up.lessonsDone + (unit.boss && up.bossDone ? 1 : 0);
  return (
    <Link
      href={`/unit/${unit.id}/`}
      className={`flex items-center gap-4 rounded-3xl border-2 bg-surface p-4 shadow-[0_3px_0_var(--line)] ${up.status === "done" ? "border-good" : "border-line"}`}
    >
      <div className={`grid size-16 shrink-0 place-items-center rounded-2xl text-4xl ${up.status === "done" ? "bg-good-soft" : "bg-surface-2"}`} aria-hidden>
        {unit.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black tracking-wider text-ink-soft uppercase">
            {unit.track === "reading" ? "R" : "Unit "}
            {unit.order}
          </span>
          {up.status === "done" ? <Pill tone="good">✓ Done</Pill> : null}
          {up.status === "skipped" ? <Pill tone="accent">Skipped · review anytime</Pill> : null}
        </div>
        <p className="line-clamp-2 font-display text-lg leading-tight font-bold">{unit.title}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <ProgressBar value={total ? done / total : 0} label={`${unit.title} progress`} tone={up.status === "done" ? "good" : "primary"} />
          <span className="shrink-0 text-xs font-bold text-ink-soft">
            {done}/{total}
          </span>
        </div>
      </div>
      {character ? <Avatar character={character} size="sm" /> : null}
    </Link>
  );
}
