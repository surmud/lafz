"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { emptyProgress, type Progress } from "@/engine/progress";
import { localDay } from "@/engine/streak";
import { loadProgress, saveProgress } from "@/storage/db";

/**
 * The learner's progress, loaded from IndexedDB once and saved on every change.
 * `today()` honours a `?today=YYYY-MM-DD` override (persisted for the session) so persona tests
 * can mock the clock (Away-for-a-week Ayesha).
 */
interface Store {
  ready: boolean;
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => Promise<Progress>;
  replace: (p: Progress) => void;
}

const Ctx = createContext<Store | null>(null);

export function today(): string {
  if (typeof window !== "undefined") {
    try {
      const q = new URLSearchParams(location.search).get("today");
      if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) sessionStorage.setItem("lafz.today", q);
      const s = sessionStorage.getItem("lafz.today");
      if (s) return s;
    } catch {
      /* ignore */
    }
  }
  return localDay(new Date());
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const ref = useRef(progress);
  // Every update waits for the initial load, so an early save can never overwrite stored progress.
  const loaded = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let alive = true;
    loaded.current = loadProgress()
      .catch(() => emptyProgress)
      .then((p) => {
        ref.current = p;
        if (!alive) return;
        setProgress(p);
        setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const update = useCallback(async (fn: (p: Progress) => Progress) => {
    await loaded.current;
    const next = fn(ref.current);
    ref.current = next;
    // Persist first, then show it: anything on screen is already safely on disk.
    await saveProgress(next).catch(() => undefined);
    setProgress(next);
    return next;
  }, []);

  const replace = useCallback((p: Progress) => {
    ref.current = p;
    setProgress(p);
  }, []);

  const value = useMemo(() => ({ ready, progress, update, replace }), [ready, progress, update, replace]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}

