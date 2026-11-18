"use client";
/** "Download unit for offline": caches a unit's pages and every audio clip it uses. */
const AUDIO_CACHE = "lafz-audio-v1";

import { BASE } from "./base";
import { config } from "./config";

/** The native app bundles every page and clip, so it needs no service worker or downloads. */
export function offlineSupported(): boolean {
  return !config.native && typeof window !== "undefined" && "caches" in window && "serviceWorker" in navigator;
}

export async function registerServiceWorker() {
  if (!offlineSupported() || location.hostname === "localhost" && !localStorage.getItem("lafz.sw")) return;
  try {
    await navigator.serviceWorker.register(`${BASE}/sw.js`, { scope: `${BASE}/` });
  } catch {
    /* offline support is best-effort */
  }
}

interface OfflineList {
  audio: string[];
  pages: string[];
}

async function list(unitId: string): Promise<OfflineList> {
  const res = await fetch(`${BASE}/offline/${unitId}.json`);
  if (!res.ok) throw new Error("missing list");
  return (await res.json()) as OfflineList;
}

export async function isUnitDownloaded(unitId: string): Promise<boolean> {
  if (!offlineSupported()) return false;
  try {
    const l = await list(unitId);
    const cache = await caches.open(AUDIO_CACHE);
    const hits = await Promise.all(l.audio.slice(0, 6).map((u) => cache.match(u)));
    return hits.every(Boolean);
  } catch {
    return false;
  }
}

export async function downloadUnit(unitId: string, onProgress: (done: number, total: number) => void): Promise<void> {
  const l = await list(unitId);
  const audio = await caches.open(AUDIO_CACHE);
  const keys = await caches.keys();
  const shell = await caches.open(keys.find((k) => k.startsWith("lafz-shell-")) ?? "lafz-shell-extra");
  // Pages are stored by path, exactly as the service worker looks them up.
  const all = [...l.pages.map((u) => [shell, u] as const), ...l.audio.map((u) => [audio, u] as const)];
  let done = 0;
  const queue = [...all];
  const worker = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const [cache, url] = item;
      try {
        if (!(await cache.match(url))) await cache.add(url);
      } catch {
        /* skip a missing clip rather than fail the whole download */
      }
      onProgress(++done, all.length);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
}
