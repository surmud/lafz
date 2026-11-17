"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Character, Conversation, Phrase } from "@/content/schema";
import { createScriptedEngine, type ConvoState } from "@/engine/conversation";
import { completeBoss } from "@/engine/progress";
import { bossWinText, whatsappUrl } from "@/engine/share";
import type { XpBreakdown } from "@/engine/xp";
import { blip, playPhrase, stopAudio } from "@/lib/audio";
import { listen, speechSupported } from "@/lib/speech";
import { personaliseCharacter, personaliseText, today, useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { Celebration } from "./Celebration";
import { AudioButton, PhraseText, ScriptToggle } from "./Phrase";
import { Button, LinkButton } from "./ui";

type Mode = "choose" | "type" | "speak";

export function BossPlayer({
  unitId,
  convo,
  phrases,
  characters,
  nextHref,
}: {
  unitId: string;
  convo: Conversation;
  phrases: Phrase[];
  characters: Character[];
  nextHref?: string;
}) {
  const byId = useMemo(() => new Map(phrases.map((p) => [p.id, p])), [phrases]);
  const engine = useMemo(() => createScriptedEngine(convo, byId), [convo, byId]);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<ConvoState>(() => engine.start());
  const [mode, setMode] = useState<Mode>("choose");
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState(false);
  const [xp, setXp] = useState<XpBreakdown | null>(null);
  const { update, progress, ready } = useStore();
  const rel = progress.profile.relatives;
  const t0 = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);
  const lastPlayed = useRef(-1);
  const char = (id?: string) => {
    const c = characters.find((x) => x.id === id) ?? characters[0];
    return c ? personaliseCharacter(c, rel) : c;
  };
  const main = char(convo.character);
  const node = engine.current(state);

  // Speak each new NPC line once, and keep the latest line in view.
  useEffect(() => {
    if (!started) return;
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    const lastIdx = state.transcript.length - 1;
    const last = state.transcript[lastIdx];
    if (last?.who === "npc" && last.phraseId && lastIdx !== lastPlayed.current) {
      lastPlayed.current = lastIdx;
      const p = byId.get(last.phraseId);
      if (p) void playPhrase(p);
    }
  }, [state.transcript, started, byId]);

  useEffect(() => {
    t0.current = Date.now();
    return stopAudio;
  }, []);

  useEffect(() => {
    if (!state.done || xp) return;
    blip("done");
    let gained: XpBreakdown = { base: 0, comeback: 0, total: 0 };
    void update((p) => {
      const r = completeBoss(p, { bossId: convo.id, outcome: state.outcome ?? "end", seconds: (Date.now() - t0.current) / 1000, today: today() });
      gained = r.xp;
      return r.progress;
    }).then(() => setXp(gained));
  }, [state.done, state.outcome, xp, update, convo.id]);

  const choose = (i: number) => {
    setHint(false);
    setTyped("");
    setState((s) => engine.choose(s, i));
  };

  const reply = (text: string) => {
    const r = engine.reply(state, text);
    setState(r.state);
    if (r.matched) {
      setTyped("");
      setHint(false);
    } else {
      blip("wrong");
    }
  };

  const speak = async () => {
    try {
      const transcripts = await listen().result;
      for (const t of transcripts) {
        const r = engine.reply(state, t);
        if (r.matched) {
          setState(r.state);
          return;
        }
      }
      setState((s) => ({ ...s, misses: s.misses + 1, totalMisses: s.totalMisses + 1 }));
    } catch {
      setMode("choose");
    }
  };

  if (!ready) return <main className="min-h-dvh" aria-busy="true" />;

  if (!started) {
    return (
      <main className="flex min-h-dvh flex-col gap-5 px-5 pt-10 pb-8">
        <Link href={`/unit/${unitId}/`} aria-label="Back" className="-ml-2 grid size-11 place-items-center text-2xl text-ink-soft">
          ←
        </Link>
        <p className="text-sm font-black tracking-widest text-rose uppercase">Boss conversation</p>
        <h1 className="font-display text-4xl font-bold">{convo.title}</h1>
        {main ? (
          <div className="flex items-center gap-4 rounded-3xl bg-rose-soft p-4">
            <Avatar character={main} size="lg" />
            <div>
              <p className="font-display text-xl font-bold">{main.name}</p>
              <p className="text-sm">{main.bio}</p>
            </div>
          </div>
        ) : null}
        <p className="text-lg leading-relaxed">{personaliseText(convo.scene, rel)}</p>
        <ul className="text-[15px] text-ink-soft">
          <li>• Pick a reply, type it, or say it. Different replies, different story.</li>
          <li>• You can&apos;t fail. She&apos;ll just ask again.</li>
        </ul>
        <Button block className="mt-auto" onClick={() => setStarted(true)}>
          Knock on the door
        </Button>
      </main>
    );
  }

  const endNode = state.done ? convo.nodes[state.nodeId] : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-line bg-bg px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <Link href={`/unit/${unitId}/`} aria-label="Leave conversation" className="grid size-11 place-items-center text-2xl text-ink-soft">
          ✕
        </Link>
        {main ? <Avatar character={main} size="sm" /> : null}
        <div className="flex-1 leading-tight">
          <p className="font-bold">{main?.name}</p>
          <p className="text-xs text-ink-soft">{convo.title}</p>
        </div>
        <ScriptToggle />
      </header>

      <main className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-72" aria-live="polite">
        {state.transcript.map((line, i) => {
          if (line.who === "narration") {
            return (
              <p key={i} className="animate-rise self-center rounded-2xl bg-surface-2 px-4 py-2 text-center text-sm text-ink-soft italic">
                {personaliseText(line.text ?? "", rel)}
              </p>
            );
          }
          const p = line.phraseId ? byId.get(line.phraseId) : undefined;
          if (!p) return null;
          if (line.who === "npc") {
            const c = char(line.speaker);
            return (
              <div key={i} className="flex animate-rise items-end gap-2">
                {c ? <Avatar character={c} size="sm" /> : null}
                <div className="max-w-[80%] rounded-3xl rounded-bl-md border-2 border-line bg-surface p-3">
                  <PhraseText phrase={p} size="md" />
                  <div className="mt-1 flex items-center gap-2">
                    <AudioButton phrase={p} size="sm" />
                    <span className="text-sm text-ink-soft">{p.en}</span>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="flex animate-rise justify-end">
              <div className={`max-w-[80%] rounded-3xl rounded-br-md p-3 ${line.quality === "bold" ? "bg-accent text-[#2b1a12]" : "bg-primary text-primary-ink"}`}>
                <PhraseText phrase={p} size="md" />
                <p className="text-sm opacity-85">{p.en}</p>
              </div>
            </div>
          );
        })}
        {endNode && endNode.type === "end" ? (
          <div className="mt-4 flex flex-col gap-3 text-center">
            <Celebration />
            <p className="text-6xl" aria-hidden>
              🏆
            </p>
            <h2 className="font-display text-3xl font-bold">{endNode.title}</h2>
            <p className="text-lg">{personaliseText(endNode.text, rel)}</p>
            <div className="rounded-3xl border-2 border-good bg-good-soft p-4 text-left">
              <p className="text-xs font-black tracking-widest text-good-deep uppercase">New can-do unlocked</p>
              <p className="text-lg font-bold">✓ {convo.canDo}</p>
            </div>
            {xp ? <p className="font-bold text-accent-deep">+{xp.total} XP</p> : null}
            {state.totalMisses > 0 ? <p className="text-sm text-ink-soft">{state.totalMisses} replies didn&apos;t land first time. Doesn&apos;t matter: you got there.</p> : null}
            <div className="flex flex-col gap-3">
              <Button
                variant="good"
                block
                onClick={async () => {
                  const text = bossWinText(convo.title, convo.canDo, "https://surmud.github.io/lafz/");
                  try {
                    if (navigator.share) return await navigator.share({ text });
                  } catch (e) {
                    if ((e as Error).name === "AbortError") return;
                  }
                  window.open(whatsappUrl(text), "_blank", "noopener");
                }}
              >
                Tell the family 🎉
              </Button>
              {nextHref ? (
                <LinkButton href={nextHref} block>
                  Next unit →
                </LinkButton>
              ) : null}
              <Button
                variant="secondary"
                block
                onClick={() => {
                  setState(engine.start());
                  setXp(null);
                  lastPlayed.current = -1;
                  t0.current = Date.now();
                }}
              >
                Replay (try other answers)
              </Button>
              <LinkButton href="/" variant="ghost" block>
                Home
              </LinkButton>
            </div>
          </div>
        ) : null}
        <div ref={bottom} />
      </main>

      {node.type === "you" && !state.done ? (
        <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md rounded-t-3xl border-t-2 border-line bg-bg px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-bold">🎯 {node.prompt}</p>
            <div className="flex shrink-0 gap-1" role="tablist" aria-label="Reply mode">
              {(["choose", "type", ...(speechSupported() ? (["speak"] as const) : [])] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={`min-h-9 rounded-full px-3 text-xs font-bold ${mode === m ? "bg-ink text-bg" : "bg-surface-2 text-ink-soft"}`}
                >
                  {m === "choose" ? "Pick" : m === "type" ? "Type" : "Speak"}
                </button>
              ))}
            </div>
          </div>
          {state.misses > 0 ? (
            <p className="mb-2 rounded-2xl bg-accent-soft p-2 text-sm">
              {main?.name.split(" ")[0]} tilts her head: “Haan? Phir se bolo, beta.” (Say again?) {node.hint ? `Try starting with “${node.hint}”` : ""}
            </p>
          ) : null}
          {mode === "choose" ? (
            <div className="flex flex-col gap-2">
              {node.options.map((o, i) => {
                const p = byId.get(o.phrase);
                return p ? (
                  <button
                    key={o.phrase}
                    type="button"
                    onClick={() => choose(i)}
                    className="flex min-h-14 items-center rounded-2xl border-2 border-line bg-surface px-4 py-2 text-left shadow-[0_3px_0_var(--line)] active:translate-y-[2px]"
                  >
                    <span>
                      <PhraseText phrase={p} size="sm" />
                      <span className="block text-xs text-ink-soft">{p.en}</span>
                    </span>
                  </button>
                ) : null;
              })}
            </div>
          ) : mode === "type" ? (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (typed.trim()) reply(typed);
              }}
            >
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                aria-label="Type your reply in Roman Urdu"
                placeholder="Type your reply in Roman Urdu"
                className="min-h-12 min-w-0 flex-1 rounded-2xl border-2 border-line bg-surface px-4 text-lg outline-none focus:border-primary"
              />
              <Button type="submit">Send</Button>
            </form>
          ) : (
            <Button block variant="bad" onClick={() => void speak()}>
              🎙️ Tap and speak
            </Button>
          )}
          {node.hint ? (
            <button type="button" onClick={() => setHint(true)} className="mt-2 min-h-9 text-sm font-bold text-ink-soft">
              {hint ? `💡 ${node.hint}` : "💡 Hint"}
            </button>
          ) : null}
        </footer>
      ) : null}
    </div>
  );
}
