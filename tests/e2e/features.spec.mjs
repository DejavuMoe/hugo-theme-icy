/** The scripted features, in every browser. */
import { expect, test } from "@playwright/test";
import { isolate, watchErrors } from "./helpers.mjs";

test.beforeEach(async ({ page }) => {
  await isolate(page);
});

test("the color scheme toggle switches and is remembered", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const root = page.locator("html");
  await page.locator("[data-theme-toggle]").first().click();
  await expect(root).toHaveAttribute("data-color-scheme", "dark");
  await page.reload();
  await expect(root).toHaveAttribute("data-color-scheme", "dark");
});

test("search finds posts", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/search/?q=gallery");
  await expect(page.locator(".search-results > li").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("the image viewer opens and closes", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/posts/images-and-galleries/");
  await page.locator("a[data-viewer]").first().click();
  const dialog = page.locator("dialog.viewer");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".viewer-image")).toHaveAttribute("src", /\S/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test("diagrams load only near the viewport", async ({ page }) => {
  const errors = watchErrors(page);
  const requested = [];
  page.on("request", (request) => {
    if (request.url().includes("/js/vendor/pele.")) requested.push(request.url());
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/writing/");
  await page.waitForLoadState("networkidle");
  expect(requested).toEqual([]);

  const figure = page.locator(".pele-figure").first();
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toHaveClass(/\bis-mounted\b/);
  await expect(figure.locator(".pele-diagram svg").first()).toBeVisible();
  expect(requested).toHaveLength(1);
  expect(errors).toEqual([]);
});

test("a protected post unlocks with its password", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/posts/secret-garden/");
  await page.locator("#protected-password").fill("icy");
  await page.locator("#protected-password").press("Enter");
  const content = page.locator("[data-protected-content]");
  await expect(content).toBeVisible();
  await expect(content).toContainText("You found the way in");
  expect(errors).toEqual([]);
});
