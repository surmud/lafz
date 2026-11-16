"use client";
/**
 * On-device speech recognition fallback (G9) for browsers without the Web Speech API.
 * transformers.js and the Whisper model are fetched only when the learner opts in: ~80 MB once,
 * then cached by the browser. Nothing is sent anywhere: recognition runs on the phone.
 */
const LIB = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2";
const MODEL = "onnx-community/whisper-base";
const READY_KEY = "lafz.whisper.ready";

type Transcriber = (audio: Float32Array, opts: Record<string, unknown>) => Promise<{ text: string } | { text: string }[]>;

let loading: Promise<Transcriber> | null = null;

export function whisperCached(): boolean {
  try {
    return localStorage.getItem(READY_KEY) === "1";
  } catch {
    return false;
  }
}

export function canRecord(): boolean {
  return typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

export function loadWhisper(onProgress?: (pct: number) => void): Promise<Transcriber> {
  loading ??= (async () => {
    // Bypass the bundler: this module is only ever loaded at runtime, on request.
    const mod = await (new Function("u", "return import(u)") as (u: string) => Promise<Record<string, unknown>>)(LIB);
    const env = mod.env as { allowLocalModels: boolean };
    env.allowLocalModels = false;
    const files = new Map<string, number>();
    const pipeline = mod.pipeline as (task: string, model: string, opts: Record<string, unknown>) => Promise<Transcriber>;
    const asr = await pipeline("automatic-speech-recognition", MODEL, {
      dtype: { encoder_model: "q8", decoder_model_merged: "q8" },
      progress_callback: (e: { status: string; file?: string; progress?: number }) => {
        if (e.status === "progress" && e.file) {
          files.set(e.file, e.progress ?? 0);
          const all = [...files.values()];
          onProgress?.(Math.round(all.reduce((a, b) => a + b, 0) / all.length));
        }
      },
    });
    try {
      localStorage.setItem(READY_KEY, "1");
    } catch {
      /* ignore */
    }
    return asr;
  })();
  loading.catch(() => {
    loading = null;
  });
  return loading;
}

/** Record from the microphone until stop() (or maxMs), then return 16 kHz mono samples. */
export function record(maxMs = 6000): { stop: () => void; result: Promise<Float32Array> } {
  let stopFn = () => undefined as void;
  const result = (async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    const done = new Promise<void>((resolve) => (rec.onstop = () => resolve()));
    rec.start();
    stopFn = () => rec.state === "recording" && rec.stop();
    const timer = setTimeout(stopFn, maxMs);
    await done;
    clearTimeout(timer);
    stream.getTracks().forEach((t) => t.stop());
    const buf = await new Blob(chunks, { type: rec.mimeType }).arrayBuffer();
    const ctx = new AudioContext();
    const decoded = await ctx.decodeAudioData(buf);
    await ctx.close();
    const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
    const src = off.createBufferSource();
    src.buffer = decoded;
    src.connect(off.destination);
    src.start();
    return (await off.startRendering()).getChannelData(0);
  })();
  return { stop: () => stopFn(), result };
}

export async function transcribeUrdu(audio: Float32Array): Promise<string> {
  const asr = await loadWhisper();
  const out = await asr(audio, { language: "urdu", task: "transcribe" });
  return (Array.isArray(out) ? out[0]?.text : out.text)?.trim() ?? "";
}
