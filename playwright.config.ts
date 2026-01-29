import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: [
    "tests/e2e/**/*.spec.{js,ts}",
    "tests/e2e/**/*.test.{js,ts}",
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
  fullyParallel: !process.env.CI, // Disable parallel execution in CI to reduce server load
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  workers: process.env.CI ? 2 : undefined, // Reduce workers in CI to prevent server overload
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
  // Only start webServer in non-CI environments (CI starts its own server)
  // Use production server for E2E tests to match CI and ensure reliability
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: "npm run build && npx next start -p 3010",
          url: "http://localhost:3010",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000, // Increased timeout to account for build time
        },
      }),
  // Browser-specific snapshot path template (includes projectName for cross-browser support)
  snapshotPathTemplate:
    "tests/e2e/{testFileName}-snapshots/{arg}-{projectName}.png",
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
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars",
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
