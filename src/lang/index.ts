import type { LanguagePack } from "./types";
import { ur } from "./ur";

export type { LanguagePack } from "./types";

/** Every pack the build knows about. One active pack per build, chosen by NEXT_PUBLIC_LANG. */
export const packs: Record<string, LanguagePack> = { ur };

export const pack: LanguagePack = packs[process.env.NEXT_PUBLIC_LANG ?? "ur"] ?? ur;
