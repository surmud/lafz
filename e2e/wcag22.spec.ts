import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { answerStep, freshStart } from "./helpers";

// WCAG 2.2 AA pass (I6): axe on every main screen (WCAG 2.0/2.1/2.2 A+AA rules, incl. 2.5.8 target
// size), a keyboard-only lesson, 200% text zoom at 375px, and prefers-reduced-motion.
const SCREENS = [
  "", "unit/u01/", "unit/u14/", "unit/r01/", "lesson/u01-l1/", "lesson/u13-l1/", "lesson/r01-l1/", "boss/u01/", "story/u03/", "story/r08/",
  "stories/", "review/", "practice/", "practice/trouble/", "listen/", "shadow/", "find/", "grammar/", "phrasebook/", "insights/",
  "family/", "voice/u02/", "me/", "read/", "placement/", "pack/eid-next-week/", "unit/u03/sheet/", "privacy/", "terms/", "delete-account/", "credits/",
];

async function onboard(page: Page) {
  await freshStart(page);
  await page.getByRole("button", { name: "Let's go" }).click();
  await page.getByRole("button", { name: /new to Urdu/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: /Start lesson 1/ }).click();
  await page.getByText(/Start here/).waitFor();
}

const axe = (page: Page) => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

for (const theme of ["light", "dark"] as const) {
  test(`WCAG 2.2 AA: every main screen (${theme})`, async ({ page }, info) => {
    test.skip(info.project.name !== "iphone");
    test.setTimeout(240_000);
    await page.addInitScript((t) => localStorage.setItem("lafz.theme", t), theme);
    const report: string[] = [];
    const scan = async (label: string) => {
      const r = await axe(page).analyze();
      for (const v of r.violations) for (const n of v.nodes.slice(0, 4)) report.push(`${label}: ${v.id} :: ${n.html.slice(0, 110)}`);
    };
    // Onboarding screens first.
    await freshStart(page);
    await scan("welcome");
    await page.getByRole("button", { name: "Let's go" }).click();
    await page.getByRole("button", { name: /new to Urdu/ }).click();
    await scan("welcome-who");
    await page.getByRole("button", { name: "Next" }).click();
    await scan("welcome-ready");
    await page.getByRole("button", { name: /Start lesson 1/ }).click();
    await page.getByText(/Start here/).waitFor();
    for (const s of SCREENS) {
      await page.goto(`./${s}`);
      await page.waitForLoadState("networkidle");
      await scan(s || "home");
    }
    // Inside lessons: each new exercise type, plus the feedback sheet.
    for (const l of ["u13-l1", "u13-l4", "u14-l2"]) {
      await page.goto(`./lesson/${l}/`);
      for (let i = 0; i < 40; i++) {
        const k = await answerStep(page, i % 2 === 0);
        if (k === "done") break;
        if (k === "exercise") {
          await scan(`${l}-feedback-${i}`);
          await page.locator("footer").getByRole("button", { name: /Continue/ }).click();
        } else await scan(`${l}-step-${i}`);
      }
    }
    expect(report, report.join("\n")).toEqual([]);
  });
}

