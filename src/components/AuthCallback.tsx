"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBackend } from "@/lib/account";
import { takeReturnPath } from "@/lib/useAccount";
import { LinkButton } from "./ui";

/** OAuth lands here. supabase-js exchanges the code from the URL, then we go back where we were. */
export function AuthCallback() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const b = getBackend();
    if (!b) {
      router.replace("/");
      return;
    }
    let tries = 0;
    const check = async () => {
      const user = await (await b).getUser().catch(() => null);
      if (user) router.replace(takeReturnPath());
      else if (++tries < 20) setTimeout(check, 250);
      else setFailed(true);
    };
    void check();
  }, [router]);
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      {failed ? (
        <div className="flex flex-col gap-4">
          <p className="font-display text-2xl font-bold">Sign-in didn&apos;t finish</p>
          <p className="text-ink-soft">Nothing was lost: your progress is still on this device.</p>
          <LinkButton href="/me/">Back to Me</LinkButton>
        </div>
      ) : (
        <p className="font-display text-2xl font-bold" aria-busy="true">
          Signing you in…
        </p>
      )}
    </main>
  );
}
