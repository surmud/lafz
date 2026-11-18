"use client";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "good" | "bad";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-ink shadow-[0_4px_0_var(--primary-deep)] active:shadow-none",
  accent: "bg-accent text-[#2b1a12] shadow-[0_4px_0_var(--accent-deep)] active:shadow-none",
  good: "bg-good text-good-ink shadow-[0_4px_0_var(--good-deep)] active:shadow-none",
  bad: "bg-bad text-bad-ink shadow-[0_4px_0_var(--bad-deep)] active:shadow-none",
  secondary: "bg-surface text-ink border-2 border-line shadow-[0_3px_0_var(--line)] active:shadow-none",
  ghost: "bg-transparent text-ink-soft",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-bold tracking-wide " +
  "transition-[transform,box-shadow] active:translate-y-[3px] disabled:opacity-40 disabled:pointer-events-none " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent select-none";

export function Button({
  variant = "primary",
  block,
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; block?: boolean }) {
  return <button className={`${base} ${variants[variant]} ${block ? "w-full" : ""} ${className}`} {...rest} />;
}

export function LinkButton({
  variant = "primary",
  block,
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; block?: boolean }) {
  return <Link className={`${base} ${variants[variant]} ${block ? "w-full" : ""} ${className}`} {...rest} />;
}

export function Card({ className = "", ...rest }: ComponentProps<"div">) {
  return <div className={`rounded-3xl border-2 border-line bg-surface p-4 ${className}`} {...rest} />;
}

export function ProgressBar({ value, label, tone = "primary" }: { value: number; label: string; tone?: "primary" | "accent" | "good" }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const color = tone === "accent" ? "bg-accent" : tone === "good" ? "bg-good" : "bg-primary";
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-4 w-full overflow-hidden rounded-full bg-surface-2"
    >
      <div className={`h-full rounded-full ${color} transition-[width] duration-500 ease-out`} style={{ width: `${pct}%` }}>
        <div className="mx-2 mt-[3px] h-1 rounded-full bg-white/35" />
      </div>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "good" | "rose" | "primary" }) {
  const tones = {
    neutral: "bg-surface-2 text-ink-soft",
    accent: "bg-accent-soft text-accent-deep",
    good: "bg-good-soft text-good-deep",
    rose: "bg-rose-soft text-rose-deep",
    primary: "bg-primary-soft text-primary-deep",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

export function TopBar({ back = "/", title, right }: { back?: string | null; title?: ReactNode; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 bg-bg/90 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 backdrop-blur">
      {back !== null ? (
        <Link href={back} aria-label="Back" className="-ml-2 grid size-11 place-items-center rounded-full text-2xl text-ink-soft hover:bg-surface-2">
          ←
        </Link>
      ) : null}
      <div className="min-w-0 flex-1 truncate font-display text-xl font-bold">{title}</div>
      {right}
    </header>
  );
}

/** The decorative stripe at the top of home and onboarding. Sits below the status bar / notch. */
export function TruckStripe({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`truck-stripe mt-[env(safe-area-inset-top)] h-1.5 w-full ${className}`} />;
}
