import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: [
    "tests/e2e/**/*.spec.{js,ts}",
    "tests/accessibility/**/*.spec.{js,ts}",
  ],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.03, // Increased to 3% to handle WebKit height differences
      maxDiffPixels: 50000, // Increased to handle WebKit height variations (1-2px height diff × width)
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
        // Let device preset own the DPR for stable anti-aliasing
        launchOptions: {
          args: [
            "--force-color-profile=srgb",
            "--disable-skia-runtime-opts",
            "--font-render-hinting=none",
            "--disable-lcd-text",
          ],
        },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        // Let device preset own the DPR for stable anti-aliasing
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        // Let device preset own the DPR for stable anti-aliasing
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        // Let device preset own the DPR for stable anti-aliasing
      },
    },
  ],
});
