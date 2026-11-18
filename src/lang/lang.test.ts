import { expect, test } from "vitest";
import { normaliseUrdu, foldTokens } from "@/engine/matcher";
import { pack, packs } from "./index";

test("Urdu is the active and only pack, and its contract is complete", () => {
  expect(Object.keys(packs)).toEqual(["ur"]);
  expect(pack.code).toBe("ur");
  expect(pack.script.dir).toBe("rtl");
  expect(pack.script.chars.test("سلام")).toBe(true);
  expect(pack.script.chars.test("salaam")).toBe(false);
  expect(pack.speech).toEqual({ recognition: "ur-PK", whisper: "ur" });
  expect(pack.voices.maleSpeakers).toContain("abbu");
  for (const cls of pack.romanization.lexicon) expect(cls.length).toBeGreaterThan(1);
});

test("the engine uses the pack's rules", () => {
  expect(foldTokens("shukria")).toEqual(foldTokens("shukriya"));
  expect(normaliseUrdu("كيا")).toBe(pack.script.normalise("كيا"));
  expect(normaliseUrdu("كيا")).toBe("کیا");
});
