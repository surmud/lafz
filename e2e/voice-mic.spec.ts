import { expect, test } from "@playwright/test";
import { freshStart } from "./helpers";

// G8: real MediaRecorder path with Chromium's fake microphone. macOS blocks the fake device behind
// the OS microphone permission, so this runs only in Linux CI.
test.use({ permissions: ["microphone"], launchOptions: { args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] } });

test("family voice: record with the (fake) microphone and play it back in a lesson", async ({ page }, info) => {
  test.skip(!process.env.CI || info.project.name !== "pixel", "needs Linux CI");
  await freshStart(page);
  await page.goto("./voice/u01/");
  await page.getByRole("button", { name: "Record assalam-o-alaikum" }).click();
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(page.getByRole("button", { name: /Play the family recording of assalam-o-alaikum/ })).toBeVisible();
  await page.goto("./lesson/u01-l1/");
  const play = page.getByRole("button", { name: /assalam-o-alaikum/ }).first();
  await play.click();
  await expect(play).toHaveAttribute("data-source", "family", { timeout: 10_000 });
});
