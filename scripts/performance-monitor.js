#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors Core Web Vitals and performance metrics
 */

const fs = require("fs");
const path = require("path");

const PERFORMANCE_BUDGETS = require("../performance-budgets.json");
const MONITORING_DIR = path.join(__dirname, "..", ".next", "monitoring");

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      coreWebVitals: {},
      bundleMetrics: {},
      recommendations: [],
    };
  }

  /**
   * Run comprehensive performance monitoring
   */
  async monitorPerformance() {
    console.log("📊 Starting performance monitoring...");

    try {
      // Ensure monitoring directory exists
      if (!fs.existsSync(MONITORING_DIR)) {
        fs.mkdirSync(MONITORING_DIR, { recursive: true });
      }

      // Run Lighthouse CI for Core Web Vitals
      await this.runLighthouseCI();

      // Analyze bundle performance
      await this.analyzeBundlePerformance();

      // Check performance budgets
      this.checkPerformanceBudgets();

      // Generate performance report
      this.generatePerformanceReport();

      console.log("✅ Performance monitoring complete!");
      console.log(`📁 Results saved to: ${MONITORING_DIR}`);
    } catch (error) {
      console.error("❌ Performance monitoring failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Run Lighthouse CI for Core Web Vitals
   */
  async runLighthouseCI() {
    console.log("🔍 Running Lighthouse CI...");

    try {
      // Check if server is running
      const { execSync } = require("child_process");
      try {
        execSync("curl -s http://localhost:3000 > /dev/null", {
          stdio: "pipe",
        });
      } catch {
        console.warn(
          "⚠️ Development server not running, skipping Lighthouse CI...",
        );
        return;
      }

      // Run Lighthouse CI with performance focus
      execSync("npx lhci autorun --collect.url=http://localhost:3000", {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      });

      // Parse Lighthouse results
      await this.parseLighthouseResults();
    } catch {
      console.warn("⚠️ Lighthouse CI failed, continuing with other metrics...");
    }
  }

  /**
   * Parse Lighthouse CI results
   */
  async parseLighthouseResults() {
    const lhciResultsPath = path.join(__dirname, "..", ".lighthouseci");

    if (fs.existsSync(lhciResultsPath)) {
      const files = fs.readdirSync(lhciResultsPath);
      const resultFile = files.find((f) => f.endsWith(".json"));

      if (resultFile) {
        const results = JSON.parse(
          fs.readFileSync(path.join(lhciResultsPath, resultFile), "utf8"),
        );

        if (results.lhr && results.lhr.audits) {
          this.metrics.coreWebVitals = {
            lcp: this.getAuditScore(
              results.lhr.audits,
              "largest-contentful-paint",
            ),
            fid: this.getAuditScore(results.lhr.audits, "max-potential-fid"),
            cls: this.getAuditScore(
              results.lhr.audits,
              "cumulative-layout-shift",
            ),
            fcp: this.getAuditScore(
              results.lhr.audits,
              "first-contentful-paint",
            ),
            tti: this.getAuditScore(results.lhr.audits, "interactive"),
            performance: results.lhr.categories.performance?.score * 100 || 0,
          };
        }
      }
    }
  }

  /**
   * Get audit score from Lighthouse results
   */
  getAuditScore(audits, auditId) {
    const audit = audits[auditId];
    if (!audit) return null;

    return {
      score: audit.score * 100,
      value: audit.numericValue,
      displayValue: audit.displayValue,
    };
  }

  /**
   * Analyze bundle performance
   */
  async analyzeBundlePerformance() {
    console.log("📦 Analyzing bundle performance...");

    const bundleStatsPath = path.join(
      __dirname,
      "..",
      ".next",
      "static",
      "chunks",
    );

    if (fs.existsSync(bundleStatsPath)) {
      const files = fs.readdirSync(bundleStatsPath);
      let totalSize = 0;
      let jsFiles = 0;

      files.forEach((file) => {
        if (file.endsWith(".js")) {
          const filePath = path.join(bundleStatsPath, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
          jsFiles++;
        }
      });

      this.metrics.bundleMetrics = {
        totalSizeKB: Math.round(totalSize / 1024),
        totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
        fileCount: jsFiles,
        averageSizeKB: Math.round(totalSize / jsFiles / 1024),
      };
    }
  }

  /**
   * Check performance budgets
   */
  checkPerformanceBudgets() {
    const budgets = PERFORMANCE_BUDGETS.budgets;
    const violations = [];

    // Check Core Web Vitals
    if (this.metrics.coreWebVitals.lcp) {
      const lcpValue = this.metrics.coreWebVitals.lcp.value;
      const lcpBudget = budgets.find((b) => b.name === "lcp")?.maxValue;

      if (lcpBudget && lcpValue > lcpBudget) {
        violations.push({
          metric: "LCP",
          current: lcpValue,
          budget: lcpBudget,
          severity: lcpValue > lcpBudget * 1.5 ? "high" : "medium",
        });
      }
    }

    // Check bundle size
    if (this.metrics.bundleMetrics.totalSizeKB > 2000) {
      violations.push({
        metric: "Bundle Size",
        current: this.metrics.bundleMetrics.totalSizeKB,
        budget: 2000,
        severity: "medium",
      });
    }

    this.metrics.budgetViolations = violations;
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    const reportPath = path.join(MONITORING_DIR, "performance-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(this.metrics, null, 2));

    // Generate markdown report
    this.generateMarkdownReport();
  }

  /**
   * Generate markdown performance report
   */
  generateMarkdownReport() {
    const reportPath = path.join(MONITORING_DIR, "performance-report.md");

    let report = `# Performance Monitoring Report\n\n`;
    report += `**Generated:** ${this.metrics.timestamp}\n\n`;

    // Core Web Vitals
    if (Object.keys(this.metrics.coreWebVitals).length > 0) {
      report += `## Core Web Vitals\n\n`;
      report += `| Metric | Score | Value | Status |\n`;
      report += `|--------|-------|-------|--------|\n`;

      Object.entries(this.metrics.coreWebVitals).forEach(([metric, data]) => {
        if (data && typeof data === "object" && data.score !== undefined) {
          const status = this.getMetricStatus(metric, data.score);
          report += `| ${metric.toUpperCase()} | ${data.score} | ${
            data.displayValue || "N/A"
          } | ${status} |\n`;
        }
      });
    }

    // Bundle Metrics
    if (Object.keys(this.metrics.bundleMetrics).length > 0) {
      report += `\n## Bundle Metrics\n\n`;
      report += `- **Total Size:** ${this.metrics.bundleMetrics.totalSizeMB}MB (${this.metrics.bundleMetrics.totalSizeKB}KB)\n`;
      report += `- **File Count:** ${this.metrics.bundleMetrics.fileCount}\n`;
      report += `- **Average Size:** ${this.metrics.bundleMetrics.averageSizeKB}KB per file\n`;
    }

    // Budget Violations
    if (
      this.metrics.budgetViolations &&
      this.metrics.budgetViolations.length > 0
    ) {
      report += `\n## Budget Violations\n\n`;
      this.metrics.budgetViolations.forEach((violation) => {
        report += `- **${violation.metric}**: ${violation.current} (exceeds ${
          violation.budget
        }) - ${violation.severity.toUpperCase()}\n`;
      });
    }

    // Recommendations
    report += `\n## Recommendations\n\n`;
    report += `- Monitor Core Web Vitals regularly\n`;
    report += `- Implement code splitting for large bundles\n`;
    report += `- Use dynamic imports for non-critical components\n`;
    report += `- Optimize images and fonts\n`;
    report += `- Enable compression and caching\n`;

    fs.writeFileSync(reportPath, report);
  }

  /**
   * Get status emoji for metric score
   */
  getMetricStatus(metric, score) {
    if (score >= 90) return "✅ Good";
    if (score >= 50) return "⚠️ Needs Improvement";
    return "❌ Poor";
  }
}

// Run monitoring if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.monitorPerformance().catch(console.error);
}

module.exports = PerformanceMonitor;
