"use client";
import type { Snapshot } from "@/engine/skills";

/**
 * Optional anonymous statistics. Nothing is sent unless BOTH are true:
 *   1. the build was given an endpoint (NEXT_PUBLIC_TELEMETRY_URL), and
 *   2. the learner switched sharing on (Insights page).
 * What is sent is the Snapshot the learner can read on that page (counts and rates, no names, no
 * text, no recordings), a random install id, and a short list of event names with timestamps.
 */
/** The App Store build collects nothing ("Data Not Collected"), so statistics are web-only. */
export const ENDPOINT: string = process.env.NEXT_PUBLIC_NATIVE === "1" ? "" : (process.env.NEXT_PUBLIC_TELEMETRY_URL ?? "");
const KEY = "lafz.telemetry";
const MAX_EVENTS = 100;

export interface TelemetryEvent {
  /** Seconds since the epoch. */
  t: number;
  /** lesson, boss, placement, review, open… */
  e: string;
  /** Lesson or unit id, when relevant. */
  id?: string;
  /** Share of first-try answers that were right, 0..1. */
  acc?: number;
  secs?: number;
}

interface State {
  install: string;
  share: boolean;
  events: TelemetryEvent[];
  lastSent: number;
}

function load(): State {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<State> | null;
    if (raw?.install) return { install: raw.install, share: raw.share === true, events: raw.events ?? [], lastSent: raw.lastSent ?? 0 };
  } catch {
    /* fall through */
  }
  return { install: crypto.randomUUID(), share: false, events: [], lastSent: 0 };
}

function save(s: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
}

export const telemetryAvailable = (): boolean => ENDPOINT !== "";
export const sharing = (): boolean => typeof localStorage !== "undefined" && load().share;

export function setSharing(on: boolean) {
  const s = load();
  save({ ...s, share: on, events: on ? s.events : [] });
}

/** Note that something happened. Kept on the device; only ever sent if sharing is on. */
export function track(e: TelemetryEvent["e"], extra: Omit<TelemetryEvent, "t" | "e"> = {}) {
  if (typeof localStorage === "undefined") return;
  const s = load();
  const events = [...s.events, { t: Math.round(Date.now() / 1000), e, ...extra }].slice(-MAX_EVENTS);
  save({ ...s, events });
}

/** Send the snapshot and queued events, at most once every few minutes. Silent on failure. */
export async function flush(snapshot: Snapshot, minGapSeconds = 300): Promise<boolean> {
  if (!telemetryAvailable() || typeof localStorage === "undefined") return false;
  const s = load();
  const now = Math.round(Date.now() / 1000);
  if (!s.share || now - s.lastSent < minGapSeconds) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ install: s.install, sent: now, snapshot, events: s.events }),
      keepalive: true,
    });
    if (!res.ok) return false;
    save({ ...load(), events: [], lastSent: now });
    return true;
  } catch {
    return false;
  }
}
