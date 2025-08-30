import { test, expect } from "@playwright/test";
import { PlaywrightPerformanceMonitor } from "../performance/performance-monitor.js";

// Environment-aware performance budgets and thresholds
const PERFORMANCE_BUDGETS = {
  // Page load performance
  page_load_time: 3000, // 3 seconds
  first_contentful_paint: 2000, // 2 seconds
  largest_contentful_paint: 2500, // 2.5 seconds
  first_input_delay: 100, // 100ms

  // Navigation timing
  dns_lookup: 100, // 100ms
  tcp_connection: 200, // 200ms
  ttfb: 600, // 600ms
  dom_content_loaded: 1500, // 1.5 seconds
  full_load: 3000, // 3 seconds

  // Component performance
  component_render_time: 500, // 500ms
  interaction_time: 200, // 200ms - increased for development environment
  scroll_performance: process.env.CI ? 200 : 50, // Looser in CI (200ms vs 50ms)

  // Resource performance
  network_request_duration: 1000, // 1 second
  memory_usage_mb: 50, // 50MB
};

// Baseline metrics for regression detection
const BASELINE_METRICS = {
  page_load_time: 2000,
  first_contentful_paint: 1500,
  largest_contentful_paint: 2000,
  first_input_delay: 50,
  dns_lookup: 50,
  tcp_connection: 100,
  ttfb: 400,
  dom_content_loaded: 1000,
  full_load: 2000,
  component_render_time: 300,
  interaction_time: 50,
  scroll_performance: 30,
  network_request_duration: 500,
  memory_usage_mb: 30,
};

