#!/usr/bin/env node

/**
 * Performance Monitoring Script
 *
 * This script provides comprehensive performance monitoring capabilities
 * for the Community Rule application.
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Performance budgets
const PERFORMANCE_BUDGETS = {
  page_load_time: 3000,
  first_contentful_paint: 2000,
  largest_contentful_paint: 2500,
  first_input_delay: 100,
  dns_lookup: 100,
  tcp_connection: 200,
  ttfb: 600,
  dom_content_loaded: 1500,
  full_load: 3000,
  component_render_time: 500,
  interaction_time: 100,
  scroll_performance: 50,
  network_request_duration: 1000,
  memory_usage_mb: 50,
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

class PerformanceMonitorScript {
  constructor() {
    this.metrics = new Map();
    this.regressions = [];
    this.warnings = [];
  }

  /**
   * Run Lighthouse CI performance tests
   */
  async runLighthouseCI() {
    console.log("🚀 Running Lighthouse CI performance tests...");

    return new Promise((resolve, reject) => {
      const lhci = spawn("npx", ["lhci", "autorun"], {
        stdio: "pipe",
        shell: true,
      });

      let output = "";
      let errorOutput = "";

      lhci.stdout.on("data", (data) => {
        output += data.toString();
        console.log(data.toString());
      });

      lhci.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error(data.toString());
      });

      lhci.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Lighthouse CI tests completed successfully");
          this.analyzeLighthouseResults(output);
          resolve(output);
        } else {
          console.error("❌ Lighthouse CI tests failed");
          reject(
            new Error(`Lighthouse CI failed with code ${code}: ${errorOutput}`),
          );
        }
      });
    });
  }

  /**
   * Run Playwright performance tests
   */
  async runPlaywrightPerformanceTests() {
    console.log("🎭 Running Playwright performance tests...");

    return new Promise((resolve, reject) => {
      const playwright = spawn(
        "npx",
        [
          "playwright",
          "test",
          "tests/e2e/performance.spec.ts",
          "--reporter=json",
        ],
        {
          stdio: "pipe",
          shell: true,
        },
      );

      let output = "";
      let errorOutput = "";

      playwright.stdout.on("data", (data) => {
        output += data.toString();
      });

      playwright.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      playwright.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Playwright performance tests completed successfully");
          this.analyzePlaywrightResults(output);
          resolve(output);
        } else {
          console.error("❌ Playwright performance tests failed");
          reject(
            new Error(
              `Playwright tests failed with code ${code}: ${errorOutput}`,
            ),
          );
        }
      });
    });
  }

  /**
   * Analyze Lighthouse CI results
   */
  analyzeLighthouseResults(output) {
    console.log("📊 Analyzing Lighthouse CI results...");

    // Parse Lighthouse results
    const lines = output.split("\n");
    let currentMetric = null;

    for (const line of lines) {
      if (line.includes("Performance")) {
        const scoreMatch = line.match(/(\d+)/);
        if (scoreMatch) {
          const score = parseInt(scoreMatch[1]);
          this.recordMetric("lighthouse_performance_score", score);

          if (score < 90) {
            this.warnings.push(
              `Performance score below threshold: ${score}/100`,
            );
          }
        }
      }

      if (line.includes("First Contentful Paint")) {
        const timeMatch = line.match(/(\d+(?:\.\d+)?)\s*ms/);
        if (timeMatch) {
          const time = parseFloat(timeMatch[1]);
          this.recordMetric("first_contentful_paint", time);

          if (time > PERFORMANCE_BUDGETS.first_contentful_paint) {
            this.warnings.push(
              `First Contentful Paint exceeded budget: ${time}ms`,
            );
          }
        }
      }

      if (line.includes("Largest Contentful Paint")) {
        const timeMatch = line.match(/(\d+(?:\.\d+)?)\s*ms/);
        if (timeMatch) {
          const time = parseFloat(timeMatch[1]);
          this.recordMetric("largest_contentful_paint", time);

          if (time > PERFORMANCE_BUDGETS.largest_contentful_paint) {
            this.warnings.push(
              `Largest Contentful Paint exceeded budget: ${time}ms`,
            );
          }
        }
      }

      if (line.includes("Total Blocking Time")) {
        const timeMatch = line.match(/(\d+(?:\.\d+)?)\s*ms/);
        if (timeMatch) {
          const time = parseFloat(timeMatch[1]);
          this.recordMetric("total_blocking_time", time);

          if (time > 300) {
            this.warnings.push(
              `Total Blocking Time exceeded budget: ${time}ms`,
            );
          }
        }
      }

      if (line.includes("Cumulative Layout Shift")) {
        const shiftMatch = line.match(/(\d+(?:\.\d+)?)/);
        if (shiftMatch) {
          const shift = parseFloat(shiftMatch[1]);
          this.recordMetric("cumulative_layout_shift", shift);

          if (shift > 0.1) {
            this.warnings.push(
              `Cumulative Layout Shift exceeded budget: ${shift}`,
            );
          }
        }
      }
    }
  }

  /**
   * Analyze Playwright test results
   */
  analyzePlaywrightResults(output) {
    console.log("📊 Analyzing Playwright test results...");

    try {
      const results = JSON.parse(output);

      for (const result of results) {
        if (result.status === "failed") {
          this.warnings.push(`Test failed: ${result.title}`);
        }
      }
    } catch (error) {
      console.warn("Could not parse Playwright results as JSON");
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
    });

    // Check against baseline for regression detection
    const baseline = BASELINE_METRICS[name];
    if (baseline) {
      const regressionThreshold = baseline * 1.2; // 20% regression threshold
      if (value > regressionThreshold) {
        this.regressions.push({
          metric: name,
          current: value,
          baseline,
          regression: (((value - baseline) / baseline) * 100).toFixed(1) + "%",
        });
      }
    }
  }

  /**
   * Generate performance report
   */
  generateReport() {
    console.log("\n📈 Performance Monitoring Report");
    console.log("================================\n");

    // Summary
    console.log("📊 Summary:");
    console.log(`- Total metrics recorded: ${this.metrics.size}`);
    console.log(
      `- Performance regressions detected: ${this.regressions.length}`,
    );
    console.log(`- Warnings: ${this.warnings.length}\n`);

    // Performance regressions
    if (this.regressions.length > 0) {
      console.log("🚨 Performance Regressions:");
      for (const regression of this.regressions) {
        console.log(
          `  - ${regression.metric}: ${regression.current} (baseline: ${regression.baseline}, regression: ${regression.regression})`,
        );
      }
      console.log("");
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log("⚠️  Warnings:");
      for (const warning of this.warnings) {
        console.log(`  - ${warning}`);
      }
      console.log("");
    }

    // Metrics summary
    console.log("📋 Metrics Summary:");
    for (const [name, values] of this.metrics) {
      const latest = values[values.length - 1];
      const average =
        values.reduce((sum, v) => sum + v.value, 0) / values.length;
      const budget = PERFORMANCE_BUDGETS[name];

      console.log(`  - ${name}:`);
      console.log(`    Latest: ${latest.value}`);
      console.log(`    Average: ${average.toFixed(2)}`);
      if (budget) {
        const status = latest.value <= budget ? "✅" : "❌";
        console.log(`    Budget: ${budget} ${status}`);
      }
    }

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalMetrics: this.metrics.size,
        regressions: this.regressions.length,
        warnings: this.warnings.length,
      },
      regressions: this.regressions,
      warnings: this.warnings,
      metrics: Object.fromEntries(this.metrics),
    };

    const reportPath = path.join(__dirname, "../performance-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);

    return report;
  }

  /**
   * Run all performance monitoring
   */
  async run() {
    console.log("🔍 Starting Performance Monitoring...\n");

    try {
      // Run Lighthouse CI tests
      await this.runLighthouseCI();

      // Run Playwright performance tests
      await this.runPlaywrightPerformanceTests();

      // Generate and display report
      const report = this.generateReport();

      // Exit with appropriate code
      if (this.regressions.length > 0) {
        console.log("❌ Performance regressions detected!");
        process.exit(1);
      } else if (this.warnings.length > 0) {
        console.log("⚠️  Performance warnings detected.");
        process.exit(0);
      } else {
        console.log("✅ All performance checks passed!");
        process.exit(0);
      }
    } catch (error) {
      console.error("❌ Performance monitoring failed:", error.message);
      process.exit(1);
    }
  }
}

// Run the performance monitor if this script is executed directly
if (require.main === module) {
  const monitor = new PerformanceMonitorScript();
  monitor.run();
}

module.exports = PerformanceMonitorScript;
