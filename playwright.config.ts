import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.01, // 1% pixels may differ
      maxDiffPixels: 200, // or an absolute pixel count
    },
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3010",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    colorScheme: "light", // Ensure consistent color scheme
    viewport: { width: 1280, height: 800 }, // Consistent viewport
    deviceScaleFactor: 1, // Consistent device scale
  },
  // Only start webServer in non-CI environments
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          url: "http://localhost:3010",
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
  // Browser-specific snapshot path template (includes projectName for cross-browser support)
  snapshotPathTemplate:
    "{testDir}/{testFileName}-snapshots/{arg}-{projectName}.png",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
