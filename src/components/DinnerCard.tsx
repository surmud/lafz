"use client";
import { BASE } from "@/lib/base";
import { useEffect, useMemo, useState } from "react";
import type { Phrase } from "@/content/schema";
import { dinnerCardText, whatsappUrl } from "@/engine/share";
import { useStore } from "@/lib/store";
import { Nastaliq } from "./Phrase";

/**
 * "5 phrases to try at dinner tonight" (SPEC §10): the learner's most recent phrases, as a card to
 * share with family or print and stick on the fridge.
 */
type Lite = Pick<Phrase, "id" | "roman" | "urdu" | "en" | "sense">;

export function DinnerCard() {
  const { progress } = useStore();
  const [shared, setShared] = useState(false);
  const [phrases, setPhrases] = useState<Lite[]>([]);
  const hasDeck = Object.keys(progress.review).length >= 3;
  useEffect(() => {
    if (!hasDeck) return;
    let alive = true;
    // Small static index written at build time (scripts/postbuild.mjs), fetched only when needed.
    void fetch(`${BASE}/phrases.json`)
      .then((r) => r.json() as Promise<Lite[]>)
      .then((list) => alive && setPhrases(list))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [hasDeck]);
  const pick = useMemo(() => {
    const byId = new Map(phrases.map((p) => [p.id, p]));
    // Most recently introduced to the review deck first (due date is a proxy for recency).
    const recent = Object.entries(progress.review)
      .sort(([, a], [, b]) => b.due.localeCompare(a.due))
      .map(([id]) => byId.get(id))
      .filter((p): p is Lite => !!p && p.roman.split(" ").length >= 2);
    // One phrase per sense, so the card isn't "kaise hain" and "kaisi hain" side by side.
    const seen = new Set<string>();
    return recent.filter((p) => !p.sense || (!seen.has(p.sense) && seen.add(p.sense))).slice(0, 5);
  }, [phrases, progress.review]);

  if (pick.length < 3) return null;
  const text = dinnerCardText(pick);
  return (
    <section aria-labelledby="dinner" className="flex flex-col gap-3 rounded-3xl border-2 border-accent bg-accent-soft p-4 print:border-black">
      <h2 id="dinner" className="font-display text-xl font-bold">
        🍛 5 phrases to try at dinner tonight
      </h2>
      <ol className="flex flex-col gap-2">
        {pick.map((p, i) => (
          <li key={p.id} className="rounded-2xl bg-surface p-3">
            <p className="font-bold">
              {i + 1}. {p.roman}
            </p>
            <Nastaliq className="text-lg">{p.urdu}</Nastaliq>
            <p className="text-sm text-ink-soft">{p.en}</p>
          </li>
        ))}
      </ol>
      <div className="flex gap-2 print:hidden">
        <button
          type="button"
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({ text });
                setShared(true);
                return;
              } catch (e) {
                if ((e as Error).name === "AbortError") return;
              }
            }
            window.open(whatsappUrl(text), "_blank", "noopener");
            setShared(true);
          }}
          className="min-h-11 flex-1 rounded-full bg-good px-4 font-bold text-good-ink"
        >
          {shared ? "Shared 💚" : "Send to the family"}
        </button>
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-full border-2 border-line bg-surface px-4 font-bold">
          Print
        </button>
      </div>
    </section>
  );
}
