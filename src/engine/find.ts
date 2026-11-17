/**
 * Ranking for the phrase finder. Vectors are unit length, stored as int8 (scaled by 127), so the dot
 * product of a query vector with a row is proportional to cosine similarity.
 */
export function rank(matrix: Int8Array, dim: number, query: ArrayLike<number>, k = 8): { index: number; score: number }[] {
  const n = Math.floor(matrix.length / dim);
  const scored: { index: number; score: number }[] = [];
  for (let i = 0; i < n; i++) {
    let dot = 0;
    const off = i * dim;
    for (let j = 0; j < dim; j++) dot += (matrix[off + j] ?? 0) * (query[j] ?? 0);
    scored.push({ index: i, score: dot / 127 });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, k);
}

const STOP = new Set("a an the i to of in is it my me you your how do does say what when someone something for and or at on with please can could would am are be this that".split(" "));

export function keywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z' ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Plain keyword overlap, for when the model is not loaded (offline, or the learner declined). */
export function keywordRank(texts: readonly string[], query: string, k = 8): { index: number; score: number }[] {
  const words = keywords(query);
  if (words.length === 0) return [];
  const split = (t: string) => t.toLowerCase().replace(/[^a-z' ]+/g, " ").split(/\s+/);
  // Whole words only ("am" must not match "name"); longer words also match on their stem.
  const hit = (hay: string[], w: string) => hay.some((h) => h === w || (w.length > 4 && h.startsWith(w.slice(0, -1))));
  return texts
    .map((t, index) => {
      // The first sentence is the phrase's meaning; the rest is context. A match in the meaning counts
      // double, and a meaning that is mostly the query ("I'm lost") beats one that merely contains it.
      const meaning = split(t.split(". ")[0] ?? t);
      const all = split(t);
      let score = 0;
      for (const w of words) score += hit(meaning, w) ? 2 : hit(all, w) ? 1 : 0;
      return { index, score: score === 0 ? 0 : score / (2 * words.length) - Math.min(0.2, meaning.length / 100) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, k);
}
