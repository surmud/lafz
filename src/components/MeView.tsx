"use client";
import Link from "next/link";
import { ChaiRow } from "./Chai";
import { useRef, useState } from "react";
import { canDos, nextCanDo, type UnitMeta } from "@/engine/course";
import { PAUSES_PER_WEEK } from "@/engine/streak";
import { levelFor } from "@/engine/xp";
import { setSettings, useSettings, type ScriptMode, type Theme } from "@/lib/settings";
import { useStore } from "@/lib/store";
import { BackupError, exportBackup, importBackup } from "@/storage/db";
import { BottomNav } from "./BottomNav";
import { DinnerCard } from "./DinnerCard";
import { useStreak } from "./StreakBadge";
import { Button, Card, ProgressBar, TopBar } from "./ui";

export function MeView({ units }: { units: UnitMeta[] }) {
  const { progress, replace } = useStore();
  const settings = useSettings();
  const streak = useStreak();
  const level = levelFor(progress.xp);
  const list = canDos(units, progress);
  const done = list.filter((c) => c.done);
  const teaser = nextCanDo(units, progress);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const minutes = Math.round(progress.seconds / 60);

  const doExport = async () => {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lafz-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setMsg("Backup saved. Keep it somewhere safe (or send it to yourself).");
  };

  const doImport = async (file: File) => {
    try {
      const p = await importBackup(JSON.parse(await file.text()));
      replace(p);
      setMsg("Restored! Welcome back.");
    } catch (e) {
      setMsg(e instanceof BackupError ? e.message : "Couldn't read that file.");
    }
  };

  return (
    <>
      <TopBar back={null} title="Me" />
      <main className="flex flex-col gap-5 px-4 pb-28">
        <Card className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-2xl font-bold">{level.title}</p>
            <p className="text-sm font-bold text-ink-soft">{progress.xp} XP</p>
          </div>
          <p className="-mt-2 text-sm text-ink-soft">{level.meaning}</p>
          {level.next ? (
            <ProgressBar value={(progress.xp - level.floor) / (level.next - level.floor)} label="Progress to next level" tone="accent" />
          ) : null}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-display text-2xl font-bold">{streak.current}</p>
              <p className="text-xs text-ink-soft">day streak</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{progress.streak.best}</p>
              <p className="text-xs text-ink-soft">best ever</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{minutes}</p>
              <p className="text-xs text-ink-soft">minutes</p>
            </div>
          </div>
          <p className="rounded-2xl bg-surface-2 p-3 text-sm">
            ⏸️ {streak.pausesLeft} of {PAUSES_PER_WEEK} pause days left this week. Miss more and your streak just rests. It never resets.
          </p>
        </Card>

        <ChaiRow />
        <Link href="/insights/" className="flex items-center gap-3 rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]">
          <span className="text-3xl" aria-hidden>
            📊
          </span>
          <span>
            <span className="block font-bold">Insights</span>
            <span className="text-sm text-ink-soft">Your level, skills and the last two weeks</span>
          </span>
        </Link>
        <Link href="/phrasebook/" className="flex items-center gap-3 rounded-3xl border-2 border-line bg-surface p-4 shadow-[0_3px_0_var(--line)]">
          <span className="text-3xl" aria-hidden>
            📖
          </span>
          <span>
            <span className="block font-bold">Phrasebook</span>
            <span className="block text-sm text-ink-soft">Every phrase in the course, with audio.</span>
          </span>
        </Link>

        <DinnerCard />

        <section aria-labelledby="cando">
          <h2 id="cando" className="font-display text-xl font-bold">
            What you can do
          </h2>
          <p className="mb-2 text-sm text-ink-soft">
            {done.length} of {list.length} can-dos
          </p>
          {teaser ? (
            <p className="mb-3 rounded-2xl border-2 border-dashed border-primary/50 p-3 text-sm">
              <strong>Up next:</strong> {teaser}
            </p>
          ) : null}
          {done.length === 0 ? (
            <p className="rounded-2xl bg-surface-2 p-4 text-ink-soft">Finish a lesson and your first can-do lands here.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {done.map((c) => (
                <li key={c.id} className={`flex gap-2 rounded-2xl p-3 ${c.kind === "unit" || c.kind === "boss" ? "bg-good-soft font-bold" : "bg-surface"}`}>
                  <span aria-hidden>{c.kind === "family" ? "💚" : c.kind === "boss" ? "🏆" : "✓"}</span>
                  {c.text}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-ink-soft">
            🤲 Asked family {progress.askedFamily} time{progress.askedFamily === 1 ? "" : "s"}. {progress.askedFamily < 5 ? `${5 - progress.askedFamily} more for the family badge.` : "Family badge earned!"}
          </p>
        </section>

        <section aria-labelledby="settings" className="flex flex-col gap-3">
          <h2 id="settings" className="font-display text-xl font-bold">
            Settings
          </h2>
          <Segmented
            label="Show Urdu as"
            value={settings.script}
            options={[
              { v: "roman", l: "Roman" },
              { v: "both", l: "Both" },
              { v: "urdu", l: "اردو" },
            ]}
            onChange={(v) => setSettings({ script: v as ScriptMode })}
          />
          <Segmented
            label="Theme"
            value={settings.theme}
            options={[
              { v: "system", l: "Auto" },
              { v: "light", l: "Light" },
              { v: "dark", l: "Dark" },
            ]}
            onChange={(v) => setSettings({ theme: v as Theme })}
          />
          <Segmented
            label="Sound effects"
            value={settings.sound ? "on" : "off"}
            options={[
              { v: "on", l: "On" },
              { v: "off", l: "Off" },
            ]}
            onChange={(v) => setSettings({ sound: v === "on" })}
          />
          <Segmented
            label="Practice goal"
            value={settings.weeklyGoal === null ? "streak" : String(settings.weeklyGoal)}
            options={[
              { v: "streak", l: "Daily" },
              { v: "3", l: "3 days" },
              { v: "5", l: "5 days" },
            ]}
            onChange={(v) => setSettings({ weeklyGoal: v === "streak" ? null : Number(v) })}
          />
          <p className="-mt-1 text-sm text-ink-soft">
            Daily keeps a streak. 3 or 5 days is a weekly goal instead: any days you like, no counting days in a row.
          </p>
        </section>

        <section aria-labelledby="data" className="flex flex-col gap-3">
          <h2 id="data" className="font-display text-xl font-bold">
            Your data
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Everything (progress, family recordings) lives only on this device. No account, no server, no tracking, no ads.
            Move to a new phone with a backup file.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={doExport}>
              Export backup
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Restore
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Backup file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
            }}
          />
          {msg ? (
            <p role="status" className="rounded-2xl bg-primary-soft p-3 text-sm">
              {msg}
            </p>
          ) : null}
        </section>

        <section aria-labelledby="credits" className="flex flex-col gap-2 text-sm text-ink-soft">
          <h2 id="credits" className="font-display text-xl font-bold text-ink">
            Credits
          </h2>
          <p>
            Voices: <strong>Matcha-TTS Urdu</strong> by Ahsan Talal (male and female) with the BSC Vocos vocoder, both{" "}
            <a className="underline" href="https://www.apache.org/licenses/LICENSE-2.0">
              Apache-2.0
            </a>
            . Generated offline.
          </p>
          <p>
            Urdu checked against Platts&apos; <em>Dictionary of Urdu, Classical Hindi and English</em> (DSAL, University of Chicago),
            Rekhta Dictionary and Wiktionary. Every phrase records its sources.
          </p>
          <p>
            Font: Noto Nastaliq Urdu (SIL Open Font License). Code:{" "}
            <a className="underline" href="https://github.com/surmud/lafz">
              github.com/surmud/lafz
            </a>
            .
          </p>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-semibold">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex rounded-full bg-surface-2 p-1">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={value === o.v}
            onClick={() => onChange(o.v)}
            className={`min-h-10 rounded-full px-3 text-sm font-bold whitespace-nowrap ${value === o.v ? "bg-surface text-ink shadow" : "text-ink-soft"}`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
