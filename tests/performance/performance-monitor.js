/**
 * Performance Monitoring Module
 *
 * This module provides comprehensive performance monitoring capabilities
 * for detecting performance regressions and maintaining performance budgets.
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.baselines = new Map();
    this.thresholds = new Map();
    this.history = [];
  }

  /**
   * Set performance thresholds for different metrics
   */
  setThresholds(thresholds) {
    this.thresholds = new Map(Object.entries(thresholds));
  }

  /**
   * Set baseline metrics for comparison
   */
  setBaselines(baselines) {
    this.baselines = new Map(Object.entries(baselines));
  }

  /**
   * Record a performance metric
   */
  recordMetric(name, value, context = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      context,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(metric);

    // Check against thresholds
    this.checkThreshold(name, value);

    // Check against baselines
    this.checkBaseline(name, value);

    return metric;
  }

  /**
   * Check if a metric exceeds its threshold
   */
  checkThreshold(name, value) {
    const threshold = this.thresholds.get(name);
    if (!threshold) return;

    if (value > threshold) {
      console.warn(
        `⚠️  Performance threshold exceeded: ${name} = ${value}ms (threshold: ${threshold}ms)`,
      );
      return false;
    }
    return true;
  }

  /**
   * Check if a metric has regressed from baseline
   */
  checkBaseline(name, value) {
    const baseline = this.baselines.get(name);
    if (!baseline) return;

    const regressionThreshold = baseline * 1.2; // 20% regression threshold
    if (value > regressionThreshold) {
      console.error(
        `🚨 Performance regression detected: ${name} = ${value}ms (baseline: ${baseline}ms)`,
      );
      return false;
    }
    return true;
  }

  /**
   * Get the latest metric value
   */
  getLatestMetric(name) {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;
    return metrics[metrics.length - 1];
  }

  /**
   * Get average metric value
   */
  getAverageMetric(name) {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const summary = {};

    for (const [name, metrics] of this.metrics) {
      const values = metrics.map((m) => m.value);
      summary[name] = {
        latest: values[values.length - 1],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }

  /**
   * Export metrics for analysis
   */
  export() {
    return {
      metrics: Object.fromEntries(this.metrics),
      baselines: Object.fromEntries(this.baselines),
      thresholds: Object.fromEntries(this.thresholds),
      summary: this.getSummary(),
    };
  }
}

/**
 * Web Performance API wrapper
 */
class WebPerformanceMonitor extends PerformanceMonitor {
  constructor() {
    super();
    this.performanceObserver = null;
    this.setupPerformanceObserver();
  }

  /**
   * Setup Performance Observer for automatic metric collection
   */
  setupPerformanceObserver() {
    if (typeof window === "undefined" || !window.PerformanceObserver) {
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration, {
            entryType: entry.entryType,
            startTime: entry.startTime,
          });
        }
      });

      // Observe navigation timing
      this.performanceObserver.observe({ entryTypes: ["navigation"] });

      // Observe resource timing
      this.performanceObserver.observe({ entryTypes: ["resource"] });

      // Observe paint timing
      this.performanceObserver.observe({ entryTypes: ["paint"] });

      // Observe layout shifts
      this.performanceObserver.observe({ entryTypes: ["layout-shift"] });

      // Observe first input delay
      this.performanceObserver.observe({ entryTypes: ["first-input"] });
    } catch (error) {
      console.warn("Performance Observer not supported:", error);
    }
  }

  /**
   * Get Core Web Vitals metrics
   */
  async getCoreWebVitals() {
    if (typeof window === "undefined") {
      return null;
    }

    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const metrics = {};

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
          observer.disconnect();
          resolve(metrics);
        }
      });

      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });
    });
  }

  /**
   * Get navigation timing metrics
   */
  getNavigationTiming() {
    if (typeof window === "undefined" || !window.performance) {
      return null;
    }

    const navigation = performance.getEntriesByType("navigation")[0];
    if (!navigation) return null;

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart,
    };
  }

  /**
   * Get resource timing metrics
   */
  getResourceTiming() {
    if (typeof window === "undefined" || !window.performance) {
      return null;
    }

    const resources = performance.getEntriesByType("resource");
    return resources.map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType,
    }));
  }

  /**
   * Measure function execution time
   */
  async measureFunction(name, fn) {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration);
      throw error;
    }
  }

  /**
   * Measure page load performance
   */
  async measurePageLoad(url) {
    return this.measureFunction("page_load", async () => {
      const start = performance.now();

      // Simulate page load (in real implementation, this would be actual navigation)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const navigation = this.getNavigationTiming();
      const coreWebVitals = await this.getCoreWebVitals();

      return {
        loadTime: performance.now() - start,
        navigation,
        coreWebVitals,
      };
    });
  }
}

