import { expect, test } from "@playwright/test";
import { answerStep, freshStart } from "./helpers";

// Browsers without the Web Speech API get an opt-in on-device Whisper (G9). The model download
// itself is too big for CI, so this checks the offer appears and speaking stays optional.
test("no Web Speech API: speak exercise offers on-device listening", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  await page.addInitScript(() => {
    // @ts-expect-error simulate a browser without speech recognition
    delete window.SpeechRecognition;
    // @ts-expect-error same
    delete window.webkitSpeechRecognition;
  });
  await freshStart(page);
  await page.goto("./lesson/u01-l1/");
  for (let i = 0; i < 30 && !(await page.getByRole("heading", { name: "Say it out loud" }).isVisible()); i++) {
    const k = await answerStep(page);
    if (k === "exercise") await page.getByRole("button", { name: "Continue" }).click();
    if (k === "done") break;
  }
  await expect(page.getByRole("button", { name: "Turn on on-device listening" })).toBeVisible();
  await expect(page.getByText(/about 80 MB/)).toBeVisible();
  await expect(page.getByRole("button", { name: /I said it/ })).toBeVisible();
});