test("keyboard only: finish a lesson without a pointer", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  test.setTimeout(300_000);
  await onboard(page);
  await page.goto("./lesson/u01-l1/");
  for (let i = 0; i < 200; i++) {
    await page.waitForTimeout(80);
    if (await page.getByRole("heading", { name: /complete!|done!/i }).isVisible()) return;
    const gotIt = page.locator("footer").getByRole("button", { name: /Got it|Can't speak now/ });
    const cont = page.locator("footer").getByRole("button", { name: /Continue/ });
    if (await gotIt.isVisible()) {
      await gotIt.focus();
      await page.keyboard.press("Enter");
      continue;
    }
    if (await cont.isVisible()) {
      await cont.focus();
      await page.keyboard.press("Enter");
      continue;
    }
    // Reach the right answer with Tab, then Space/Enter, then Check, all from the keyboard.
    const right = page.locator("main [data-correct='1']").first();
    const box = page.getByLabel("Your answer");
    const bank = page.locator("[aria-label='Word bank'][data-expected]");
    const pairs = page.locator("main [data-pair][data-side='l']");
    if (await bank.isVisible()) {
      // Word tiles are buttons: focus each in order and press Enter.
      const words = ((await bank.getAttribute("data-expected")) ?? "").replace(/[?!.,،۔؟!]/g, "").split(/\s+/);
      for (const w of words) {
        await bank.locator(`button[data-word="${w}"]:not([disabled])`).first().focus();
        await page.keyboard.press("Enter");
      }
    } else if ((await pairs.count()) > 0) {
      const ids = await pairs.evaluateAll((els) => els.map((e) => e.getAttribute("data-pair") ?? ""));
      for (const id of ids) {
        // The last pair completes itself; finished tiles are disabled and can't take focus.
        if (await page.locator(`main [data-pair='${id}'][data-side='l']`).isDisabled()) continue;
        await page.locator(`main [data-pair='${id}'][data-side='l']`).focus();
        await page.keyboard.press("Enter");
        await page.locator(`main [data-pair='${id}'][data-side='r']`).focus();
        await page.keyboard.press("Enter");
      }
    } else if (await box.isVisible()) {
      await box.focus();
      await page.keyboard.type((await box.getAttribute("data-expected")) ?? "");
    } else if (await right.count()) {
      await page.locator("body").focus();
      let found = false;
      for (let t = 0; t < 40 && !found; t++) {
        await page.keyboard.press("Tab");
        found = await right.evaluate((el) => el === document.activeElement);
      }
      expect(found, "right answer reachable by Tab").toBe(true);
      await page.keyboard.press("Enter");
    } else {
      // Exercise types without a keyboard path are a failure.
      const html = await page.locator("main").innerHTML();
      throw new Error(`no keyboard path: ${html.slice(0, 200)}`);
    }
    const check = page.locator("footer").getByRole("button", { name: "Check" });
    if (await check.isVisible()) {
      await check.focus();
      await page.keyboard.press("Enter");
    }
  }
  throw new Error("lesson did not finish by keyboard");
});

test("200% text zoom at 375px: no horizontal scrolling on main screens", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await onboard(page);
  const bad: string[] = [];
  for (const s of ["", "me/", "practice/", "lesson/u01-l1/", "story/u03/", "insights/", "unit/u01/", "family/", "privacy/", "boss/u01/"]) {
    await page.goto(`./${s}`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
    await page.waitForTimeout(150);
    const over = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("main *, header *, nav *, footer *")]
        .filter((el) => {
          // Deliberate horizontal scrollers (the prep-pack carousel) are allowed to extend sideways.
          for (let a = el.parentElement; a; a = a.parentElement) if (getComputedStyle(a).overflowX === "auto") return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > w + 1 || r.left < -1);
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(" ").slice(0, 3).join(".")} "${(el.textContent ?? "").slice(0, 30)}"`);
      return { scroll: document.documentElement.scrollWidth > w + 1, offenders };
    });
    if (over.scroll || over.offenders.length) bad.push(`${s || "home"}: ${over.offenders.join(" | ")}`);
  }
  expect(bad, bad.join("\n")).toEqual([]);
});

test("prefers-reduced-motion: animations effectively off", async ({ page }, info) => {
  test.skip(info.project.name !== "iphone");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await onboard(page);
  const longest = await page.evaluate(() =>
    Math.max(0, ...[...document.querySelectorAll("*")].map((el) => {
      const cs = getComputedStyle(el);
      return Math.max(parseFloat(cs.animationDuration) || 0, parseFloat(cs.transitionDuration) || 0);
    })),
  );
  expect(longest).toBeLessThan(0.01);
});
