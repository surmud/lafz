import { expect, test } from "vitest";
import { keywordRank, keywords, rank } from "./find";

test("rank orders rows by similarity to the query", () => {
  const m = new Int8Array([127, 0, 0, 127, 90, 90]);
  expect(rank(m, 2, [1, 0]).map((r) => r.index)).toEqual([0, 2, 1]);
  expect(rank(m, 2, [0, 1], 1)).toEqual([{ index: 1, score: 1 }]);
  expect(rank(new Int8Array(0), 2, [1, 0])).toEqual([]);
});

test("keyword fallback ignores filler words and ranks by overlap", () => {
  expect(keywords("How do I say: I'm lost?")).toEqual(["i'm", "lost"]);
  const texts = ["I'm lost. I've forgotten the way", "Call a doctor", "I've lost my phone"];
  expect(keywordRank(texts, "lost phone").map((r) => r.index)).toEqual([2, 0]);
  expect(keywordRank(texts, "doctors")[0]?.index).toBe(1);
  expect(keywordRank(texts, "how do I")).toEqual([]);
  expect(keywordRank(texts, "zebra")).toEqual([]);
  // A match in the meaning beats a match in the context, and a tighter meaning beats a looser one.
  const more = ["Get lost! (playful). Said to a cousin", "I'm lost", "Enough. Said when you are lost for words"];
  expect(keywordRank(more, "I am lost").map((r) => r.index)).toEqual([1, 0, 2]);
});
