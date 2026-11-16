"use client";
import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/offline";
import { StoreProvider } from "@/lib/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerServiceWorker();
  }, []);
  return (
    <StoreProvider>
      <div className="mx-auto min-h-dvh w-full max-w-md">{children}</div>
    </StoreProvider>
  );
}
