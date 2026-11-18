import { expect, test } from "vitest";
import { glossCoverage, storyTokens } from "./story";

test("tokens strip punctuation for lookup and keep it for display", () => {
  const t = storyTokens("Aaj subah, darwaze par ghanti baji.", { aaj: "today", baji: "rang" });
  expect(t.map((x) => x.text)).toEqual(["Aaj", "subah,", "darwaze", "par", "ghanti", "baji."]);
  expect(t[0]).toMatchObject({ key: "aaj", gloss: "today" });
  expect(t[5]?.gloss).toBe("rang");
  expect(t[1]?.gloss).toBeUndefined();
});

test("hyphenated compounds fall back to their parts", () => {
  expect(storyTokens("Assalam-o-alaikum!", { assalam: "peace", alaikum: "upon you" })[0]?.gloss).toBe("peace + upon you");
  expect(storyTokens("dil-e-nadaan", { "dil-e-nadaan": "foolish heart" })[0]?.gloss).toBe("foolish heart");
  expect(storyTokens("x-y", {})[0]?.gloss).toBeUndefined();
});

test("coverage", () => {
  expect(glossCoverage(["a b", "c"], { a: "1", c: "3" })).toBeCloseTo(2 / 3);
  expect(glossCoverage([], {})).toBe(1);
});
