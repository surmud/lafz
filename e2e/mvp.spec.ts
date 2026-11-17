import { expect, test } from "@playwright/test";
import { answerStep, freshStart, shooter } from "./helpers";

test("placement → suggested unit → Unit 1 Lesson 1 complete", async ({ page }, info) => {
  const shot = shooter(page, "mvp", info.project.name);
  await freshStart(page);
  await expect(page.getByRole("button", { name: "Let's go" })).toBeVisible();
  await shot("welcome");
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /understand some Urdu/ }).click();
  await shot("who");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel(/Khala/).fill("Shabnam");
  await shot("names");
  await page.getByRole("button", { name: /Take the placement test/ }).click();

  await expect(page).toHaveURL(/placement/);
  let q = 0;
  while (!(await page.getByRole("heading", { name: /Start at Unit/ }).isVisible())) {
    q++;
    if (q === 1) await shot("placement-q1");
    const right = await page.locator("main [data-correct='1']").count();
    const typeBox = page.getByLabel("Your answer");
    if (right > 0) await page.locator("main [data-correct='1']").first().click();
    else if (await typeBox.isVisible()) await typeBox.fill((await typeBox.getAttribute("data-expected")) ?? "");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.getByRole("heading", { name: /Start at Unit/ }).or(page.getByText(new RegExp(`Q${q + 1} of`))),
    ).toBeVisible();
    expect(q).toBeLessThan(10);
  }
  await shot("placement-result");
  // Reading placement: two right, then "can't read it yet" → suggests R9.
  await page.getByRole("button", { name: "Check my reading" }).click();
  await page.locator("[data-correct='1']").first().click();
  await page.locator("[data-correct='1']").first().click();
  await page.getByRole("button", { name: /can't read it yet/ }).click();
  await expect(page.getByRole("link", { name: /Start reading at R9/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Start at Unit ([2-9]|1[0-2])$/ })).toBeVisible();
  // Skipped units stay open: go back and do Unit 1 Lesson 1 anyway.
  await page.getByRole("link", { name: "See the whole course" }).click();
  await expect(page.getByText("Skipped · review anytime").first()).toBeVisible();
  await shot("home-skipped");
  await page.goto("./lesson/u01-l1/");

  await expect(page).toHaveURL(/lesson\/u01-l1/);
  let steps = 0;
  for (;;) {
    const kind = await answerStep(page, true);
    steps++;
    if (steps === 1) await shot("lesson-teach");
    if (kind === "done") break;
    if (kind === "exercise") {
      if (steps < 9) await shot(`lesson-step-${steps}`);
      await page.getByRole("button", { name: "Continue" }).click();
    }
    expect(steps).toBeLessThan(40);
  }
  await expect(page.getByText("New can-do unlocked")).toBeVisible();
  await expect(page.getByText("You can give and return a proper salaam")).toBeVisible();
  await shot("lesson-complete");

  await page.getByRole("link", { name: "Back home" }).click();
  await expect(page.getByText(/Continue · Unit 1/)).toBeVisible();
  await expect(page.getByText("10 XP")).toBeVisible();
  await shot("home-after");
});
