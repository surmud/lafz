/**
 * Tap-a-word for stories: split a Roman line into tokens and look each up in the glossary.
 * Punctuation stays attached for display but is ignored for lookup.
 */
export interface StoryToken {
  text: string;
  key: string;
  gloss?: string;
}

export function storyTokens(roman: string, glossary: Readonly<Record<string, string>>): StoryToken[] {
  return roman
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => {
      const key = text.toLowerCase().replace(/[^a-z'-]/g, "");
      const gloss = glossary[key] ?? glossary[key.replace(/-/g, " ")] ?? hyphenGloss(key, glossary);
      return { text, key, gloss };
    });
}

/** "assalam-o-alaikum" style compounds: gloss the parts when the whole isn't listed. */
function hyphenGloss(key: string, glossary: Readonly<Record<string, string>>): string | undefined {
  if (!key.includes("-")) return undefined;
  const parts = key.split("-").map((k) => glossary[k]).filter(Boolean);
  return parts.length ? parts.join(" + ") : undefined;
}

/** Share of the story's words the glossary covers, for content linting. */
export function glossCoverage(romans: readonly string[], glossary: Readonly<Record<string, string>>): number {
  const tokens = romans.flatMap((r) => storyTokens(r, glossary));
  return tokens.length ? tokens.filter((t) => t.gloss).length / tokens.length : 1;
}
