/**
 * Original character portraits, drawn from simple shapes (no third-party art). One parametric face
 * plus per-character features: dupatta, hair, glasses, moustache, cap, stethoscope, clipboard.
 */
interface Look {
  skin: string;
  hair: string;
  hairStyle: "bun" | "short" | "covered" | "bald" | "long";
  dupatta?: string;
  glasses?: boolean;
  moustache?: boolean;
  beard?: boolean;
  cap?: string;
  earrings?: boolean;
  stethoscope?: boolean;
  clipboard?: boolean;
  bindiDot?: boolean;
  shirt: string;
  mood: "smile" | "smirk" | "flat" | "grin";
}

const LOOKS: Record<string, Look> = {
  khala: { skin: "#c98b5f", hair: "#2b1a12", hairStyle: "covered", dupatta: "#c93a63", earrings: true, shirt: "#f0a315", mood: "grin" },
  nani: { skin: "#b97d55", hair: "#e9e4dc", hairStyle: "covered", dupatta: "#f4f1ea", glasses: true, shirt: "#8a6d5a", mood: "flat" },
  bilal: { skin: "#c48a60", hair: "#1d130d", hairStyle: "short", stethoscope: true, shirt: "#0f7a73", mood: "smirk" },
  "mrs-butt": { skin: "#d39a6e", hair: "#3b2416", hairStyle: "covered", dupatta: "#7a3b8f", glasses: true, clipboard: true, shirt: "#c93a63", mood: "smile" },
  ammi: { skin: "#c58858", hair: "#24170f", hairStyle: "covered", dupatta: "#2f8f46", shirt: "#f0a315", mood: "smile" },
  abbu: { skin: "#b77b52", hair: "#4a4038", hairStyle: "short", glasses: true, moustache: true, shirt: "#e6d6bd", mood: "flat" },
  pervez: { skin: "#a8704a", hair: "#1d130d", hairStyle: "short", cap: "#0f7a73", moustache: true, shirt: "#f0a315", mood: "grin" },
  bashir: { skin: "#b07a50", hair: "#2a2a2a", hairStyle: "short", cap: "#f4f1ea", beard: true, shirt: "#2f8f46", mood: "smile" },
};

export function hasPortrait(id: string): boolean {
  return id in LOOKS;
}

export function Portrait({ id, size = 56, title }: { id: string; size?: number; title: string }) {
  const l = LOOKS[id];
  if (!l) return null;
  const mouth = {
    smile: "M40 66 Q50 74 60 66",
    grin: "M38 64 Q50 78 62 64 Z",
    smirk: "M42 68 Q52 72 60 64",
    flat: "M42 68 L58 68",
  }[l.mood];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title}>
      <title>{title}</title>
      {/* shoulders */}
      <path d="M14 100 Q16 78 50 76 Q84 78 86 100 Z" fill={l.shirt} />
      {l.stethoscope ? <path d="M36 80 Q36 94 50 94 Q64 94 64 80" fill="none" stroke="#2b1a12" strokeWidth="2.5" /> : null}
      {l.stethoscope ? <circle cx="50" cy="95" r="3.5" fill="#9aa5ad" /> : null}
      {/* covered hair / dupatta behind the head */}
      {l.hairStyle === "covered" ? <path d="M22 60 Q20 22 50 18 Q80 22 78 60 L84 92 Q50 84 16 92 Z" fill={l.dupatta} /> : null}
      {/* neck + face */}
      <rect x="43" y="64" width="14" height="14" rx="4" fill={l.skin} />
      <ellipse cx="50" cy="50" rx="21" ry="24" fill={l.skin} />
      {/* hair */}
      {l.hairStyle === "short" ? <path d="M29 46 Q28 24 50 24 Q72 24 71 46 Q66 32 50 32 Q34 32 29 46 Z" fill={l.hair} /> : null}
      {l.hairStyle === "covered" ? <path d="M30 44 Q32 28 50 27 Q68 28 70 44 Q60 34 50 34 Q40 34 30 44 Z" fill={l.hair} /> : null}
      {l.hairStyle === "covered" ? <path d="M27 48 Q26 22 50 20 Q74 22 73 48 Q70 30 50 28 Q30 30 27 48 Z" fill={l.dupatta} opacity="0.95" /> : null}
      {l.cap ? <path d="M28 38 Q30 22 50 22 Q70 22 72 38 Z" fill={l.cap} /> : null}
      {/* eyes */}
      <circle cx="42" cy="50" r="2.6" fill="#1d130d" />
      <circle cx="58" cy="50" r="2.6" fill="#1d130d" />
      <path d="M37 44 Q42 41 46 44" stroke="#1d130d" strokeWidth="1.6" fill="none" />
      <path d={l.mood === "flat" ? "M54 43 Q58 43 63 44" : "M54 44 Q58 41 63 44"} stroke="#1d130d" strokeWidth="1.6" fill="none" />
      {l.glasses ? (
        <g fill="none" stroke="#2b1a12" strokeWidth="1.8">
          <circle cx="42" cy="50" r="6.5" />
          <circle cx="58" cy="50" r="6.5" />
          <path d="M48.5 50 L51.5 50" />
        </g>
      ) : null}
      {/* nose */}
      <path d="M50 52 Q48 58 51 59" stroke="#00000033" strokeWidth="1.6" fill="none" />
      {/* mouth */}
      <path d={mouth} stroke="#7a2e1f" strokeWidth="2" fill={l.mood === "grin" ? "#fff" : "none"} strokeLinecap="round" />
      {l.moustache ? <path d="M41 63 Q50 58 59 63 Q50 61 41 63 Z" fill={l.hair} /> : null}
      {l.beard ? <path d="M30 54 Q32 78 50 80 Q68 78 70 54 Q66 70 50 72 Q34 70 30 54 Z" fill={l.hair} /> : null}
      {l.earrings ? (
        <g fill="#f0a315">
          <circle cx="29" cy="60" r="3" />
          <circle cx="71" cy="60" r="3" />
        </g>
      ) : null}
      {l.clipboard ? (
        <g>
          <rect x="66" y="74" width="20" height="24" rx="2" fill="#f4e9d6" stroke="#2b1a12" strokeWidth="1.5" />
          <path d="M70 82 H82 M70 87 H82 M70 92 H78" stroke="#2b1a12" strokeWidth="1.2" />
        </g>
      ) : null}
    </svg>
  );
}
