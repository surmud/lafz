"use client";
import { createContext, useContext } from "react";
import type { Character } from "@/content/schema";

export type CastMember = Pick<Character, "id" | "name" | "emoji" | "color">;
const CastContext = createContext<readonly CastMember[]>([]);

export function CastProvider({ cast, children }: { cast: readonly CastMember[]; children: React.ReactNode }) {
  return <CastContext.Provider value={cast}>{children}</CastContext.Provider>;
}

/** The recurring characters, available everywhere (scenes inside lessons need their faces). */
export function useCast(): (id: string) => CastMember {
  const cast = useContext(CastContext);
  return (id) => cast.find((c) => c.id === id) ?? { id, name: id, emoji: "🙂", color: "primary" };
}
