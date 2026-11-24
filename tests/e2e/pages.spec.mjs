/**
 * Every page in every browser, at phone and desktop width, light and dark:
 * it loads, scrolls without errors, never scrolls sideways, and lands in the
 * report as a screenshot.
 */
import { expect, test } from "@playwright/test";
import { attachScreenshot, isolate, overflowing, PAGES, SCHEMES, scrollThrough, viewport, WIDTHS, watchErrors } from "./helpers.mjs";

for (const width of WIDTHS) {
  for (const scheme of SCHEMES) {
    test.describe(`${width}px ${scheme}`, () => {
      test.use({ viewport: viewport(width), colorScheme: scheme });

      for (const path of PAGES) {
        test(path, async ({ page }, testInfo) => {
          const errors = watchErrors(page, { notFound: path === "/missing-page/" });
          await isolate(page);
          const response = await page.goto(path);
          expect(response.status()).toBe(path === "/missing-page/" ? 404 : 200);
          await expect(page.locator("h1").first()).toBeVisible();
          await scrollThrough(page);
          expect(await overflowing(page)).toEqual([]);
          await attachScreenshot(page, testInfo, `${width}-${scheme}`);
          expect(errors).toEqual([]);
        });
      }
    });
  }
}
