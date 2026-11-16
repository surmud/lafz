import { expect, test } from "@playwright/test";
import { answerStep, shooter } from "./helpers";

// Offline Omar (docs/EVALS.md): first load online, download a unit, then airplane mode.
test("offline: a downloaded unit's lesson and audio work with no network", async ({ page, context }, info) => {
  test.skip(info.project.name !== "pixel", "service workers: one project is enough");
  const shot = shooter(page, "offline-omar", info.project.name);
  await page.addInitScript(() => {
    localStorage.setItem("lafz.e2e", "1");
    localStorage.setItem("lafz.sw", "1");
    localStorage.setItem("lafz.settings", JSON.stringify({ script: "both", sound: false }));
  });
  await page.goto("./welcome/");
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /starting from zero/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start with Salaam/ }).click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // The SW must control the page before downloads go through it.
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.goto("./unit/u01/");
  await page.getByRole("button", { name: /Download this unit/ }).click();
  await expect(page.getByText(/Saved for offline/)).toBeVisible({ timeout: 120_000 });
  await shot("downloaded");

  await context.setOffline(true);
  await page.goto("./lesson/u01-l2/");
  await expect(page.getByText("New phrase")).toBeVisible();
  // Audio for this lesson is in the cache.
  const audioOk = await page.evaluate(async () => {
    const urls = (await (await fetch("/lafz/offline/u01.json")).json()).audio as string[];
    const r = await fetch(urls[0]!);
    return r.ok && (await r.arrayBuffer()).byteLength > 1000;
  });
  expect(audioOk).toBe(true);
  for (let i = 0; i < 40; i++) {
    const kind = await answerStep(page, true);
    if (kind === "done") break;
    if (kind === "exercise") await page.getByRole("button", { name: "Continue" }).click();
  }
  await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
  await shot("offline-lesson-complete");
  await page.goto("./");
  await expect(page.getByText(/Continue · Unit 1/)).toBeVisible();
  await context.setOffline(false);
});
