import { test } from "@playwright/test";
import { freshStart, shooter, skipAccount } from "./helpers";

test("eval 4 gallery", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  const shot = shooter(page, "eval4", info.project.name);
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await skipAccount(page);
  await page.getByText(/Start here/).waitFor();
  await page.goto("./me/");
  await page.getByRole("heading", { name: "Settings" }).scrollIntoViewIfNeeded();
  await shot("me-settings");
  await page.goto("./stories/");
  await shot("stories");
  await page.goto("./");
  await page.getByRole("button", { name: /Read/ }).click();
  await page.getByText("Stories to read").scrollIntoViewIfNeeded();
  await shot("home-read-stories");
  await page.goto("./story/r08/");
  await shot("reading-story");
});
