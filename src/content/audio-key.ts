/**
 * Audio file naming, shared by the app and scripts/generate_audio.py. A clip is keyed by
 * voice + rate + the exact text sent to TTS, so unchanged text is never re-synthesised and any
 * edit to the Nastaliq produces a new file.
 *
 * The browser cannot hash synchronously, so the generator writes public/audio/manifest.json, a map of
 * key → file name, and the app looks clips up by key.
 */
export const VOICE = "mms-urd-3";

export type Rate = "normal" | "slow";

export function ttsText(p: { urdu: string; tts?: string }): string {
  return (p.tts ?? p.urdu).normalize("NFC").trim();
}

export function audioKey(p: { urdu: string; tts?: string }, rate: Rate): string {
  return `${VOICE}|${rate}|${ttsText(p)}`;
}
