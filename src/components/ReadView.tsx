"use client";
import type { UnitMeta } from "@/engine/course";
import { BottomNav } from "./BottomNav";
import { UnitCard } from "./HomeView";
import { Nastaliq } from "./Phrase";
import { TopBar } from "./ui";

export function ReadView({ units }: { units: UnitMeta[] }) {
  return (
    <>
      <TopBar back={null} title="Read Nastaliq" />
      <main className="flex flex-col gap-4 px-4 pb-28">
        <div className="rounded-[2rem] bg-surface-2 p-5">
          <Nastaliq className="text-4xl">پڑھنا سیکھیں</Nastaliq>
          <p className="mt-1 font-display text-xl font-bold">Learn to read Urdu script</p>
          <p className="mt-1 text-ink-soft">
            Separate from speaking, open from day one. From single letters to WhatsApp messages from Khala, and finally a Ghalib couplet.
          </p>
        </div>
        {units.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-line p-4 text-ink-soft">The reading track is being written right now. Check back soon.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {units.map((u) => (
              <li key={u.id}>
                <UnitCard unit={u} />
              </li>
            ))}
          </ol>
        )}
      </main>
      <BottomNav />
    </>
  );
}
