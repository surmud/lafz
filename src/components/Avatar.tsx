import type { Character } from "@/content/schema";
import { hasPortrait, Portrait } from "./Portrait";

const ring = {
  primary: "bg-primary-soft border-primary",
  accent: "bg-accent-soft border-accent",
  rose: "bg-rose-soft border-rose",
  good: "bg-good-soft border-good",
};

/** Character portrait: original SVG art, with the emoji badge as a fallback for new characters. */
export function Avatar({
  character,
  size = "md",
  talking,
}: {
  character: Pick<Character, "emoji" | "color" | "name"> & { id?: string };
  size?: "sm" | "md" | "lg";
  talking?: boolean;
}) {
  const dims = size === "lg" ? "size-24 text-5xl" : size === "sm" ? "size-10 text-xl" : "size-14 text-3xl";
  const px = size === "lg" ? 96 : size === "sm" ? 40 : 56;
  const art = character.id && hasPortrait(character.id);
  return (
    <div
      role={art ? undefined : "img"}
      aria-label={art ? undefined : character.name}
      className={`${dims} ${ring[character.color]} relative grid shrink-0 place-items-center overflow-hidden rounded-full border-[3px] ${talking ? "animate-float" : ""}`}
    >
      {art && character.id ? <Portrait id={character.id} size={px} title={character.name} /> : <span aria-hidden>{character.emoji}</span>}
    </div>
  );
}
