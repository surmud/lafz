import { expect, test } from "@playwright/test";
import { answerStep, freshStart, shooter, skipAccount } from "./helpers";

// Eval pass 3: screenshots of the advanced course in both themes (not part of CI's assertions beyond completion).
for (const theme of ["light", "dark"] as const) {
  test(`advanced learner tour (${theme})`, async ({ page }, info) => {
    test.skip(info.project.name !== "iphone");
    const shot = shooter(page, `eval3-${theme}`, info.project.name);
    await page.addInitScript((t) => localStorage.setItem("lafz.theme", t), theme);
    await freshStart(page);
    await page.getByRole("button", { name: "Let's go" }).click();
    await page.getByRole("button", { name: /new to Urdu/ }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: /Start lesson 1/ }).click();
    await skipAccount(page);
    await page.getByRole("heading", { name: "Advanced" }).scrollIntoViewIfNeeded();
    await shot("home-advanced");
    await page.goto("./lesson/u18-l2/");
    for (let i = 0; i < 40; i++) {
      const k = await answerStep(page);
      if (i < 12) await shot(`ghalib-${i}`);
      if (k === "done") break;
      if (k === "exercise") await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
    }
    await expect(page.getByRole("heading", { name: /complete!|done!/i })).toBeVisible();
    await page.goto("./lesson/u14-l2/");
    for (let i = 0; i < 40; i++) {
      const k = await answerStep(page, i % 3 !== 0);
      await shot(`formal-${i}`);
      if (k === "done") break;
      if (k === "exercise") await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
    }
    await page.goto("./boss/u17/");
    await page.getByRole("button", { name: "Start the conversation" }).click();
    await shot("boss-start");
    await page.goto("./insights/");
    await shot("insights");
  });
}
