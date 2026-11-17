"use client";
import { useEffect, useState } from "react";
import type { Phrase } from "@/content/schema";
import { askAmmiText, whatsappUrl } from "@/engine/share";
import { recordAskedFamily } from "@/engine/progress";
import { useStore } from "@/lib/store";

const SITE = "https://surmud.github.io/lafz/";

function canShareFiles(): boolean {
  try {
    const f = new File([new Blob(["x"], { type: "audio/webm" })], "x.webm", { type: "audio/webm" });
    return typeof navigator !== "undefined" && !!navigator.canShare?.({ files: [f] });
  } catch {
    return false;
  }
}

/**
 * "Did I say this right?" (SPEC §10). Shares the phrase via Web Share or WhatsApp; where the device
 * can share files, the learner can record themselves first and send the clip with it.
 */
export function AskAmmiButton({ phrase, compact }: { phrase: Pick<Phrase, "roman" | "urdu" | "en">; compact?: boolean }) {
  const { update } = useStore();
  const [sent, setSent] = useState(false);
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const text = askAmmiText(phrase, SITE);
  // Decided after mount: the server can't know, and a mismatch would break hydration.
  const [files, setFiles] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setFiles(canShareFiles()));
  }, []);

  const done = async () => {
    setSent(true);
    await update(recordAskedFamily);
  };

  const shareText = async () => {
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
    await done();
  };

  const recordAndShare = async () => {
    if (rec) {
      rec.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRec(null);
        const type = r.mimeType || "audio/webm";
        const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        const file = new File([new Blob(chunks, { type })], `my-urdu.${ext}`, { type });
        try {
          await navigator.share({ text, files: [file] });
          await done();
        } catch (e) {
          if ((e as Error).name !== "AbortError") await shareText();
        }
      };
      r.start();
      setRec(r);
      setTimeout(() => r.state === "recording" && r.stop(), 8000);
    } catch {
      await shareText();
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "w-full"}`}>
      <button
        type="button"
        onClick={shareText}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-good/50 bg-good-soft px-4 text-sm font-bold text-good-deep ${compact ? "" : "flex-1 justify-center"}`}
      >
        <span aria-hidden>{sent ? "💚" : "🤲"}</span>
        {sent ? "Asked! Ammi will love this" : "Ask Ammi: did I say it right?"}
      </button>
      {files ? (
        <button
          type="button"
          onClick={recordAndShare}
          aria-label={rec ? "Stop and send my recording" : "Record myself and send it to family"}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold ${rec ? "animate-pulse bg-bad text-bad-ink" : "bg-rose text-rose-ink"}`}
        >
          {rec ? "■ Send" : "🎙️ Send my voice"}
        </button>
      ) : null}
    </div>
  );
}
