/** Accessibility (axe-core), light and dark, in Chromium. */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { isolate, PAGES, SCHEMES, scrollThrough } from "./helpers.mjs";

test.skip(({ browserName }) => browserName !== "chromium", "axe runs once, in Chromium");

for (const scheme of SCHEMES) {
  test.describe(scheme, () => {
    test.use({ colorScheme: scheme });

    for (const path of PAGES) {
      test(`axe: ${path}`, async ({ page }) => {
        await isolate(page);
        await page.goto(path);
        await scrollThrough(page);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const serious = violations
          .filter((v) => v.impact === "serious" || v.impact === "critical")
          .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
        expect(serious).toEqual([]);
      });
    }
  });
}
