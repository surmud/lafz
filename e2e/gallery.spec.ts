import { expect, test } from "@playwright/test";
import { answerStep, freshStart, shooter, skipAccount } from "./helpers";

// Screens for the eval pass (docs/EVALS.md). One device; screenshots are reviewed by eye.
test("eval gallery", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  const shot = shooter(page, "eval-gallery", info.project.name);
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /understand some Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await skipAccount(page);
  await expect(page.getByText(/Start here/)).toBeVisible();
  await page.screenshot({ path: "e2e/screenshots/eval-gallery-iphone/00-home-full.png", fullPage: true });
  await page.goto("./pack/shaadi-5-days/");
  await shot("pack");
  await page.goto("./boss/u06/");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  await page.getByRole("button", { name: /Bhai sahab, bazaar chalenge/ }).click();
  await page.getByRole("button", { name: /Bohat zyada hai/ }).click();
  await shot("boss-u06");
  await page.goto("./lesson/r10-l2/");
  for (let i = 0; i < 3; i++) await answerStep(page);
  await shot("r10-couplet");
  await page.goto("./lesson/u10-l4/");
  await page.getByRole("button", { name: "Got it" }).click();
  await shot("u10-teach");
  for (let i = 0; i < 6; i++) {
    const k = await answerStep(page);
    if (k === "exercise") {
      await shot(`u10-ex-${i}`);
      await page.getByRole("button", { name: "Continue" }).click();
    }
  }
  await page.goto("./read/");
  await page.screenshot({ path: "e2e/screenshots/eval-gallery-iphone/90-read-full.png", fullPage: true });
});
