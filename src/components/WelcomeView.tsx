"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Character } from "@/content/schema";
import { useStore } from "@/lib/store";
import { accountsEnabled } from "@/lib/config";
import { SignInButtons } from "./AccountSection";
import { Avatar } from "./Avatar";
import { Nastaliq } from "./Phrase";
import { Button, TruckStripe } from "./ui";

type Step = "hello" | "who" | "ready" | "account";

export function WelcomeView({ characters }: { characters: Character[] }) {
  const { update } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>("hello");
  const [kind, setKind] = useState<"heritage" | "beginner" | null>(null);

  const [dest, setDest] = useState<"placement" | "home">("home");
  // With accounts configured, one optional step comes last: save progress, or skip.
  const choose = (to: "placement" | "home") => {
    if (accountsEnabled()) {
      setDest(to);
      setStep("account");
    } else void finish(to);
  };
  const save = () => update((p) => ({ ...p, profile: { ...p.profile, kind, onboarded: true } }));
  const finish = async (to: "placement" | "home") => {
    await save();
    if (to === "placement") router.push("/placement/");
    else router.replace("/");
  };

  return (
    <>
      <TruckStripe />
      <main className="flex min-h-[calc(100dvh-6px)] flex-col px-5 pt-10 pb-8">
        {step === "hello" ? (
          <div className="flex flex-1 animate-rise flex-col">
            <Nastaliq className="self-center text-7xl text-rose">لفظ</Nastaliq>
            <h1 className="mt-2 text-center font-display text-4xl font-bold">Lafz</h1>
            <p className="mt-2 text-center text-lg text-ink-soft">Learn to speak, understand and read Urdu.</p>
            <div className="mt-8 flex justify-center -space-x-3">
              {characters.slice(0, 5).map((c) => (
                <Avatar key={c.id} character={c} />
              ))}
            </div>
            <ul className="mx-auto mt-8 flex max-w-xs flex-col gap-2 text-[15px]">
              <li>Free. No ads, no account.</li>
              <li>Wrong answers come back later. Nothing is locked.</li>
              <li>Your progress stays on this device.</li>
            </ul>
            <Button block className="mt-auto" onClick={() => setStep("who")}>
              Let&apos;s go
            </Button>
          </div>
        ) : step === "who" ? (
          <div className="flex flex-1 animate-rise flex-col gap-4">
            <h1 className="font-display text-3xl font-bold">What describes you best?</h1>
            {[
              { k: "heritage" as const, t: "I understand some Urdu but freeze when I speak", s: "Take a short test to find your starting point.", e: "🗣️" },
              { k: "beginner" as const, t: "I'm new to Urdu", s: "Start from the first lesson.", e: "🌱" },
            ].map((o) => (
              <button
                key={o.k}
                type="button"
                onClick={() => setKind(o.k)}
                aria-pressed={kind === o.k}
                className={`flex gap-4 rounded-3xl border-2 p-4 text-left transition ${kind === o.k ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
              >
                <span className="text-4xl" aria-hidden>
                  {o.e}
                </span>
                <span>
                  <span className="block text-lg font-bold">{o.t}</span>
                  <span className="text-sm text-ink-soft">{o.s}</span>
                </span>
              </button>
            ))}
            <Button block className="mt-auto" disabled={!kind} onClick={() => setStep("ready")}>
              Next
            </Button>
          </div>
        ) : step === "account" ? (
          <div className="flex flex-1 animate-rise flex-col gap-4">
            <h1 className="font-display text-3xl font-bold">Save your progress?</h1>
            <p className="text-ink-soft">
              Optional. Sign in to back up your progress and use it on another device. Lafz works fully without an
              account; everything stays on this phone.
            </p>
            <SignInButtons returnTo={dest === "placement" ? "/placement/" : "/"} before={save} />
            <Button block className="mt-auto" onClick={() => void finish(dest)}>
              Skip for now
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 animate-rise flex-col gap-4">
            <h1 className="font-display text-3xl font-bold">{kind === "heritage" ? "Find your level" : "Ready when you are"}</h1>
            <p className="text-ink-soft">
              {kind === "heritage"
                ? "A few quick questions find where to start. Earlier units stay open for review."
                : "Lesson 1 takes about five minutes. You can take the placement test any time."}
            </p>
            <div className="mt-auto flex flex-col gap-3">
              {kind === "heritage" ? (
                <>
                  <Button block onClick={() => choose("placement")}>
                    Take the placement test
                  </Button>
                  <Button block variant="secondary" onClick={() => choose("home")}>
                    Start lesson 1 instead
                  </Button>
                </>
              ) : (
                <>
                  <Button block onClick={() => choose("home")}>
                    Start lesson 1
                  </Button>
                  <Button block variant="ghost" onClick={() => choose("placement")}>
                    Take the placement test instead
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
