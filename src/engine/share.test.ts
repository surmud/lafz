import { expect, test } from "vitest";
import { askAmmiText, dinnerCardText, whatsappUrl } from "./share";

const p = { roman: "shukriya", urdu: "شکریہ", en: "Thank you" };

test("ask ammi text has both scripts and the meaning", () => {
  const t = askAmmiText(p, "https://surmud.github.io/lafz/");
  expect(t).toContain("shukriya");
  expect(t).toContain("شکریہ");
  expect(t).toContain("Thank you");
  expect(t).toContain("https://surmud.github.io/lafz/");
  expect(askAmmiText(p)).toContain("Learning with Lafz");
});

test("whatsapp link encodes the text", () => {
  expect(whatsappUrl("a b&c")).toBe("https://wa.me/?text=a%20b%26c");
});

test("dinner card lists at most five", () => {
  const t = dinnerCardText(Array.from({ length: 7 }, (_, i) => ({ ...p, roman: `p${i}` })));
  expect(t).toContain("5. p4");
  expect(t).not.toContain("p5");
});
