import { expect, test } from "@playwright/test";
import { freshStart, skipAccount } from "./helpers";

// No console errors (hydration mismatches, React warnings, failed scripts) on any main page type.
const PAGES = ["", "unit/u01/", "lesson/u03-l2/", "boss/u05/", "review/", "read/", "unit/r01/", "lesson/r06-l1/", "family/", "voice/u02/", "me/", "pack/eid-next-week/", "pack/eid-next-week/s2/", "placement/", "dev/ui/", "phrasebook/", "unit/u03/sheet/", "practice/", "practice/trouble/", "listen/", "grammar/", "find/", "insights/", "unit/u14/", "lesson/u13-l1/", "lesson/u14-l2/", "lesson/u18-l1/", "boss/u17/", "stories/", "story/u03/", "shadow/", "privacy/", "terms/", "delete-account/", "credits/"];

test("no console errors on main pages", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !/ERR_INTERNET_DISCONNECTED|Failed to load resource/.test(m.text())) errors.push(`${page.url()} ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => errors.push(`${page.url()} PAGEERROR ${e.message.slice(0, 200)}`));
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await skipAccount(page);
  await expect(page.getByText(/Start here/)).toBeVisible();
  for (const p of PAGES) {
    await page.goto(`./${p}`);
    await page.waitForLoadState("networkidle");
  }
  expect(errors, errors.join("\n")).toEqual([]);
});
