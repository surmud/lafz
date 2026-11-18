"use client";
import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { callbackUrl, getBackend, syncOnLogin, type Provider } from "./account";
import { accountsEnabled, config } from "./config";
import { useStore } from "./store";

interface Account {
  enabled: boolean;
  appleEnabled: boolean;
  user: User | null;
  /** "synced" once this device's progress and the cloud copy have been merged. */
  status: "idle" | "syncing" | "synced" | "error";
  signIn: (provider: Provider, returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const Ctx = createContext<Account | null>(null);
const RETURN_KEY = "lafz.afterAuth";

/** Mounted once in AppProviders. Does nothing at all unless accounts are configured. */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const enabled = accountsEnabled();
  const { ready, progress, update } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Account["status"]>("idle");
  const merged = useRef<string | null>(null);

  useEffect(() => {
    const b = getBackend();
    if (!b) return;
    let off = () => {};
    void b.then((be) => {
      void be.getUser().then(setUser);
      off = be.onChange(setUser);
    });
    return () => off();
  }, []);

  // On sign-in: merge once per user per session.
  useEffect(() => {
    const b = getBackend();
    if (!b || !user || !ready || merged.current === user.id) return;
    merged.current = user.id;
    queueMicrotask(() => setStatus("syncing"));
    void b
      .then((be) => syncOnLogin(be, user.id, progress))
      .then((m) => update(() => m))
      .then(() => setStatus("synced"))
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, ready]);

  // After that, push changes a few seconds after they happen.
  useEffect(() => {
    const b = getBackend();
    if (!b || !user || status !== "synced") return;
    const t = setTimeout(() => void b.then((be) => be.push(user.id, progress)).catch(() => setStatus("error")), 3000);
    return () => clearTimeout(t);
  }, [progress, user, status]);

  const signIn = useCallback(async (provider: Provider, returnTo = "/me/") => {
    const b = getBackend();
    if (!b) return;
    try {
      localStorage.setItem(RETURN_KEY, returnTo);
    } catch {
      /* ignore */
    }
    await (await b).signIn(provider, callbackUrl());
  }, []);
  const signOut = useCallback(async () => {
    const b = getBackend();
    if (b) await (await b).signOut();
    merged.current = null;
    setUser(null);
    setStatus("idle");
  }, []);
  const deleteAccount = useCallback(async () => {
    const b = getBackend();
    if (b) await (await b).deleteAccount();
    merged.current = null;
    setUser(null);
    setStatus("idle");
  }, []);

  const value = useMemo(
    () => ({ enabled, appleEnabled: enabled && config.appleSignIn, user, status, signIn, signOut, deleteAccount }),
    [enabled, user, status, signIn, signOut, deleteAccount],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount(): Account {
  const a = useContext(Ctx);
  if (!a) throw new Error("useAccount outside AccountProvider");
  return a;
}

export function takeReturnPath(): string {
  try {
    const r = localStorage.getItem(RETURN_KEY);
    localStorage.removeItem(RETURN_KEY);
    return r && r.startsWith("/") ? r : "/me/";
  } catch {
    return "/me/";
  }
}
