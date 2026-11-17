"use client";
/**
 * On-device sentence embeddings for the phrase finder. transformers.js and the model (about 23 MB)
 * are fetched only when the learner asks for the smart search, then cached by the browser. The
 * query never leaves the device.
 */
const LIB = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2";
const MODEL = "Xenova/all-MiniLM-L6-v2";
const READY_KEY = "lafz.embed.ready";

type Extractor = (text: string, opts: Record<string, unknown>) => Promise<{ data: Float32Array }>;
let loading: Promise<Extractor> | null = null;

export function embedCached(): boolean {
  try {
    return localStorage.getItem(READY_KEY) === "1";
  } catch {
    return false;
  }
}

export function loadEmbedder(onProgress?: (pct: number) => void): Promise<Extractor> {
  loading ??= (async () => {
    const mod = await (new Function("u", "return import(u)") as (u: string) => Promise<Record<string, unknown>>)(LIB);
    (mod.env as { allowLocalModels: boolean }).allowLocalModels = false;
    const pipeline = mod.pipeline as (task: string, model: string, opts: Record<string, unknown>) => Promise<Extractor>;
    const fx = await pipeline("feature-extraction", MODEL, {
      dtype: "q8",
      progress_callback: (e: { status: string; file?: string; progress?: number }) => {
        if (e.status === "progress" && e.file?.endsWith(".onnx")) onProgress?.(Math.round(e.progress ?? 0));
      },
    });
    try {
      localStorage.setItem(READY_KEY, "1");
    } catch {
      /* ignore */
    }
    return fx;
  })();
  loading.catch(() => {
    loading = null;
  });
  return loading;
}

export async function embed(text: string): Promise<Float32Array> {
  const fx = await loadEmbedder();
  return (await fx(text, { pooling: "mean", normalize: true })).data;
}
