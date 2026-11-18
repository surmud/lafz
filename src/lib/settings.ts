"use client";
import { useSyncExternalStore } from "react";

/** Small per-device preferences in localStorage. Progress lives in IndexedDB. */
export type ScriptMode = "roman" | "both" | "urdu";
/** The two halves of the app: speaking and listening, or reading the script. */
export type Mode = "speak" | "read";
export type Theme = "light" | "dark" | "system";

export interface Settings {
  script: ScriptMode;
  theme: Theme;
  sound: boolean;
  slowFirst: boolean;
  mode: Mode;
  /** Hard mode: type the answer instead of choosing it wherever that works. */
  hard: boolean;
  /** null: the daily streak. A number: practise that many days a week instead. */
  weeklyGoal: number | null;
}

const KEY = "lafz.settings";
const defaults: Settings = { script: "both", theme: "system", sound: true, slowFirst: false, mode: "speak", hard: false, weeklyGoal: null };

let cache: Settings | null = null;
const listeners = new Set<() => void>();

function read(): Settings {
  if (cache) return cache;
  try {
    cache = { ...defaults, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<Settings>) };
  } catch {
    cache = defaults;
  }
  return cache;
}

export function applyTheme(theme: Theme) {
  const t =
    theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = t;
  try {
    if (theme === "system") localStorage.removeItem("lafz.theme");
    else localStorage.setItem("lafz.theme", theme);
  } catch {
    /* private mode */
  }
}

export function setSettings(patch: Partial<Settings>) {
  cache = { ...read(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* private mode */
  }
  if (patch.theme) applyTheme(patch.theme);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, read, () => defaults);
}
