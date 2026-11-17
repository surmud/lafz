/**
 * Future hooks (SPEC §11): interfaces only, so later tiers plug in without touching the app.
 * The free MVP implements `TtsProvider` with pre-generated MMS clips and `ConversationEngine` with
 * scripted graphs (src/engine/conversation.ts). Nothing here talks to a server.
 */
import type { Phrase } from "@/content/schema";
import type { Progress } from "./progress";

export type { ConversationEngine } from "./conversation";

/** Where a phrase's audio comes from. MMS today; Azure ur-PK before any paid tier; family voice always wins. */
export interface TtsProvider {
  readonly id: "mms" | "azure" | "browser";
  /** URL (or blob URL) for a phrase at a given speed, or null if this provider can't voice it. */
  clipFor(phrase: Pick<Phrase, "urdu" | "tts">, rate: "normal" | "slow"): Promise<string | null>;
}

/** Accounts and sync across devices. Not built: the MVP is device-only with export/import. */
export interface SyncProvider {
  readonly id: string;
  pull(): Promise<Progress | null>;
  push(progress: Progress): Promise<void>;
}

/** What a learner is entitled to. The free tier is everything that exists today, forever. */
export interface Entitlements {
  /** Core course, packs, reading, family features: always true. */
  readonly core: true;
  /** A future paid AI conversation tier. */
  readonly aiConversations: boolean;
}

export const FREE: Entitlements = { core: true, aiConversations: false };
