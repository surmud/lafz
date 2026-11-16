/** Ask Ammi share text (SPEC §10). Pure so it can be tested. */
export function askAmmiText(p: { roman: string; urdu: string; en: string }, url?: string): string {
  return [
    "Ammi/Abbu, did I say this right? 🙈",
    "",
    `${p.roman}`,
    `${p.urdu}`,
    `(“${p.en}”)`,
    "",
    "Reply with a voice note saying it properly 🙏",
    url ? `Learning with Lafz: ${url}` : "Learning with Lafz",
  ].join("\n");
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** "5 phrases to try at dinner tonight" card (Practice with family). */
export function dinnerCardText(items: readonly { roman: string; urdu: string; en: string }[]): string {
  return [
    "🍛 5 phrases I'm trying at dinner tonight:",
    "",
    ...items.slice(0, 5).map((p, i) => `${i + 1}. ${p.roman} — ${p.urdu}\n   “${p.en}”`),
    "",
    "Correct me (nicely) 🙏 — via Lafz",
  ].join("\n");
}
