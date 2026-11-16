import { expect, test } from "@playwright/test";
import { shooter } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  test(`key screens render (${theme})`, async ({ page }, info) => {
    test.skip(info.project.name !== "iphone", "one device is enough for the gallery");
    const shot = shooter(page, `pages-${theme}`, info.project.name);
    await page.addInitScript((t) => {
      localStorage.setItem("lafz.e2e", "1");
      localStorage.setItem("lafz.theme", t);
      localStorage.setItem("lafz.settings", JSON.stringify({ script: "both", sound: false, theme: t }));
    }, theme);
    await page.goto("./welcome/");
    await page.getByRole("button", { name: "Let's go" }).click();
    await page.getByRole("button", { name: /starting from zero/ }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: /Start with Salaam/ }).click();
    await expect(page.getByText(/Start here/)).toBeVisible();
    await shot("home");
    await page.goto("./unit/u01/");
    await expect(page.getByRole("heading", { name: "Salaam & Respect" })).toBeVisible();
    await shot("unit");
    await page.goto("./boss/u01/");
    await shot("boss-intro");
    await page.getByRole("button", { name: "Knock on the door" }).click();
    await expect(page.getByText("Return her salaam.")).toBeVisible();
    await shot("boss-turn1");
    // Take the bold branch, then recover.
    await page.getByRole("button", { name: /Walaikum assalam, Khala ji/ }).click();
    await page.getByRole("button", { name: /Tu kaisi hai/ }).click();
    await expect(page.getByText("Fix it. Quickly. Use aap.")).toBeVisible();
    await shot("boss-oops");
    await page.getByRole("tab", { name: "Type" }).click();
    await page.getByLabel("Type your reply in Roman Urdu").fill("maaf kijiye aap kesi hain");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Tell her your mum is fine.")).toBeVisible();
    await page.getByRole("tab", { name: "Pick" }).click();
    await page.getByRole("button", { name: /Ammi theek hain, shukriya/ }).click();
    await page.getByRole("button", { name: /Ji, meherbani/ }).click();
    await page.getByRole("button", { name: /Ji zaroor/ }).click();
    await expect(page.getByRole("heading", { name: "You survived the doorway" })).toBeVisible();
    await expect(page.getByText(/\+20 XP/)).toBeVisible();
    await shot("boss-end");
    await page.goto("./family/");
    await page.getByRole("button", { name: /Phuppo: Dad's sister/ }).click();
    await expect(page.getByRole("dialog", { name: "Phuppo" })).toBeVisible();
    await shot("family-sheet");
    await page.keyboard.press("Escape");
    await page.goto("./unit/u02/");
    await shot("unit2");
    await page.goto("./me/");
    await expect(page.getByText("What you can do")).toBeVisible();
    await shot("me");
  });
}
