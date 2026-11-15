import { expect, test } from "@playwright/test";

test("home renders at mobile width", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Lafz" }).first()).toBeVisible();
});
