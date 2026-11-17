"use client";
import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/offline";
import { CastProvider, type CastMember } from "@/lib/cast";
import { StoreProvider } from "@/lib/store";

export function AppProviders({ children, cast }: { children: React.ReactNode; cast: readonly CastMember[] }) {
  useEffect(() => {
    void registerServiceWorker();
  }, []);
  return (
    <StoreProvider>
      <CastProvider cast={cast}>
        <div className="mx-auto min-h-dvh w-full max-w-md">{children}</div>
      </CastProvider>
    </StoreProvider>
  );
}
