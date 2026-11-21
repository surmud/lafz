import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { answerStep, freshStart } from "../e2e/helpers";

/**
 * App Store (and later Play) screenshots at the required pixel sizes, taken from the NATIVE build, so
 * they show exactly what the app shows (no sign-in, no tip jar). Not part of CI:
 *   npm run build:native && STORE=1 npm run e2e:native -- store.spec.ts
 * Output: store/screenshots/<size>/NN-name.png
 */
const SIZES = [
  { dir: "ios-6.9in-1320x2868", width: 440, height: 956, scale: 3 },
  { dir: "ios-6.5in-1284x2778", width: 428, height: 926, scale: 3 },
  { dir: "android-phone-1080x2400", width: 360, height: 800, scale: 3 },
];

async function onboard(page: Page) {
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await page.getByText(/Start here/).waitFor();
  await page.evaluate(() => localStorage.removeItem("lafz.e2e"));
}

for (const size of SIZES) {
  test(`store screenshots ${size.dir}`, async ({ browser }, info) => {
    test.skip(!process.env.STORE);
    const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: size.scale, isMobile: true, hasTouch: true, reducedMotion: "reduce", baseURL: info.project.use.baseURL });
    const page = await ctx.newPage();
    const dir = path.join("store", "screenshots", size.dir);
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    const shot = async (name: string) => page.screenshot({ path: path.join(dir, `${String(++n).padStart(2, "0")}-${name}.png`) });

    await onboard(page);
    await page.evaluate(() => localStorage.setItem("lafz.e2e", "1"));
    await page.goto("./lesson/u01-l1/");
    for (let i = 0; i < 60; i++) {
      const k = await answerStep(page);
      if (k === "done") break;
      if (k === "exercise") await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
    }
    await page.goto("./");
    await expect(page.getByRole("button", { name: /Speak/ })).toBeVisible();
    await shot("home");
    await page.goto("./lesson/u13-l1/");
    for (let i = 0; i < 6 && !(await page.getByRole("heading", { name: "Overheard" }).isVisible()); i++) await page.locator("footer").getByRole("button", { name: "Got it" }).click();
    await shot("overheard-scene");
    await page.goto("./story/u03/");
    await page.getByText("show text").click();
    await page.getByRole("button", { name: "Itwaar", exact: true }).click();
    await shot("story-tap-a-word");
    await page.goto("./boss/u06/");
    await page.getByRole("button", { name: "Start the conversation" }).click();
    await page.waitForTimeout(800);
    await shot("conversation");
    await page.goto("./");
    await page.getByRole("button", { name: /Read/ }).click();
    await shot("read-mode");
    await page.goto("./lesson/u18-l2/");
    for (let i = 0; i < 6 && !(await page.getByText("dil-e-nadaan tujhe hua kya hai").first().isVisible()); i++) await page.locator("footer").getByRole("button", { name: "Got it" }).click();
    await shot("poetry-ghalib");
    await ctx.close();
  });
}
