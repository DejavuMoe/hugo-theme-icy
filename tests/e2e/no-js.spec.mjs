/** Every page works without JavaScript. */
import { expect, test } from "@playwright/test";
import { attachScreenshot, isolate, overflowing, PAGES, viewport } from "./helpers.mjs";

test.use({ javaScriptEnabled: false, viewport: viewport(390) });

for (const path of PAGES) {
  test(`no JS: ${path}`, async ({ page }, testInfo) => {
    await isolate(page);
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    expect(await overflowing(page)).toEqual([]);
    await attachScreenshot(page, testInfo, "no-js");
  });
}

test("no JS: menus, details and images are plain HTML", async ({ page }) => {
  await isolate(page);
  await page.goto("/docs/writing/");
  // Native <details> opens without script.
  const details = page.locator("details.details").first();
  await details.locator("summary").click();
  await expect(details).toHaveAttribute("open", "");
  // Diagrams fall back to their source.
  await expect(page.locator(".pele-source").first()).toBeVisible();

  await page.goto("/posts/images-and-galleries/");
  // Zoomable images are links to the full image.
  const link = page.locator("a[data-viewer]").first();
  await expect(link).toHaveAttribute("href", /\.(webp|jpe?g|png|avif)$/);

  await page.goto("/search/");
  await expect(page.locator(".search-noscript")).toBeVisible();
});
