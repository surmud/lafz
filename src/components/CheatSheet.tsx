"use client";
import type { Phrase } from "@/content/schema";
import { AudioButton, Nastaliq } from "./Phrase";
import { TopBar } from "./ui";

export function CheatSheet({
  unitId,
  title,
  titleUrdu,
  grammar,
  phrases,
}: {
  unitId: string;
  title: string;
  titleUrdu?: string;
  grammar: { title: string; body: string }[];
  phrases: Phrase[];
}) {
  return (
    <>
      <div className="print:hidden">
        <TopBar back={`/unit/${unitId}/`} title="Cheat sheet" right={<button type="button" onClick={() => window.print()} className="min-h-11 rounded-full border-2 border-line bg-surface px-4 text-sm font-bold">Print</button>} />
      </div>
      <main className="flex flex-col gap-4 px-4 pb-16 print:px-0 print:text-black">
        <header>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {titleUrdu ? <Nastaliq className="text-2xl">{titleUrdu}</Nastaliq> : null}
        </header>
        {grammar.length > 0 ? (
          <section className="flex flex-col gap-2">
            {grammar.map((g) => (
              <div key={g.title} className="rounded-2xl bg-surface-2 p-3 print:border print:border-black print:bg-transparent">
                <p className="font-bold">{g.title}</p>
                <p className="text-sm leading-relaxed">{g.body}</p>
              </div>
            ))}
          </section>
        ) : null}
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Phrases in {title}</caption>
          <thead>
            <tr className="border-b-2 border-line">
              <th scope="col" className="py-2 pr-2">Roman</th>
              <th scope="col" className="py-2 pr-2 text-right">اردو</th>
              <th scope="col" className="py-2">English</th>
            </tr>
          </thead>
          <tbody>
            {phrases.map((p) => (
              <tr key={p.id} className="border-b border-line align-middle print:break-inside-avoid">
                <td className="py-2 pr-2 font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="print:hidden">
                      <AudioButton phrase={p} size="sm" />
                    </span>
                    {p.roman}
                  </span>
                </td>
                <td className="py-1 pr-2 text-right">
                  <Nastaliq className="text-lg">{p.urdu}</Nastaliq>
                </td>
                <td className="py-2 text-ink-soft">{p.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink-soft">Lafz · surmud.github.io/lafz · Audio: Matcha-TTS Urdu (Apache-2.0)</p>
      </main>
    </>
  );
}
