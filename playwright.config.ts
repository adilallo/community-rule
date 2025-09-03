import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.02, // 2% pixels may differ (balanced tolerance)
      maxDiffPixels: 500, // Balanced absolute pixel tolerance
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
    // Deterministic rendering defaults to eliminate environment drift
    colorScheme: "light",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1, // Keep DPR=1 for stable anti-aliasing
    timezoneId: "UTC", // Freeze timezone
    locale: "en-US", // Freeze locale
    headless: true,
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
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        deviceScaleFactor: 1, // Override device scale for consistency
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        deviceScaleFactor: 1, // Override device scale for consistency
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        deviceScaleFactor: 1, // Override device scale for consistency
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        deviceScaleFactor: 1, // Override device scale for consistency
      },
    },
  ],
});
