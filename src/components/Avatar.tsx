import type { Character } from "@/content/schema";

const ring = {
  primary: "bg-primary-soft border-primary",
  accent: "bg-accent-soft border-accent",
  rose: "bg-rose-soft border-rose",
  good: "bg-good-soft border-good",
};

/** Character portrait: an original badge, no third-party art. */
export function Avatar({
  character,
  size = "md",
  talking,
}: {
  character: Pick<Character, "emoji" | "color" | "name">;
  size?: "sm" | "md" | "lg";
  talking?: boolean;
}) {
  const dims = size === "lg" ? "size-24 text-5xl" : size === "sm" ? "size-10 text-xl" : "size-14 text-3xl";
  return (
    <div
      role="img"
      aria-label={character.name}
      className={`${dims} ${ring[character.color]} relative grid shrink-0 place-items-center rounded-full border-[3px] ${talking ? "animate-float" : ""}`}
    >
      <span aria-hidden>{character.emoji}</span>
    </div>
  );
}
