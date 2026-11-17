import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { answerStep, freshStart } from "./helpers";

// axe-core WCAG A/AA checks on key screens, in both themes (Lighthouse only covered light mode).
for (const theme of ["light", "dark"] as const) {
  test(`axe: key screens have no WCAG A/AA violations (${theme})`, async ({ page }, info) => {
    test.skip(info.project.name !== "iphone");
    await page.addInitScript((t) => localStorage.setItem("lafz.theme", t), theme);
    await freshStart(page);
    await page.getByRole("button", { name: "Let's go" }).click();
    await page.getByRole("button", { name: /starting from zero/ }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: /Start with Salaam/ }).click();
    await expect(page.getByText(/Start here/)).toBeVisible();
    const report: string[] = [];
    const scan = async (label: string) => {
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      for (const v of r.violations)
        for (const n of v.nodes.slice(0, 6)) {
          const d = (n.any[0]?.data ?? {}) as { fgColor?: string; bgColor?: string; contrastRatio?: number };
          report.push(`${label}: ${v.id} ${d.fgColor ?? ""} on ${d.bgColor ?? ""} = ${d.contrastRatio ?? ""} :: ${n.html.slice(0, 90)}`);
        }
    };
    await scan("home");
    for (const p of ["unit/u02/", "family/", "me/", "read/", "boss/u01/"]) {
      await page.goto(`./${p}`);
      await page.waitForLoadState("networkidle");
      await scan(p);
    }
    await page.goto("./lesson/u01-l2/");
    await scan("lesson-teach");
    for (let i = 0; i < 8; i++) {
      const k = await answerStep(page);
      if (k === "exercise") {
        await scan(`lesson-feedback-${i}`);
        await page.getByRole("button", { name: "Continue" }).click();
      }
    }
    expect(report, report.join("\n")).toEqual([]);
  });
}
