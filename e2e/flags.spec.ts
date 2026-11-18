import { expect, test } from "@playwright/test";
import { answerStep, freshStart, shooter } from "./helpers";

// Features behind founder config. These run only against a build made with the variable set,
// e.g. NEXT_PUBLIC_CHAI_URL=https://buy.stripe.com/test npm run build && CHAI=1 npx playwright test e2e/flags.spec.ts
test("chai: Me row, and one dismissible card after five lessons", async ({ page }, info) => {
  test.skip(!process.env.CHAI, "build without NEXT_PUBLIC_CHAI_URL");
  test.skip(info.project.name !== "iphone");
  const shot = shooter(page, "flags", info.project.name);
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await page.getByText(/Start here/).waitFor();
  await page.goto("./me/");
  await expect(page.getByRole("link", { name: /Buy me a chai/ })).toHaveAttribute("target", "_blank");
  for (const l of ["u01-l1", "u01-l2", "u01-l3", "u01-l4", "u01-l5"]) {
    await page.goto(`./lesson/${l}/`);
    for (let i = 0; i < 80; i++) {
      const k = await answerStep(page);
      if (k === "done") break;
      if (k === "exercise") await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
    }
  }
  await page.goto("./");
  await expect(page.getByRole("complementary", { name: "Support Lafz" })).toBeVisible();
  await shot("chai-card");
  await page.getByRole("button", { name: "Dismiss" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Speak/ }).waitFor();
  await expect(page.getByRole("complementary", { name: "Support Lafz" })).toHaveCount(0);
});