/**
 * Playwright Performance Monitor
 */
class PlaywrightPerformanceMonitor extends PerformanceMonitor {
  constructor(page) {
    super();
    this.page = page;
  }

  /**
   * Measure page load performance using Playwright
   */
  async measurePageLoad(url) {
    const startTime = Date.now();

    // Navigate to the page
    await this.page.goto(url, { waitUntil: "networkidle" });

    const loadTime = Date.now() - startTime;
    this.recordMetric("page_load_time", loadTime, { url });

    // Get performance metrics from the page
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const paint = performance.getEntriesByType("paint");

      return {
        dns: navigation?.domainLookupEnd - navigation?.domainLookupStart || 0,
        tcp: navigation?.connectEnd - navigation?.connectStart || 0,
        ttfb: navigation?.responseStart - navigation?.requestStart || 0,
        download: navigation?.responseEnd - navigation?.responseStart || 0,
        domContentLoaded:
          navigation?.domContentLoadedEventEnd -
            navigation?.domContentLoadedEventStart || 0,
        load: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime || 0,
        firstContentfulPaint:
          paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
          0,
      };
    });

    // Record individual metrics
    for (const [name, value] of Object.entries(metrics)) {
      this.recordMetric(name, value, { url });
    }

    return {
      loadTime,
      metrics,
    };
  }

  /**
   * Measure component render performance
   */
  async measureComponentRender(selector) {
    const startTime = Date.now();

    // Wait for the component to be visible
    await this.page.waitForSelector(selector, { state: "visible" });

    const renderTime = Date.now() - startTime;
    this.recordMetric("component_render_time", renderTime, { selector });

    return renderTime;
  }

  /**
   * Measure interaction performance
   */
  async measureInteraction(selector, action) {
    const startTime = Date.now();

    // Perform the action
    await action();

    const interactionTime = Date.now() - startTime;
    this.recordMetric("interaction_time", interactionTime, {
      selector,
      action: action.name,
    });

    return interactionTime;
  }

  /**
   * Measure scroll performance
   */
  async measureScrollPerformance() {
    const startTime = Date.now();

    // Scroll to bottom
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    const scrollTime = Date.now() - startTime;
    this.recordMetric("scroll_performance", scrollTime);

    return scrollTime;
  }

  /**
   * Get memory usage
   */
  async getMemoryUsage() {
    const memory = await this.page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memory) {
      this.recordMetric("memory_usage_mb", memory.usedJSHeapSize / 1024 / 1024);
    }

    return memory;
  }

  /**
   * Monitor network requests
   */
  async monitorNetworkRequests() {
    const requests = [];

    this.page.on("request", (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        timestamp: Date.now(),
      });
    });

    this.page.on("response", (response) => {
      const request = requests.find((r) => r.url === response.url());
      if (request) {
        request.status = response.status();
        request.size = response.headers()["content-length"] || 0;
        request.duration = Date.now() - request.timestamp;

        this.recordMetric("network_request_duration", request.duration, {
          url: request.url,
          method: request.method,
          status: request.status,
        });
      }
    });

    return requests;
  }
}

// Export the performance monitors
module.exports = {
  PerformanceMonitor,
  WebPerformanceMonitor,
  PlaywrightPerformanceMonitor,
};
