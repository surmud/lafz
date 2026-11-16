import { expect, test } from "@playwright/test";
import { freshStart } from "./helpers";

test("trace guide is centred and fully inside the canvas", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  await freshStart(page);
  await page.goto("./lesson/r01-l1/");
  for (let i = 0; i < 40 && !(await page.getByRole("heading", { name: /^Trace:/ }).isVisible()); i++) {
    const gotIt = page.getByRole("button", { name: "Got it" });
    if (await gotIt.isVisible()) await gotIt.click();
    else {
      await page.locator("main [data-correct='1']").first().click();
      await page.getByRole("button", { name: "Check" }).click();
      await page.getByRole("button", { name: "Continue" }).click();
    }
  }
  const canvas = page.getByLabel(/Tracing area/);
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(500);
  const box = await canvas.evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    for (let y = 0; y < c.height; y++)
      for (let x = 0; x < c.width; x++)
        if (d[(y * c.width + x) * 4 + 3]! > 10) {
          minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        }
    return { minX, minY, maxX, maxY, W: c.width, H: c.height };
  });
  expect(box.minX).toBeGreaterThan(5);
  expect(box.minY).toBeGreaterThan(5);
  expect(box.maxX).toBeLessThan(box.W - 5);
  expect(box.maxY).toBeLessThan(box.H - 5);
  await page.screenshot({ path: "e2e/screenshots/trace-check.png" });
});
