/**
 * Audio file naming, shared by the app and scripts/generate_audio.py. A clip is keyed by
 * voice + rate + the exact text sent to TTS, so unchanged text is never re-synthesised and any
 * edit to the Nastaliq produces a new file.
 *
 * The browser cannot hash synchronously, so the generator writes public/audio/manifest.json, a map of
 * key → file name, and the app looks clips up by key.
 */
import { pack } from "@/lang";

/** Lines spoken by these characters use the male voice; everything else uses the female one. */
export const MALE_SPEAKERS: readonly string[] = pack.voices.maleSpeakers;
export const VOICE_F = pack.voices.female;
export const VOICE_M = pack.voices.male;

export type Rate = "normal" | "slow";
export interface Speakable {
  urdu: string;
  tts?: string;
  speaker?: string;
}

export function ttsText(p: { urdu: string; tts?: string }): string {
  return (p.tts ?? p.urdu).normalize("NFC").trim();
}

export function voiceFor(speaker?: string): string {
  return speaker !== undefined && MALE_SPEAKERS.includes(speaker) ? VOICE_M : VOICE_F;
}

export function audioKey(p: Speakable, rate: Rate): string {
  return `${voiceFor(p.speaker)}|${rate}|${ttsText(p)}`;
}
