"use client";
import type { Character, Phrase } from "@/content/schema";
import { setSettings, useSettings } from "@/lib/settings";
import { Avatar } from "./Avatar";
import { AudioButton, Nastaliq, PhraseText, ScriptToggle } from "./Phrase";
import { Button, Card, Pill, ProgressBar, TopBar, TruckStripe } from "./ui";

/** /dev/ui: every base component in one place, for visual review in both themes. */
export function DevGallery({ characters, phrases }: { characters: Character[]; phrases: Phrase[] }) {
  const { theme } = useSettings();
  const p = phrases[0]!;
  return (
    <>
      <TruckStripe />
      <TopBar title="UI gallery" right={<ScriptToggle />} />
      <main className="flex flex-col gap-6 px-4 pb-16">
        <div className="flex gap-2">
          {(["light", "dark", "system"] as const).map((t) => (
            <Button key={t} variant={theme === t ? "primary" : "secondary"} onClick={() => setSettings({ theme: t })}>
              {t}
            </Button>
          ))}
        </div>
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">Buttons</h2>
          {(["primary", "accent", "good", "bad", "secondary", "ghost"] as const).map((v) => (
            <Button key={v} variant={v} block>
              {v}
            </Button>
          ))}
          <Button block disabled>
            disabled
          </Button>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">Type</h2>
          <p className="font-display text-4xl font-bold">Display / Fraunces</p>
          <p className="text-lg">Body text: ui-rounded / system. Mistakes are free.</p>
          <Nastaliq className="text-4xl">لفظ — اردو نستعلیق</Nastaliq>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">Phrases & audio</h2>
          {phrases.map((ph) => (
            <Card key={ph.id} className="flex items-center gap-3">
              <AudioButton phrase={ph} />
              <PhraseText phrase={ph} />
            </Card>
          ))}
          <div className="flex gap-3">
            <AudioButton phrase={p} size="lg" />
            <AudioButton phrase={p} speed="slow" />
            <AudioButton phrase={p} speed="aunty" size="sm" />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">Progress & pills</h2>
          <ProgressBar value={0.35} label="primary" />
          <ProgressBar value={0.6} label="accent" tone="accent" />
          <ProgressBar value={1} label="good" tone="good" />
          <div className="flex flex-wrap gap-2">
            {(["neutral", "accent", "good", "rose", "primary"] as const).map((t) => (
              <Pill key={t} tone={t}>
                {t}
              </Pill>
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">Characters</h2>
          <div className="flex flex-wrap gap-3">
            {characters.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-1 text-xs">
                <Avatar character={c} />
                {c.name}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
