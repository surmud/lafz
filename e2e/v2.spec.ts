import { expect, test } from "@playwright/test";
import { answerStep, freshStart, shooter } from "./helpers";

// v2: Speak / Read modes, the new exercise formats, the advanced course, Practice hub and Insights.
async function onboard(page: import("@playwright/test").Page) {
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await expect(page.getByText(/Start here/)).toBeVisible();
}

async function finishLesson(page: import("@playwright/test").Page, wrongFirst = 0) {
  let wrong = wrongFirst;
  for (let i = 0; i < 80; i++) {
    const kind = await answerStep(page, wrong <= 0);
    if (kind === "done") return;
    if (kind === "exercise") {
      wrong--;
      await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
    }
  }
  throw new Error("lesson did not finish");
}

test("mode toggle switches the home screen between the speaking and reading courses", async ({ page }, info) => {
  const shot = shooter(page, "v2", info.project.name);
  await onboard(page);
  await expect(page.getByRole("heading", { name: "Speaking course" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Advanced" })).toBeVisible();
  await shot("home-speak");
  await page.getByRole("button", { name: /Read/ }).click();
  await expect(page.getByRole("heading", { name: "Reading course" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Speaking course" })).toHaveCount(0);
  await expect(page.getByText(/Start here · Reading 1/)).toBeVisible();
  await shot("home-read");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Reading course" })).toBeVisible();
});

test("a lesson with a scene, a spot-the-mistake, a sort and dictation can be completed", async ({ page }, info) => {
  const shot = shooter(page, "v2", info.project.name);
  await onboard(page);
  await page.goto("./lesson/u13-l1/");
  // Teach cards, then the scene.
  for (let i = 0; i < 6; i++) {
    if (await page.getByRole("heading", { name: /Overheard|Listen in/ }).isVisible()) break;
    await page.locator("footer").getByRole("button", { name: "Got it" }).click();
  }
  await expect(page.getByRole("heading", { name: "Overheard" })).toBeVisible();
  await shot("scene");
  await finishLesson(page, 1);
  await expect(page.getByRole("heading", { name: /complete!|done!/i })).toBeVisible();

  await page.goto("./lesson/u13-l4/");
  for (let i = 0; i < 12; i++) {
    if (await page.getByRole("heading", { name: "Who is speaking?" }).isVisible()) break;
    await page.locator("footer").getByRole("button", { name: "Got it" }).click();
  }
  await shot("sort");
  await finishLesson(page);
  await expect(page.getByRole("heading", { name: /complete!|done!/i })).toBeVisible();

  // Insights now has skill data, including grammar (the sort) and listening (dictation).
  await page.goto("./insights/");
  await expect(page.getByText("Estimated level")).toBeVisible();
  await expect(page.getByText(/answers so far|% ·/).first()).toBeVisible();
  await page.getByRole("button", { name: /See exactly what/ }).click();
  await expect(page.getByTestId("snapshot")).toContainText('"lessons": 2');
  await shot("insights");
});

test("practice hub: trouble words fill up after mistakes; grammar and listening pages work", async ({ page }, info) => {
  const shot = shooter(page, "v2", info.project.name);
  await onboard(page);
  await page.goto("./lesson/u01-l1/");
  await finishLesson(page, 6);
  await page.goto("./practice/");
  await expect(page.getByRole("link", { name: /Trouble words/ })).toContainText(/phrases you've missed/);
  await shot("practice");
  await page.getByRole("link", { name: /Trouble words/ }).click();
  await expect(page.locator("footer")).toBeVisible();
  await page.goto("./grammar/");
  await page.getByLabel("Search grammar notes").fill("passive");
  await expect(page.getByRole("heading", { name: "The passive", exact: true })).toBeVisible();
  await page.goto("./listen/");
  await page.getByRole("button", { name: /Survival Kit/ }).click();
  await expect(page.getByText(/1 of \d+/)).toBeVisible();
  await shot("listen");
  await page.goto("./find/");
  await page.getByLabel("Describe the situation").fill("I am lost");
  await page.getByRole("button", { name: "Find", exact: true }).click();
  await expect(page.getByText("main raasta bhool gaya hoon").first()).toBeVisible();
  await shot("find");
});

test("hard mode turns picking into typing", async ({ page }) => {
  await onboard(page);
  await page.goto("./practice/");
  await page.getByLabel(/Hard mode/).check();
  await page.goto("./lesson/u01-l1/");
  let typed = 0;
  for (let i = 0; i < 40; i++) {
    if (await page.getByLabel("Your answer").isVisible()) typed++;
    const kind = await answerStep(page);
    if (kind === "done") break;
    if (kind === "exercise") await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
  }
  expect(typed).toBeGreaterThanOrEqual(4);
});
