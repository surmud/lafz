"use client";
import { StoreProvider } from "@/lib/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="mx-auto min-h-dvh w-full max-w-md">{children}</div>
    </StoreProvider>
  );
}
