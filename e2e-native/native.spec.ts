import { expect, test, type Page } from "@playwright/test";
import { answerStep } from "../e2e/helpers";

/**
 * App Store build checks (iOS 1.0): no sign-in, no tip jar, no statistics, no links to features that are
 * off, privacy wording for the app, and everything works with the network cut off (all from the bundle).
 */
const external: string[] = [];

async function offline(page: Page) {
  await page.context().route(/^(?!http:\/\/localhost)/, (route) => {
    external.push(route.request().url());
    return route.abort();
  });
}

async function onboard(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lafz.e2e", "1");
    if (!localStorage.getItem("lafz.settings")) localStorage.setItem("lafz.settings", JSON.stringify({ script: "both", sound: false }));
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await expect(page.getByText(/Start here/)).toBeVisible();
}

test("no sign-in, no tips, no statistics, no dead links; privacy says the app collects nothing", async ({ page }) => {
  await offline(page);
  await onboard(page);
  await expect(page.getByRole("heading", { name: "Save your progress?" })).toHaveCount(0);
  await page.goto("./me/");
  await expect(page.getByRole("heading", { name: "Me" }).or(page.getByText("Settings")).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Account" })).toHaveCount(0);
  await expect(page.getByText(/Sign in with/)).toHaveCount(0);
  await expect(page.getByText(/chai/i)).toHaveCount(0);
  await expect(page.locator("a[href*='stripe']")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Delete your account" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Help" })).toBeVisible();
  await page.goto("./insights/");
  await expect(page.getByText(/nowhere to send statistics/)).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Share anonymous statistics/ })).toHaveCount(0);
  await page.goto("./privacy/");
  await expect(page.getByText("the Lafz app collects no data.")).toBeVisible();
  await page.goto("./support/");
  await expect(page.getByRole("heading", { name: "Do I need an account?" })).toBeVisible();
  await expect(page.getByText("Your progress is saved on your phone.")).toBeVisible();
  // Every internal link on these pages resolves to a page in the bundle.
  const hrefs = new Set<string>();
  for (const p of ["./", "./me/", "./practice/", "./privacy/", "./support/", "./credits/", "./unit/u01/"]) {
    await page.goto(p);
    for (const h of await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""))) hrefs.add(h);
  }
  for (const h of hrefs) {
    const res = await page.request.get(h);
    expect(res.status(), `link ${h}`).toBe(200);
  }
});

test("works fully offline from the bundle: lessons, audio, story, conversation, reading", async ({ page }) => {
  external.length = 0;
  await offline(page);
  const audio: number[] = [];
  page.on("response", (r) => {
    if (r.url().includes("/audio/")) audio.push(r.status());
  });
  await onboard(page);
  await page.goto("./lesson/u01-l1/");
  for (let i = 0; i < 80; i++) {
    const k = await answerStep(page);
    if (k === "done") break;
    if (k === "exercise") await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
  }
  await expect(page.getByRole("heading", { name: /complete!|done!/i })).toBeVisible();
  for (const p of ["./story/u03/", "./boss/u06/", "./lesson/r01-l1/", "./lesson/u18-l2/", "./grammar/", "./phrasebook/", "./listen/", "./stories/"]) {
    const res = await page.goto(p);
    expect(res?.status(), p).toBe(200);
  }
  await page.goto("./story/u03/");
  await page.getByRole("button", { name: /Play line 1/ }).click();
  await expect.poll(() => audio.length, { timeout: 10_000 }).toBeGreaterThan(0);
  expect(audio.every((s) => s === 200 || s === 206)).toBe(true);
  // Nothing outside the bundle was needed (fonts, scripts, audio all local).
  expect(external, external.join("\n")).toEqual([]);
});
