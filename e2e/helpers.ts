import { expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Numbered screenshots per persona, uploaded by CI (docs/EVALS.md §1). */
export function shooter(page: Page, persona: string, project: string) {
  const dir = path.join("e2e", "screenshots", `${persona}-${project}`);
  fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  return async (name: string) => {
    n += 1;
    await page.screenshot({ path: path.join(dir, `${String(n).padStart(2, "0")}-${name}.png`), fullPage: false });
  };
}

export async function freshStart(page: Page, opts: { today?: string } = {}) {
  await page.addInitScript(() => {
    localStorage.setItem("lafz.e2e", "1");
    // Only on a fresh profile: later page loads must keep whatever the test changed (mode, hard mode).
    if (!localStorage.getItem("lafz.settings")) localStorage.setItem("lafz.settings", JSON.stringify({ script: "both", sound: false }));
  });
  await page.goto(opts.today ? `./?today=${opts.today}` : "./");
}

/**
 * Answer whatever exercise is on screen. `right=false` answers wrong on purpose where the exercise
 * allows it. Returns the kind of step handled.
 */
/** How a persona types Roman Urdu: textbook, or every which way (Sloppy Sam). */
export function sloppify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .replace(/aa/g, "a")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/\bkya\b/g, "kia")
    .replace(/\bhai\b/g, "h")
    .replace(/\bhain\b/g, "hn")
    .replace(/\bnahin\b/g, "nai")
    .replace(/\bshukriya\b/g, "shukria")
    .replace(/\baur\b/g, "or");
}

export async function answerStep(
  page: Page,
  right = true,
  typing: "exact" | "sloppy" = "exact",
): Promise<"teach" | "exercise" | "done"> {
  const footer = page.locator("footer");
  await expect(
    page
      .getByRole("heading", { name: /complete!|done!/i })
      .or(footer.getByRole("button", { name: /Got it|Skip|Can't speak now/ }).first()),
  ).toBeVisible();
  if (await page.getByRole("heading", { name: /complete!|done!/i }).isVisible()) return "done";
  const gotIt = footer.getByRole("button", { name: "Got it" });
  if (await gotIt.isVisible()) {
    await gotIt.click();
    return "teach";
  }

  const pickable = page.locator("main [data-correct]");
  const typeBox = page.getByLabel("Your answer");
  const bank = page.locator("[aria-label='Word bank'][data-expected]");
  const pairs = page.locator("main [data-pair][data-side='l']");

  const buckets = page.locator("main [data-bucket-target]");
  if ((await buckets.count()) > 0) {
    const n = await buckets.count();
    for (;;) {
      const item = page.locator("main [data-bucket]").first();
      if ((await item.count()) === 0) break;
      const b = Number(await item.getAttribute("data-bucket"));
      await item.click();
      await page.locator(`main [data-bucket-target='${right ? b : (b + 1) % n}']`).click();
    }
  } else if ((await pickable.count()) > 0) {
    await page.locator(`main [data-correct='${right ? 1 : 0}']`).first().click();
  } else if (await typeBox.isVisible()) {
    const expected = (await typeBox.getAttribute("data-expected")) ?? "";
    await typeBox.fill(right ? (typing === "sloppy" ? sloppify(expected) : expected) : "pizza");
  } else if (await bank.isVisible()) {
    const expected = ((await bank.getAttribute("data-expected")) ?? "").replace(/[?!.,،۔؟!]/g, "").split(/\s+/);
    const words = right ? expected : [...expected].reverse();
    for (const w of words) {
      await bank.locator(`button[data-word="${w}"]:not([disabled])`).first().click();
    }
  } else if ((await pairs.count()) > 0) {
    const ids = await pairs.evaluateAll((els) => els.map((e) => e.getAttribute("data-pair") ?? ""));
    for (const id of ids) {
      await page.locator(`main [data-pair="${id}"][data-side='l']`).click();
      await page.locator(`main [data-pair="${id}"][data-side='r']`).click();
    }
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
    return "exercise";
  } else if (await page.getByRole("button", { name: /I said it/ }).isVisible()) {
    await page.getByRole("button", { name: /I said it/ }).click();
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
    return "exercise";
  } else {
    await footer.getByRole("button", { name: /Skip|Can't speak/ }).click();
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
    return "exercise";
  }
  await footer.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  return "exercise";
}
