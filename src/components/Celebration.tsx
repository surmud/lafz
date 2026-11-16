"use client";
import { useMemo } from "react";

/** Paper confetti in truck-art colours. Purely decorative, and off for reduced-motion users via CSS. */
export function Celebration({ pieces = 36 }: { pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: (i * 37) % 100,
        delay: ((i * 13) % 20) / 20,
        dur: 2.2 + ((i * 7) % 10) / 6,
        color: ["var(--rose)", "var(--accent)", "var(--primary)", "var(--good)"][i % 4],
        w: 6 + (i % 3) * 3,
      })),
    [pieces],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${b.left}%`,
            width: b.w,
            height: b.w * 1.6,
            background: b.color,
            animation: `confetti-fall ${b.dur}s ease-in ${b.delay}s 1 both`,
          }}
        />
      ))}
    </div>
  );
}
