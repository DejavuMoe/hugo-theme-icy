/**
 * Browser checks for the demo site, in Chromium, Firefox and WebKit.
 * Build and seal the site into exampleSite/public first (see README.md).
 */
import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

const port = 47173;
const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  outputDir: "results",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: [[ci ? "github" : "list"], ["html", { open: "never", outputFolder: "report" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `node ../tools/protect/preview.mjs --site ../exampleSite --no-build --port ${port}`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
