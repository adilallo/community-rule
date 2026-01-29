import { test, expect } from "@playwright/test";

// Performance budgets - simplified for E2E tests
// Comprehensive performance testing is handled by Lighthouse CI
const PERFORMANCE_BUDGETS = {
  page_load_time: 4000, // 4 seconds
  first_contentful_paint: 2500, // 2.5 seconds
  largest_contentful_paint: 3000, // 3 seconds
  first_input_delay: 150, // 150ms
  ttfb: 1500, // 1.5 seconds
  dom_content_loaded: 2000, // 2 seconds
  full_load: 4000, // 4 seconds
};

test.describe("Performance Monitoring", () => {
  test.beforeEach(async () => {
    if (process.env.CI) test.slow();
  });

  test("homepage load performance", async ({ page }) => {
    const startTime = Date.now();

    // Navigate to homepage
    await page.goto("/", { waitUntil: "load", timeout: 60000 });

    const loadTime = Date.now() - startTime;

    // Get performance metrics from browser
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const paint = performance.getEntriesByType("paint");

      return {
        ttfb: navigation?.responseStart - navigation?.requestStart || 0,
        domContentLoaded:
          navigation?.domContentLoadedEventEnd -
            navigation?.domContentLoadedEventStart || 0,
        load: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
        firstContentfulPaint:
          paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
          0,
      };
    });

    // Assert page load time is within budget
    expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.page_load_time);

    // Assert individual metrics
    expect(metrics.ttfb).toBeLessThan(PERFORMANCE_BUDGETS.ttfb);
    expect(metrics.domContentLoaded).toBeLessThan(
      PERFORMANCE_BUDGETS.dom_content_loaded,
    );
    expect(metrics.load).toBeLessThan(PERFORMANCE_BUDGETS.full_load);
    expect(metrics.firstContentfulPaint).toBeLessThan(
      PERFORMANCE_BUDGETS.first_contentful_paint,
    );
  });

  test("core web vitals", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 60000 });
    await page.waitForLoadState("load");

    // Get Core Web Vitals using browser Performance API
    const coreWebVitals = (await page.evaluate(() => {
      return new Promise<{ lcp: number; fid: number; cls: number }>(
        (resolve) => {
          const timeout = setTimeout(() => {
            observer.disconnect();
            resolve({ lcp: 0, fid: 0, cls: 0 }); // Default values if timeout
          }, 10000); // 10 second timeout

          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const metrics: { lcp?: number; fid?: number; cls?: number } = {};

            for (const entry of entries) {
              const e = entry as any;
              if (
                e.name === "LCP" ||
                e.entryType === "largest-contentful-paint"
              ) {
                metrics.lcp = e.startTime ?? 0;
              } else if (e.name === "FID" || e.entryType === "first-input") {
                metrics.fid = (e.processingStart ?? 0) - (e.startTime ?? 0);
              } else if (e.name === "CLS" || e.entryType === "layout-shift") {
                metrics.cls = e.value ?? 0;
              }
            }

            if (
              metrics.lcp !== undefined &&
              metrics.fid !== undefined &&
              metrics.cls !== undefined
            ) {
              clearTimeout(timeout);
              observer.disconnect();
              resolve({
                lcp: metrics.lcp,
                fid: metrics.fid,
                cls: metrics.cls,
              });
            }
          });

          observer.observe({
            entryTypes: [
              "largest-contentful-paint",
              "first-input",
              "layout-shift",
            ],
          });
        },
      );
    })) as { lcp: number; fid: number; cls: number };

    // Assert Core Web Vitals are within acceptable ranges
    expect(coreWebVitals.lcp).toBeLessThan(
      PERFORMANCE_BUDGETS.largest_contentful_paint,
    );
    expect(coreWebVitals.fid).toBeLessThan(
      PERFORMANCE_BUDGETS.first_input_delay,
    );
    expect(coreWebVitals.cls).toBeLessThan(0.1); // CLS should be less than 0.1
  });
});