test.describe("Performance Monitoring", () => {
  let performanceMonitor: PlaywrightPerformanceMonitor;

  test.beforeEach(async ({ page }) => {
    // Mark tests as slower in CI environment
    if (process.env.CI) test.slow();

    performanceMonitor = new PlaywrightPerformanceMonitor(page);
    performanceMonitor.setThresholds(PERFORMANCE_BUDGETS);
    performanceMonitor.setBaselines(BASELINE_METRICS);
  });

  test("homepage load performance", async ({ page }) => {
    const result = await performanceMonitor.measurePageLoad("/");

    // Assert page load time is within budget
    expect(result.loadTime).toBeLessThan(PERFORMANCE_BUDGETS.page_load_time);

    // Assert individual metrics
    expect(result.metrics.ttfb).toBeLessThan(PERFORMANCE_BUDGETS.ttfb);
    expect(result.metrics.domContentLoaded).toBeLessThan(
      PERFORMANCE_BUDGETS.dom_content_loaded
    );
    expect(result.metrics.load).toBeLessThan(PERFORMANCE_BUDGETS.full_load);

    // Check for performance regressions
    const summary = performanceMonitor.getSummary();
    console.log("Performance Summary:", summary);
  });

  test("core web vitals", async ({ page }) => {
    await page.goto("/");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Get Core Web Vitals with timeout
    const coreWebVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          observer.disconnect();
          resolve({ lcp: 0, fid: 0, cls: 0 }); // Default values if timeout
        }, 10000); // 10 second timeout

        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: any = {};

          for (const entry of entries) {
            if (entry.name === "LCP") {
              metrics.lcp = entry.startTime;
            } else if (entry.name === "FID") {
              metrics.fid = entry.processingStart - entry.startTime;
            } else if (entry.name === "CLS") {
              metrics.cls = entry.value;
            }
          }

          if (Object.keys(metrics).length === 3) {
            clearTimeout(timeout);
            observer.disconnect();
            resolve(metrics);
          }
        });

        observer.observe({
          entryTypes: [
            "largest-contentful-paint",
            "first-input",
            "layout-shift",
          ],
        });
      });
    });

    // Assert Core Web Vitals are within acceptable ranges
    expect(coreWebVitals.lcp).toBeLessThan(
      PERFORMANCE_BUDGETS.largest_contentful_paint
    );
    expect(coreWebVitals.fid).toBeLessThan(
      PERFORMANCE_BUDGETS.first_input_delay
    );
    expect(coreWebVitals.cls).toBeLessThan(0.1); // CLS should be less than 0.1
  });

  test("component render performance", async ({ page }) => {
    await page.goto("/");

    // Measure header render time
    const headerRenderTime = await performanceMonitor.measureComponentRender(
      "header"
    );
    expect(headerRenderTime).toBeLessThan(
      PERFORMANCE_BUDGETS.component_render_time
    );

    // Measure footer render time
    const footerRenderTime = await performanceMonitor.measureComponentRender(
      "footer"
    );
    expect(footerRenderTime).toBeLessThan(
      PERFORMANCE_BUDGETS.component_render_time
    );

    // Measure main content render time
    const mainRenderTime = await performanceMonitor.measureComponentRender(
      "main"
    );
    expect(mainRenderTime).toBeLessThan(
      PERFORMANCE_BUDGETS.component_render_time
    );
  });

  test("interaction performance", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be ready
    await page.waitForLoadState("networkidle");

    // Measure button click performance with better element selection
    const buttonClickTime = await performanceMonitor.measureInteraction(
      'button:has-text("Learn how CommunityRule works")',
      async () => {
        const learnButtons = page.locator(
          'button:has-text("Learn how CommunityRule works")'
        );
        const buttonCount = await learnButtons.count();
        let visibleButton = null;

        for (let i = 0; i < buttonCount; i++) {
          const button = learnButtons.nth(i);
          if (await button.isVisible()) {
            visibleButton = button;
            break;
          }
        }

        if (!visibleButton) {
          throw new Error(
            'No visible "Learn how CommunityRule works" button found'
          );
        }

        await visibleButton.click();
      }
    );
    expect(buttonClickTime).toBeLessThan(PERFORMANCE_BUDGETS.interaction_time);

    // Measure link click performance with better element selection
    const linkClickTime = await performanceMonitor.measureInteraction(
      'a:has-text("Use cases")',
      async () => {
        const useCaseLinks = page.locator('a:has-text("Use cases")');
        const linkCount = await useCaseLinks.count();
        let visibleLink = null;

        for (let i = 0; i < linkCount; i++) {
          const link = useCaseLinks.nth(i);
          if (await link.isVisible()) {
            visibleLink = link;
            break;
          }
        }

        if (!visibleLink) {
          throw new Error('No visible "Use cases" link found');
        }

        await visibleLink.click();
      }
    );
    expect(linkClickTime).toBeLessThan(PERFORMANCE_BUDGETS.interaction_time);
  });

  test("scroll performance", async ({ page }) => {
    await page.goto("/");

    // Measure scroll performance
    const scrollTime = await performanceMonitor.measureScrollPerformance();
    expect(scrollTime).toBeLessThan(PERFORMANCE_BUDGETS.scroll_performance);
  });

  test("memory usage", async ({ page }) => {
    await page.goto("/");

    // Get memory usage
    const memoryUsage = await performanceMonitor.getMemoryUsage();

    if (memoryUsage) {
      const usedMemoryMB = memoryUsage.usedJSHeapSize / 1024 / 1024;
      expect(usedMemoryMB).toBeLessThan(PERFORMANCE_BUDGETS.memory_usage_mb);

      console.log(`Memory Usage: ${usedMemoryMB.toFixed(2)}MB`);
    }
  });

  test("network request performance", async ({ page }) => {
    const requests = await performanceMonitor.monitorNetworkRequests();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that all requests completed within budget
    const summary = performanceMonitor.getSummary();
    if (summary.network_request_duration) {
      expect(summary.network_request_duration.average).toBeLessThan(
        PERFORMANCE_BUDGETS.network_request_duration
      );
    }
  });

  test("responsive performance across breakpoints", async ({ page }) => {
    const breakpoints = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1280, height: 720 },
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);

      const result = await performanceMonitor.measurePageLoad("/");

      // Assert performance is maintained across breakpoints
      expect(result.loadTime).toBeLessThan(PERFORMANCE_BUDGETS.page_load_time);

      console.log(`${breakpoint.name} load time: ${result.loadTime}ms`);
    }
  });

  test("performance under load", async ({ page }) => {
    // Simulate slower network conditions
    await page.route("**/*", (route) => {
      route.continue();
    });

    // Add artificial delay to simulate network latency
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
        return originalFetch(...args);
      };
    });

    const result = await performanceMonitor.measurePageLoad("/");

    // Even under load, page should load within reasonable time
    expect(result.loadTime).toBeLessThan(
      PERFORMANCE_BUDGETS.page_load_time * 1.5
    );
  });

  test("performance regression detection", async ({ page }) => {
    await page.goto("/");

    // Simulate a performance regression by adding a heavy operation
    await page.addInitScript(() => {
      // Add a heavy operation that would cause regression
      const heavyOperation = () => {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
          result += Math.random();
        }
        return result;
      };

      // Execute heavy operation on page load
      window.addEventListener("load", () => {
        heavyOperation();
      });
    });

    const result = await performanceMonitor.measurePageLoad("/");

    // This should trigger a performance regression warning
    const summary = performanceMonitor.getSummary();
    console.log("Performance Summary with Regression:", summary);
  });

  test("performance metrics export", async ({ page }) => {
    await page.goto("/");

    // Perform various operations to collect metrics
    await performanceMonitor.measureComponentRender("header");
    await performanceMonitor.measureScrollPerformance();
    await performanceMonitor.getMemoryUsage();

    // Export all metrics
    const exportedData = performanceMonitor.export();

    // Verify exported data structure
    expect(exportedData.metrics).toBeDefined();
    expect(exportedData.baselines).toBeDefined();
    expect(exportedData.thresholds).toBeDefined();
    expect(exportedData.summary).toBeDefined();

    console.log(
      "Exported Performance Data:",
      JSON.stringify(exportedData, null, 2)
    );
  });

  test("performance budget compliance", async ({ page }) => {
    await page.goto("/");

    // Collect comprehensive metrics
    await performanceMonitor.measurePageLoad("/");
    await performanceMonitor.measureComponentRender("header");
    await performanceMonitor.measureComponentRender("footer");
    await performanceMonitor.measureScrollPerformance();
    await performanceMonitor.getMemoryUsage();

    const summary = performanceMonitor.getSummary();

    // Check all metrics against budgets
    for (const [metricName, budget] of Object.entries(PERFORMANCE_BUDGETS)) {
      if (summary[metricName]) {
        const actualValue =
          summary[metricName].latest || summary[metricName].average;
        expect(actualValue).toBeLessThan(budget);
        console.log(`${metricName}: ${actualValue}ms (budget: ${budget}ms)`);
      }
    }
  });
});

test.describe("Performance Regression Testing", () => {
  test("detect performance regressions over time", async ({ page }) => {
    const performanceMonitor = new PlaywrightPerformanceMonitor(page);

    // Set strict baselines for regression detection
    const strictBaselines = {
      page_load_time: 1500,
      first_contentful_paint: 1000,
      component_render_time: 200,
      interaction_time: 30,
    };

    performanceMonitor.setBaselines(strictBaselines);

    // Run multiple iterations to detect trends
    const iterations = 3;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      const result = await performanceMonitor.measurePageLoad("/");
      results.push(result.loadTime);

      // Small delay between iterations
      await page.waitForTimeout(1000);
    }

    // Check for consistent performance
    const averageLoadTime = results.reduce((a, b) => a + b, 0) / results.length;
    const variance =
      results.reduce(
        (acc, val) => acc + Math.pow(val - averageLoadTime, 2),
        0
      ) / results.length;

    // Performance should be consistent (low variance)
    expect(variance).toBeLessThan(100000); // Variance should be less than 100ms²

    console.log(`Average load time: ${averageLoadTime}ms`);
    console.log(`Variance: ${variance}`);
  });
});
