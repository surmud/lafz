import { expect, test } from "@playwright/test";
import { answerStep, freshStart, shooter } from "./helpers";

test("eval gallery 2", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  const shot = shooter(page, "eval-gallery-2", info.project.name);
  await page.addInitScript(() => {
    // @ts-expect-error simulate no Web Speech API
    delete window.webkitSpeechRecognition;
    // @ts-expect-error same
    delete window.SpeechRecognition;
  });
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await expect(page.getByText(/Start here/)).toBeVisible();
  await page.goto("./lesson/u07-mix/");
  await page.getByRole("button", { name: "Got it" }).click();
  for (let i = 0; i < 4; i++) {
    const k = await answerStep(page);
    await shot(`mix-${i}`);
    if (k === "exercise") await page.getByRole("button", { name: "Continue" }).click();
  }
  await page.goto("./boss/u04/");
  await expect(page.getByRole("button", { name: "Start the conversation" })).toBeVisible();
  await shot("boss-intro");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  await shot("boss-chat");
  await page.goto("./voice/u03/");
  await shot("voice-recorder");
  await page.goto("./lesson/u01-l1/");
  for (let i = 0; i < 30 && !(await page.getByRole("heading", { name: "Say it out loud" }).isVisible()); i++) {
    const k = await answerStep(page);
    if (k === "exercise") await page.getByRole("button", { name: "Continue" }).click();
  }
  await shot("speak-fallback");
  await page.goto("./me/");
  await expect(page.getByText("What you can do")).toBeVisible();
  await shot("me");
});
