"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Phrase, Relative } from "@/content/schema";
import { useStore } from "@/lib/store";
import { AskAmmiButton } from "./AskAmmi";
import { BottomNav } from "./BottomNav";
import { AudioButton, Nastaliq } from "./Phrase";
import { TopBar } from "./ui";

/**
 * Interactive family tree (SPEC §5.4). Mum's side on the left, Dad's side on the right, generations
 * top to bottom. Tap anyone for their term, audio, how to address them and the respect level.
 */
export function FamilyView({ relatives, phrases }: { relatives: Relative[]; phrases: Phrase[] }) {
  const byId = useMemo(() => new Map(phrases.map((p) => [p.id, p])), [phrases]);
  const { progress } = useStore();
  const [open, setOpen] = useState<Relative | null>(null);
  const names = progress.profile.relatives;

  if (relatives.length === 0) {
    return (
      <>
        <TopBar back={null} title="Family" />
        <main className="px-4 pb-28">
          <p className="rounded-2xl border-2 border-dashed border-line p-4 text-ink-soft">The family tree is on its way.</p>
        </main>
        <BottomNav />
      </>
    );
  }

  const row = (gen: number, side: Relative["side"]) => relatives.filter((r) => r.generation === gen && r.side === side);

  const node = (r: Relative) => {
    const p = byId.get(r.phrase);
    const custom = names[r.id];
    return (
      <button
        key={r.id}
        type="button"
        onClick={() => setOpen(r)}
        aria-label={`${p?.roman ?? r.id}: ${r.relation}`}
        className={`flex min-h-20 w-full flex-col items-center justify-center rounded-2xl border-2 bg-surface p-2 text-center shadow-[0_3px_0_var(--line)] transition active:translate-y-[2px] ${open?.id === r.id ? "border-primary" : "border-line"}`}
      >
        <span className="text-2xl" aria-hidden>
          {r.emoji}
        </span>
        <span className="text-sm leading-tight font-bold">{p?.roman}</span>
        {custom ? <span className="text-[11px] text-ink-soft">{custom}</span> : null}
        {p ? <Nastaliq className="text-sm leading-[2]">{p.urdu}</Nastaliq> : null}
      </button>
    );
  };

  const side = (gen: number, which: "maternal" | "paternal") => (
    <div className="grid grid-cols-2 gap-2">{row(gen, which).map(node)}</div>
  );

  const p = open ? byId.get(open.phrase) : undefined;
  const elder = open ? open.generation > 0 : false;

  return (
    <>
      <TopBar back={null} title="Family tree" />
      <main className="flex flex-col gap-4 px-3 pb-28">
        <p className="px-1 text-sm text-ink-soft">
          Tap anyone. Names you added in onboarding show under their title.{" "}
          <Link href="/unit/u02/" className="font-bold text-primary underline">
            Learn them in Unit 2 →
          </Link>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <p className="rounded-full bg-rose-soft py-1 text-center text-xs font-black tracking-wider text-rose-deep uppercase">Mum&apos;s side</p>
          <p className="rounded-full bg-primary-soft py-1 text-center text-xs font-black tracking-wider text-primary-deep uppercase">Dad&apos;s side</p>
        </div>
        <section aria-label="Grandparents" className="grid grid-cols-2 gap-3">
          {side(2, "maternal")}
          {side(2, "paternal")}
        </section>
        <section aria-label="Parents, aunts and uncles" className="grid grid-cols-2 gap-3">
          {side(1, "maternal")}
          {side(1, "paternal")}
        </section>
        <section aria-label="Your parents" className="mx-auto grid w-2/3 grid-cols-2 gap-2">
          {row(1, "both").map(node)}
        </section>
        <section aria-label="Your generation" className="grid grid-cols-3 gap-2">
          {[...row(0, "you"), ...row(0, "both")].map(node)}
        </section>
      </main>

      {open && p ? (
        <div className="fixed inset-0 z-40 flex items-end bg-black/30" onClick={() => setOpen(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={p.roman}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-md animate-rise rounded-t-[2rem] bg-bg px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-start gap-4">
              <span className="text-5xl" aria-hidden>
                {open.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-3xl font-bold">{p.roman}</p>
                <Nastaliq className="text-2xl">{p.urdu}</Nastaliq>
                <p className="font-semibold text-ink-soft">{open.relation}</p>
              </div>
              <AudioButton phrase={p} />
            </div>
            <dl className="mt-4 flex flex-col gap-3 text-[15px]">
              <div>
                <dt className="text-xs font-black tracking-wider text-ink-soft uppercase">What to call them</dt>
                <dd className="font-semibold">{open.address}</dd>
              </div>
              <div>
                <dt className="text-xs font-black tracking-wider text-ink-soft uppercase">Respect meter</dt>
                <dd className="flex items-center gap-2">
                  <span className="flex gap-0.5" aria-hidden>
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={`h-4 w-2 rounded-sm ${i <= (elder ? 3 : 2) ? (elder ? "bg-good" : "bg-accent") : "bg-surface-2"}`} />
                    ))}
                  </span>
                  {elder ? "Always aap, plus ji. They're your elder." : open.side === "you" && open.id !== "you" ? "Tum is normal. Older siblings often get aap." : "Tum with cousins your age."}
                </dd>
              </div>
              {open.note ? <p className="rounded-2xl bg-accent-soft p-3">💡 {open.note}</p> : null}
            </dl>
            <div className="mt-4">
              <AskAmmiButton phrase={p} />
            </div>
          </div>
        </div>
      ) : null}
      <BottomNav />
    </>
  );
}
