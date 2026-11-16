import { expect, test } from "vitest";
import { personaliseCharacter, personaliseText } from "./store";

const khala = { id: "khala", name: "Shabnam Khala" };
const nani = { id: "nani", name: "Nani" };

test("characters take the learner's real relatives' names", () => {
  expect(personaliseCharacter(khala, { khala: "Rubina" }).name).toBe("Rubina Khala");
  expect(personaliseCharacter(nani, { nani: " Zubeida " }).name).toBe("Nani (Zubeida)");
  expect(personaliseCharacter(khala, { khala: "  " }).name).toBe("Shabnam Khala");
  expect(personaliseCharacter(khala, {})).toBe(khala);
});

test("scene text swaps in Khala's real name", () => {
  expect(personaliseText("Shabnam Khala opens the door.", { khala: "Rubina" })).toBe("Rubina Khala opens the door.");
  expect(personaliseText("Shabnam Khala opens the door.", {})).toBe("Shabnam Khala opens the door.");
});
