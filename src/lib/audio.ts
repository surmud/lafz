"use client";
import { audioKey, type Rate } from "@/content/audio-key";
import { getRecording } from "@/storage/db";

/**
 * Plays a phrase. Family-voice recordings always win over TTS (SPEC §9). TTS clips are found by
 * hashing voice|rate|text exactly like scripts/generate_audio.py, so no manifest is shipped.
 * If a clip is missing, fall back to the device's own Urdu voice if it has one.
 */
export const BASE = "/lafz";

async function sha16(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function clipUrl(p: { urdu: string; tts?: string }, rate: Rate): Promise<string> {
  return `${BASE}/audio/${await sha16(audioKey(p, rate))}.mp3`;
}

let current: HTMLAudioElement | null = null;
let currentUrl: string | null = null;

export function stopAudio() {
  current?.pause();
  current = null;
  if (currentUrl?.startsWith("blob:")) URL.revokeObjectURL(currentUrl);
  currentUrl = null;
}

export type Speed = "normal" | "slow" | "aunty";

export async function playPhrase(
  p: { id: string; urdu: string; tts?: string },
  speed: Speed = "normal",
): Promise<"family" | "tts" | "device" | "none"> {
  stopAudio();
  let source: "family" | "tts" = "tts";
  let url: string;
  const rec = await getRecording(p.id).catch(() => undefined);
  if (rec) {
    url = URL.createObjectURL(rec.blob);
    source = "family";
  } else {
    url = await clipUrl(p, speed === "slow" ? "slow" : "normal");
  }
  const el = new Audio(url);
  if (speed === "aunty") {
    el.playbackRate = 1.45;
    el.preservesPitch = true;
  }
  if (speed === "slow" && source === "family") el.playbackRate = 0.75;
  current = el;
  currentUrl = url;
  try {
    await el.play();
    return source;
  } catch {
    return speakWithDevice(p.urdu) ? "device" : "none";
  }
}

function speakWithDevice(text: string): boolean {
  if (typeof speechSynthesis === "undefined") return false;
  const voice = speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("ur"));
  if (!voice) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  speechSynthesis.speak(u);
  return true;
}

/** Tiny synthesized feedback sounds, so there are no extra files to download. */
let ctx: AudioContext | null = null;
export function blip(kind: "right" | "wrong" | "done") {
  try {
    ctx ??= new AudioContext();
    const notes = kind === "right" ? [660, 990] : kind === "wrong" ? [330, 247] : [523, 659, 784, 1046];
    notes.forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = kind === "wrong" ? "triangle" : "sine";
      o.frequency.value = f;
      const t = ctx!.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx!.destination);
      o.start(t);
      o.stop(t + 0.2);
    });
  } catch {
    /* no audio */
  }
}
