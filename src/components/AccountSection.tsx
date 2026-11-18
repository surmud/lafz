"use client";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "@/lib/useAccount";
import { Button } from "./ui";

export function SignInButtons({ returnTo, before }: { returnTo?: string; before?: () => Promise<unknown> }) {
  const { signIn, appleEnabled } = useAccount();
  const [busy, setBusy] = useState(false);
  const go = (p: "google" | "apple") => {
    setBusy(true);
    void (before ? before() : Promise.resolve())
      .then(() => signIn(p, returnTo))
      .catch(() => setBusy(false));
  };
  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" block disabled={busy} onClick={() => go("google")}>
        <span aria-hidden className="font-black">G</span> Sign in with Google
      </Button>
      {appleEnabled ? (
        <Button variant="secondary" block disabled={busy} onClick={() => go("apple")}>
          <span aria-hidden></span> Sign in with Apple
        </Button>
      ) : null}
    </div>
  );
}

/** Me page: sign in / out, sync status, delete account. Hidden entirely when accounts aren't configured. */
export function AccountSection() {
  const { enabled, user, status, signOut, deleteAccount } = useAccount();
  const [confirm, setConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  if (!enabled) return null;
  return (
    <section aria-labelledby="account" className="flex flex-col gap-3">
      <h2 id="account" className="font-display text-xl font-bold">
        Account
      </h2>
      {deleted ? <p role="status" className="rounded-2xl bg-good-soft p-3">Your account and its saved progress have been deleted.</p> : null}
      {user ? (
        <>
          <p className="text-[15px]">
            Signed in as <strong>{user.email ?? "you"}</strong>.{" "}
            {status === "syncing" ? "Syncing…" : status === "error" ? "Sync is having trouble; your progress is safe on this device." : "Progress is backed up."}
          </p>
          <p className="text-sm text-ink-soft">Voice recordings stay on this device and are never uploaded.</p>
          <Button variant="secondary" onClick={() => void signOut()}>
            Sign out
          </Button>
          {confirm ? (
            <div role="alertdialog" aria-labelledby="del-title" className="rounded-2xl border-2 border-bad p-4">
              <p id="del-title" className="font-bold">Delete your account and the progress saved with it?</p>
              <p className="mt-1 text-sm text-ink-soft">
                This can&apos;t be undone. Progress on this device stays unless you also erase it under Your data.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="bad"
                  onClick={() =>
                    void deleteAccount().then(() => {
                      setConfirm(false);
                      setDeleted(true);
                    })
                  }
                >
                  Delete for good
                </Button>
                <Button variant="ghost" onClick={() => setConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button type="button" className="min-h-11 self-start text-sm font-bold text-bad-ink underline" onClick={() => setConfirm(true)}>
              Delete account and data
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-[15px] text-ink-soft">
            Optional. Sign in to back up your progress and carry it between devices. Lafz works fully without an account.
          </p>
          <SignInButtons returnTo="/me/" />
          <Link href="/privacy/" className="text-sm text-ink-soft underline">
            What gets saved
          </Link>
        </>
      )}
    </section>
  );
}
