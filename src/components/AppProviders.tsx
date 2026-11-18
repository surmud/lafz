"use client";
import { useEffect } from "react";
import { initNative } from "@/lib/native";
import { registerServiceWorker } from "@/lib/offline";
import { CastProvider, type CastMember } from "@/lib/cast";
import { StoreProvider } from "@/lib/store";
import { AccountProvider } from "@/lib/useAccount";

export function AppProviders({ children, cast }: { children: React.ReactNode; cast: readonly CastMember[] }) {
  useEffect(() => {
    void registerServiceWorker();
    void initNative();
  }, []);
  return (
    <StoreProvider>
      <AccountProvider>
        <CastProvider cast={cast}>
          <div className="mx-auto min-h-dvh w-full max-w-md">{children}</div>
        </CastProvider>
      </AccountProvider>
    </StoreProvider>
  );
}
