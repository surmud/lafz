"use client";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { mergeProgress } from "@/engine/merge";
import { migrate, type Progress } from "@/engine/progress";
import { accountsEnabled, config } from "./config";

/**
 * Optional accounts (Supabase Auth). Local-first: the app works fully signed out; signing in only
 * adds a cloud copy of progress. supabase-js is loaded on demand, so it costs nothing until used.
 */
export type Provider = "google" | "apple";

/** The slice of the Supabase client this module uses, so tests can pass a fake. */
export interface Backend {
  getUser(): Promise<User | null>;
  signIn(provider: Provider, redirectTo: string): Promise<void>;
  signOut(): Promise<void>;
  pull(userId: string): Promise<Progress | null>;
  push(userId: string, p: Progress): Promise<void>;
  deleteAccount(): Promise<void>;
  onChange(cb: (user: User | null) => void): () => void;
}

let backend: Promise<Backend> | null = null;

export function setBackendForTests(b: Backend | null) {
  backend = b ? Promise.resolve(b) : null;
}

export function getBackend(): Promise<Backend> | null {
  if (backend) return backend;
  if (!accountsEnabled()) return null;
  backend = import("@supabase/supabase-js").then(({ createClient }) => fromClient(createClient(config.supabaseUrl, config.supabaseAnonKey, { auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true } })));
  return backend;
}

export function fromClient(sb: SupabaseClient): Backend {
  return {
    async getUser() {
      const { data } = await sb.auth.getSession();
      return data.session?.user ?? null;
    },
    async signIn(provider, redirectTo) {
      const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
    },
    async signOut() {
      await sb.auth.signOut();
    },
    async pull(userId) {
      const { data, error } = await sb.from("user_progress").select("progress").eq("user_id", userId).maybeSingle();
      if (error) throw error;
      return data ? migrate(data.progress) : null;
    },
    async push(userId, p) {
      const { error } = await sb.from("user_progress").upsert({ user_id: userId, progress: p, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async deleteAccount() {
      const { error } = await sb.rpc("delete_my_account");
      if (error) throw error;
      await sb.auth.signOut();
    },
    onChange(cb) {
      const { data } = sb.auth.onAuthStateChange((_e, session) => cb(session?.user ?? null));
      return () => data.subscription.unsubscribe();
    },
  };
}

/** After sign-in: merge the cloud copy into this device's progress and write the result back. */
export async function syncOnLogin(b: Backend, userId: string, local: Progress): Promise<Progress> {
  const remote = await b.pull(userId);
  const merged = remote ? mergeProgress(local, remote) : local;
  await b.push(userId, merged);
  return merged;
}

/** Where OAuth comes back to. */
export function callbackUrl(): string {
  return `${location.origin}${config.native ? "" : "/lafz"}/auth/`;
}
