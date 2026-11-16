"use client";
import { useState } from "react";
import type { Phrase } from "@/content/schema";
import { askAmmiText, whatsappUrl } from "@/engine/share";
import { recordAskedFamily } from "@/engine/progress";
import { useStore } from "@/lib/store";

const SITE = "https://surmud.github.io/lafz/";

/** "Did I say this right?" — Web Share where available, otherwise a WhatsApp link. */
export function AskAmmiButton({ phrase, compact }: { phrase: Pick<Phrase, "roman" | "urdu" | "en">; compact?: boolean }) {
  const { update } = useStore();
  const [sent, setSent] = useState(false);
  const share = async () => {
    const text = askAmmiText(phrase, SITE);
    let shared = false;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text });
        shared = true;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    if (!shared) window.open(whatsappUrl(text), "_blank", "noopener");
    setSent(true);
    await update(recordAskedFamily);
  };
  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-good/50 bg-good-soft px-4 text-sm font-bold text-good-deep ${compact ? "" : "w-full justify-center"}`}
    >
      <span aria-hidden>{sent ? "💚" : "🤲"}</span>
      {sent ? "Asked! Ammi will love this" : "Ask Ammi: did I say it right?"}
    </button>
  );
}
