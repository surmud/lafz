"use client";
import type { Phrase, Relative } from "@/content/schema";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./ui";

export function FamilyView({ relatives }: { relatives: Relative[]; phrases: Phrase[] }) {
  return (
    <>
      <TopBar back={null} title="Family" />
      <main className="flex flex-col gap-4 px-4 pb-28">
        {relatives.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-line p-4 text-ink-soft">The family tree arrives with Unit 2.</p>
        ) : null}
      </main>
      <BottomNav />
    </>
  );
}
