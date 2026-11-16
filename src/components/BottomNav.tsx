"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Learn", icon: "🏠" },
  { href: "/read/", label: "Read", icon: "📜" },
  { href: "/family/", label: "Family", icon: "🌳" },
  { href: "/me/", label: "Me", icon: "✨" },
];

export function BottomNav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, "")));
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t-2 border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid grid-cols-4">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              aria-current={active(it.href) ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${active(it.href) ? "text-primary" : "text-ink-soft"}`}
            >
              <span aria-hidden className={`text-2xl transition ${active(it.href) ? "scale-110" : "grayscale-[60%]"}`}>
                {it.icon}
              </span>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
