"use client";
import Link from "next/link";
import type { Character, Pack } from "@/content/schema";
import { nextUp, unitProgress, type UnitMeta } from "@/engine/course";
import { buildReviewSession } from "@/engine/review";
import { levelFor } from "@/engine/xp";
import { today, useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { WelcomeView } from "./WelcomeView";
import { BottomNav } from "./BottomNav";
import { Nastaliq } from "./Phrase";
import { StreakBadge, WelcomeBack } from "./StreakBadge";
import { Card, Pill, ProgressBar, TruckStripe } from "./ui";

export function HomeView({ units, characters, packs }: { units: UnitMeta[]; characters: Character[]; packs: Pack[] }) {
  const { ready, progress } = useStore();

  const speaking = units.filter((u) => u.track === "speaking");
  const reading = units.filter((u) => u.track === "reading");
  const next = nextUp(units, progress);
  const nextRead = nextUp(units, progress, "reading");
  const level = levelFor(progress.xp);
  const reviewCount = buildReviewSession(progress.review, today()).length;
  const char = (id: string) => characters.find((c) => c.id === id);

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

        <WelcomeBack />

        {!ready ? (
          <div aria-busy="true" className="min-h-[13.5rem] rounded-[2rem] bg-primary p-5 text-primary-ink shadow-[0_6px_0_var(--primary-deep)]">
            <p className="font-display text-3xl font-bold">Salaam!</p>
            <p className="mt-2 text-lg leading-relaxed opacity-95">
              Urdu for real family life. From “Salaam” to surviving the shaadi. Mistakes are free, nothing is locked, and
              everything stays on this phone.
            </p>
          </div>
        ) : next.kind !== "finished" ? (
          <Link
            href={next.kind === "lesson" ? `/lesson/${next.lesson.id}/` : `/boss/${next.unit.id}/`}
            className="group relative overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-ink shadow-[0_6px_0_var(--primary-deep)] transition active:translate-y-1 active:shadow-none"
          >
            <p className="text-xs font-black tracking-widest uppercase opacity-80">
              {Object.keys(progress.lessons).length === 0 ? "Start here" : "Continue"} · Unit {next.unit.order}
            </p>
            <p className="mt-1 font-display text-3xl font-bold">
              {next.kind === "lesson" ? next.lesson.title : `Boss: ${next.unit.boss?.title}`}
            </p>
            <p className="mt-1 text-[15px] opacity-90">{next.kind === "lesson" ? next.lesson.blurb : next.unit.boss?.blurb}</p>
            <span className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-white/95 px-5 font-black text-primary-deep">
              {next.kind === "lesson" ? "Start lesson →" : "Face the boss →"}
            </span>
            <span aria-hidden className="absolute -right-4 -bottom-6 text-8xl opacity-25">
              {next.unit.emoji}
            </span>
          </Link>
        ) : (
          <Card className="text-center">
            <p className="font-display text-2xl font-bold">You&apos;ve finished the speaking course 🎓</p>
            <p className="text-ink-soft">Nani is speechless. (She always was.)</p>
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
          <Link
            href={nextRead.kind === "lesson" ? `/lesson/${nextRead.lesson.id}/` : "/read/"}
            className="rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]"
          >
            <p className="text-2xl" aria-hidden>
              📜
            </p>
            <p className="font-bold">Read Nastaliq</p>
            <p className="text-sm text-ink-soft">{nextRead.kind === "lesson" ? nextRead.lesson.title : "Reading track"}</p>
          </Link>
        </div>

        {packs.length > 0 ? (
          <section aria-labelledby="packs">
            <h2 id="packs" className="mb-2 font-display text-xl font-bold">
              Something coming up?
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
                  <p className="mt-1 text-xs text-ink-soft">{p.sessions.length} quick sessions</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="path">
          <h2 id="path" className="mb-2 font-display text-xl font-bold">
            Speaking course
          </h2>
          <ol className="flex flex-col gap-3">
            {speaking.map((u) => (
              <li key={u.id}>
                <UnitCard unit={u} character={u.boss ? char(u.boss.character) : undefined} />
              </li>
            ))}
          </ol>
          {reading.length > 0 ? (
            <p className="mt-4 text-center text-sm text-ink-soft">
              Nothing is locked. Jump into any unit, any time.
            </p>
          ) : null}
        </section>
      </main>
      <BottomNav />
    </>
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
