"use client";
import { useEffect, useRef, useState } from "react";
import type { ResolvedTrace } from "@/engine/exercises";
import type { ExerciseProps } from "./types";

/**
 * Trace a letter on a canvas over a faint guide. Scored loosely: we measure how much of the
 * guide's ink the learner covered and how much they drew outside it.
 */
export function TraceExercise({ ex, locked, onSubmit }: ExerciseProps<ResolvedTrace>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const guide = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [strokes, setStrokes] = useState(0);
  const SIZE = 300;

  useEffect(() => {
    const g = document.createElement("canvas");
    g.width = SIZE;
    g.height = SIZE;
    const gc = g.getContext("2d");
    const draw = () => {
      if (!gc) return;
      gc.clearRect(0, 0, SIZE, SIZE);
      gc.fillStyle = "#000";
      gc.textAlign = "center";
      gc.textBaseline = "middle";
      gc.font = `${ex.glyph.length > 2 ? 110 : 190}px "Noto Nastaliq Urdu"`;
      gc.fillText(ex.glyph, SIZE / 2, SIZE / 2 + 10);
      guide.current = g;
      const c = canvas.current?.getContext("2d");
      if (c) {
        c.clearRect(0, 0, SIZE, SIZE);
        c.globalAlpha = 0.18;
        c.drawImage(g, 0, 0);
        c.globalAlpha = 1;
      }
    };
    void document.fonts.load(`100px "Noto Nastaliq Urdu"`, ex.glyph).then(draw, draw);
  }, [ex.glyph]);

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };

  const score = () => {
    const c = canvas.current?.getContext("2d");
    const g = guide.current?.getContext("2d");
    if (!c || !g) return 0;
    const user = c.getImageData(0, 0, SIZE, SIZE).data;
    const ref = g.getImageData(0, 0, SIZE, SIZE).data;
    let inside = 0;
    let ink = 0;
    let drawn = 0;
    for (let i = 3; i < user.length; i += 16) {
      const isGuide = (ref[i] ?? 0) > 80;
      const isUser = (user[i - 1] ?? 0) > 150 && (user[i] ?? 0) > 200; // our stroke colour has a strong blue channel
      if (isGuide) ink++;
      if (isUser) {
        drawn++;
        if (isGuide) inside++;
      }
    }
    if (ink === 0 || drawn === 0) return 0;
    return Math.min(1, (inside / ink) * 2.2) * (inside / drawn > 0.25 ? 1 : 0.5);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="self-start font-display text-2xl font-bold">Trace: {ex.label}</h2>
      <p className="self-start -mt-2 text-sm text-ink-soft">Follow the shape with your finger. Right to left, top to bottom. Wobbly is fine.</p>
      <canvas
        ref={canvas}
        width={SIZE}
        height={SIZE}
        aria-label={`Tracing area for ${ex.label}`}
        className="aspect-square w-full max-w-[300px] touch-none rounded-3xl border-2 border-line bg-surface"
        onPointerDown={(e) => {
          if (locked) return;
          drawing.current = true;
          const c = canvas.current!.getContext("2d")!;
          const p = pos(e);
          c.strokeStyle = "rgb(15,122,240)";
          c.lineWidth = 16;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.beginPath();
          c.moveTo(p.x, p.y);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const c = canvas.current!.getContext("2d")!;
          const p = pos(e);
          c.lineTo(p.x, p.y);
          c.stroke();
        }}
        onPointerUp={() => {
          if (drawing.current) setStrokes((s) => s + 1);
          drawing.current = false;
        }}
      />
      <div className="flex gap-3">
        <button
          type="button"
          disabled={locked}
          className="min-h-11 rounded-full border-2 border-line px-4 text-sm font-bold text-ink-soft"
          onClick={() => {
            const c = canvas.current?.getContext("2d");
            if (c && guide.current) {
              c.clearRect(0, 0, SIZE, SIZE);
              c.globalAlpha = 0.18;
              c.drawImage(guide.current, 0, 0);
              c.globalAlpha = 1;
            }
            setStrokes(0);
          }}
        >
          Clear
        </button>
        <button
          type="button"
          disabled={locked || strokes === 0}
          className="min-h-11 rounded-full bg-primary px-5 text-sm font-bold text-primary-ink disabled:opacity-40"
          onClick={() => {
            const s = score();
            onSubmit(
              s >= 0.45
                ? { verdict: "correct", feedback: "Beautiful. Calligraphers weep." }
                : { verdict: "almost", feedback: "Counted! Try to stay closer to the grey shape next time." },
            );
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
