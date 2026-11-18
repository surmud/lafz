import { expect, test, type Page } from "@playwright/test";
import { answerStep, freshStart, shooter, skipAccount } from "./helpers";

async function onboardBeginner(page: Page) {
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await skipAccount(page);
  await expect(page.getByText(/Start here/)).toBeVisible();
}

async function playLesson(page: Page, opts: { wrongFirst?: boolean; typing?: "exact" | "sloppy"; shot?: (n: string) => Promise<void> } = {}) {
  let n = 0;
  for (;;) {
    const comeback = await page.getByText(/Comeback round/).isVisible();
    const kind = await answerStep(page, opts.wrongFirst ? comeback : true, opts.typing);
    n++;
    if (kind === "done") return;
    if (kind === "exercise") {
      if (opts.shot && n % 4 === 0) await opts.shot(`step-${n}`);
      await page.getByRole("button", { name: "Continue" }).click();
    }
    expect(n).toBeLessThan(80);
  }
}

test("Zero Zara: total beginner, Unit 1 lessons 1–3, then reading R1", async ({ page }, info) => {
  test.skip(info.project.name !== "pixel", "Zara uses a Pixel");
  const shot = shooter(page, "zero-zara", info.project.name);
  await freshStart(page);
  await onboardBeginner(page);
  await shot("home");
  for (const id of ["u01-l1", "u01-l2", "u01-l3"]) {
    await page.goto(`./lesson/${id}/`);
    await playLesson(page, { shot });
    await expect(page.getByText("New can-do unlocked")).toBeVisible();
  }
  await shot("after-unit1");
  await page.goto("./me/");
  await expect(page.getByRole("heading", { name: /5 phrases to try at dinner tonight/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send to the family" })).toBeVisible();
  await shot("dinner-card");
  await page.goto("./read/");
  await expect(page.getByText("How Urdu Script Works")).toBeVisible();
  await shot("read-tab");
  await page.goto("./lesson/r01-l1/");
  await expect(page.getByRole("heading", { name: "Right to left" })).toBeVisible();
  await shot("r1-intro");
  await playLesson(page, { shot });
  await expect(page.getByText(/You can recognise alif/)).toBeVisible();
  await shot("r1-done");
});

test("Wrong-a-lot Wajid: half wrong, never blocked, comebacks pay", async ({ page }, info) => {
  test.skip(info.project.name !== "pixel", "Wajid uses a Pixel");
  const shot = shooter(page, "wrong-a-lot-wajid", info.project.name);
  await freshStart(page);
  await onboardBeginner(page);
  await page.goto("./lesson/u01-l2/");
  await playLesson(page, { wrongFirst: true, shot });
  await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
  await expect(page.getByText(/comeback bonus/)).toBeVisible();
  const comebacks = await page.getByLabel("Lesson stats").getByText(/^\d+$/).last().textContent();
  expect(Number(comebacks)).toBeGreaterThan(0);
  await shot("complete");
});

test("Sloppy Sam: types Roman Urdu every which way and still gets credit", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone", "Sam uses an iPhone");
  const shot = shooter(page, "sloppy-sam", info.project.name);
  await freshStart(page);
  await onboardBeginner(page);
  for (const id of ["u01-l2", "u01-l4"]) {
    await page.goto(`./lesson/${id}/`);
    await playLesson(page, { typing: "sloppy", shot });
    await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
    // Every sloppy answer counted: nothing came back for a comeback round.
    await expect(page.getByLabel("Lesson stats").getByText(/^0$/)).toBeVisible();
  }
  await shot("done");
});

test("Away-for-a-week Ayesha: streak rests, welcome back is warm", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone", "Ayesha uses an iPhone");
  const shot = shooter(page, "away-ayesha", info.project.name);
  await freshStart(page, { today: "2026-11-01" });
  await onboardBeginner(page);
  await page.goto("./lesson/u01-l1/?today=2026-11-01");
  await playLesson(page);
  await page.goto("./?today=2026-11-02");
  await page.goto("./lesson/u01-l2/?today=2026-11-02");
  await playLesson(page);
  await page.goto("./?today=2026-11-11");
  await expect(page.getByText(/Welcome back/)).toBeVisible();
  await expect(page.getByText(/streak has been resting/)).toBeVisible();
  await expect(page.getByLabel(/Streak resting: 2 days/)).toBeVisible();
  await shot("welcome-back");
  await page.goto("./lesson/u01-l3/?today=2026-11-11");
  await playLesson(page);
  await page.goto("./?today=2026-11-11");
  await expect(page.getByLabel(/Done today: 3 days/)).toBeVisible();
  await shot("streak-resumed");
});

test("Heritage Hamza: a prep pack session before Khala's call", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone", "Hamza uses an iPhone");
  const shot = shooter(page, "heritage-hamza-pack", info.project.name);
  await freshStart(page);
  await onboardBeginner(page);
  await page.getByRole("link", { name: /Phone call with family/ }).click();
  await expect(page.getByRole("heading", { name: "Phone call with family" })).toBeVisible();
  await shot("pack");
  await page.getByRole("link", { name: /Pick up properly/ }).click();
  await playLesson(page);
  await expect(page.getByText("New can-do unlocked")).toBeVisible();
  await shot("session-done");
  await page.getByRole("link", { name: /Next: Catch up/ }).click();
  await expect(page.getByText("New phrase")).toBeVisible();
});

test("every unit's 'Mix it up' warm-up completes", async ({ page }, info) => {
  test.skip(info.project.name !== "pixel");
  await freshStart(page);
  await onboardBeginner(page);
  for (const id of ["u01-mix", "u07-mix", "u12-mix"]) {
    await page.goto(`./lesson/${id}/`);
    await playLesson(page);
    await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
  }
});
