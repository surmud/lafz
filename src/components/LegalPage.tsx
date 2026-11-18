import Link from "next/link";
import type { ReactNode } from "react";
import { TopBar } from "./ui";

/** Plain prose pages: privacy, terms, account deletion, credits. */
export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <>
      <TopBar back="/me/" title={title} />
      <main className="legal flex flex-col gap-4 px-5 pb-16 text-[16px] leading-relaxed">
        {updated ? <p className="text-sm text-ink-soft">Last updated {updated}</p> : null}
        {children}
        <nav aria-label="More" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t-2 border-line pt-4 text-sm">
          <Link className="underline" href="/privacy/">Privacy</Link>
          <Link className="underline" href="/terms/">Terms</Link>
          <Link className="underline" href="/delete-account/">Delete your account</Link>
          <Link className="underline" href="/credits/">Credits</Link>
        </nav>
      </main>
    </>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-2 font-display text-xl font-bold">{children}</h2>;
}

/** How to reach the people behind Lafz: the configured address, or the public issue tracker. */
export function Contact() {
  const email = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();
  return email ? (
    <a className="underline" href={`mailto:${email}`}>
      {email}
    </a>
  ) : (
    <a className="underline" href="https://github.com/surmud/lafz/issues">
      github.com/surmud/lafz/issues
    </a>
  );
}
