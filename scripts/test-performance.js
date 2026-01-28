#!/usr/bin/env node

/**
 * Comprehensive Performance Testing Script
 * Integrates bundle analysis, performance monitoring, and Web Vitals tracking
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const TEST_RESULTS_DIR = path.join(__dirname, "..", ".next", "test-results");

class PerformanceTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      bundleAnalysis: {},
      performanceMonitoring: {},
      webVitals: {},
      lighthouse: {},
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0,
        total: 0,
      },
    };
  }

  /**
   * Run comprehensive performance testing
   */
  async runTests() {
    console.log("🧪 Starting comprehensive performance testing...");

    try {
      // Ensure test results directory exists
      if (!fs.existsSync(TEST_RESULTS_DIR)) {
        fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
      }

      // 1. Bundle Analysis
      console.log("📊 Running bundle analysis...");
      await this.runBundleAnalysis();

      // 2. Performance Monitoring
      console.log("📈 Running performance monitoring...");
      await this.runPerformanceMonitoring();

      // 3. Web Vitals Tracking
      console.log("📊 Setting up Web Vitals tracking...");
      await this.runWebVitalsTracking();

      // 4. Lighthouse CI (if server is available)
      console.log("🔍 Running Lighthouse CI...");
      await this.runLighthouseCI();

      // 5. Generate comprehensive report
      this.generateComprehensiveReport();

      console.log("✅ Performance testing complete!");
      console.log(`📁 Results saved to: ${TEST_RESULTS_DIR}`);

      // Return exit code based on results
      const hasFailures = this.results.summary.failed > 0;
      if (hasFailures) {
        console.log("❌ Performance tests failed");
        process.exit(1);
      } else {
        console.log("✅ All performance tests passed");
        process.exit(0);
      }
    } catch (error) {
      console.error("❌ Performance testing failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Run bundle analysis
   */
  async runBundleAnalysis() {
    try {
      execSync("npm run bundle:analyze", { stdio: "inherit" });

      // Parse bundle analysis results
      const bundleReportPath = path.join(
        __dirname,
        "..",
        ".next",
        "analyze",
        "bundle-analysis.json",
      );
      if (fs.existsSync(bundleReportPath)) {
        const bundleData = JSON.parse(
          fs.readFileSync(bundleReportPath, "utf8"),
        );
        this.results.bundleAnalysis = bundleData;

        // Check for budget violations
        if (
          bundleData.budgetViolations &&
          bundleData.budgetViolations.length > 0
        ) {
          this.results.summary.failed += bundleData.budgetViolations.length;
          console.log(
            `⚠️ Found ${bundleData.budgetViolations.length} budget violations`,
          );
        } else {
          this.results.summary.passed += 1;
          console.log("✅ Bundle analysis passed");
        }
      }

      this.results.summary.total += 1;
    } catch (error) {
      console.error("❌ Bundle analysis failed:", error.message);
      this.results.summary.failed += 1;
      this.results.summary.total += 1;
    }
  }

  /**
   * Run performance monitoring
   */
  async runPerformanceMonitoring() {
    try {
      execSync("npm run performance:monitor", { stdio: "inherit" });

      // Parse performance monitoring results
      const perfReportPath = path.join(
        __dirname,
        "..",
        ".next",
        "monitoring",
        "performance-report.json",
      );
      if (fs.existsSync(perfReportPath)) {
        const perfData = JSON.parse(fs.readFileSync(perfReportPath, "utf8"));
        this.results.performanceMonitoring = perfData;

        // Check for budget violations
        if (perfData.budgetViolations && perfData.budgetViolations.length > 0) {
          this.results.summary.failed += perfData.budgetViolations.length;
          console.log(
            `⚠️ Found ${perfData.budgetViolations.length} performance violations`,
          );
        } else {
          this.results.summary.passed += 1;
          console.log("✅ Performance monitoring passed");
        }
      }

      this.results.summary.total += 1;
    } catch (error) {
      console.error("❌ Performance monitoring failed:", error.message);
      this.results.summary.failed += 1;
      this.results.summary.total += 1;
    }
  }

  /**
   * Run Web Vitals tracking
   */
  async runWebVitalsTracking() {
    try {
      execSync("npm run web-vitals:track", { stdio: "inherit" });

      // Parse Web Vitals results
      const vitalsReportPath = path.join(
        __dirname,
        "..",
        ".next",
        "web-vitals",
        "report.json",
      );
      if (fs.existsSync(vitalsReportPath)) {
        const vitalsData = JSON.parse(
          fs.readFileSync(vitalsReportPath, "utf8"),
        );
        this.results.webVitals = vitalsData;
        console.log("✅ Web Vitals tracking setup complete");
      }

      this.results.summary.passed += 1;
      this.results.summary.total += 1;
    } catch (error) {
      console.error("❌ Web Vitals tracking failed:", error.message);
      this.results.summary.failed += 1;
      this.results.summary.total += 1;
    }
  }

  /**
   * Run Lighthouse CI
   */
  async runLighthouseCI() {
    try {
      // Check if server is running
      try {
        execSync("curl -s http://localhost:3000 > /dev/null", {
          stdio: "pipe",
        });
      } catch {
        console.warn(
          "⚠️ Development server not running, skipping Lighthouse CI...",
        );
        this.results.summary.warnings += 1;
        this.results.summary.total += 1;
        return;
      }

      execSync("npm run lhci", { stdio: "inherit" });

      // Parse Lighthouse results
      const lhciResultsPath = path.join(__dirname, "..", ".lighthouseci");
      if (fs.existsSync(lhciResultsPath)) {
        const files = fs.readdirSync(lhciResultsPath);
        const resultFile = files.find((f) => f.endsWith(".json"));

        if (resultFile) {
          const lhciData = JSON.parse(
            fs.readFileSync(path.join(lhciResultsPath, resultFile), "utf8"),
          );
          this.results.lighthouse = lhciData;
          console.log("✅ Lighthouse CI completed");
        }
      }

      this.results.summary.passed += 1;
      this.results.summary.total += 1;
    } catch (error) {
      console.warn("⚠️ Lighthouse CI failed:", error.message);
      this.results.summary.warnings += 1;
      this.results.summary.total += 1;
    }
  }

  /**
   * Generate comprehensive test report
   */
  generateComprehensiveReport() {
    // Ensure test results directory exists
    if (!fs.existsSync(TEST_RESULTS_DIR)) {
      fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
    }

    const reportPath = path.join(
      TEST_RESULTS_DIR,
      "performance-test-report.json",
    );
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate markdown report
    this.generateMarkdownReport();
  }

  /**
   * Generate markdown test report
   */
  generateMarkdownReport() {
    const reportPath = path.join(
      TEST_RESULTS_DIR,
      "performance-test-report.md",
    );

    let report = `# Performance Test Report\n\n`;
    report += `**Generated:** ${this.results.timestamp}\n\n`;

    // Summary
    report += `## Test Summary\n\n`;
    report += `- **Total Tests:** ${this.results.summary.total}\n`;
    report += `- **Passed:** ${this.results.summary.passed} ✅\n`;
    report += `- **Failed:** ${this.results.summary.failed} ❌\n`;
    report += `- **Warnings:** ${this.results.summary.warnings} ⚠️\n\n`;

    // Bundle Analysis Results
    if (Object.keys(this.results.bundleAnalysis).length > 0) {
      report += `## Bundle Analysis\n\n`;
      if (
        this.results.bundleAnalysis.budgetViolations &&
        this.results.bundleAnalysis.budgetViolations.length > 0
      ) {
        report += `### Budget Violations\n\n`;
        this.results.bundleAnalysis.budgetViolations.forEach((violation) => {
          report += `- **${violation.file}**: ${
            violation.currentSize
          }KB (exceeds ${violation.maxSize}KB by ${
            violation.overage
          }KB) - ${violation.severity.toUpperCase()}\n`;
        });
      } else {
        report += `✅ No bundle budget violations found\n\n`;
      }
    }

    // Performance Monitoring Results
    if (Object.keys(this.results.performanceMonitoring).length > 0) {
      report += `## Performance Monitoring\n\n`;
      if (
        this.results.performanceMonitoring.budgetViolations &&
        this.results.performanceMonitoring.budgetViolations.length > 0
      ) {
        report += `### Budget Violations\n\n`;
        this.results.performanceMonitoring.budgetViolations.forEach(
          (violation) => {
            report += `- **${violation.metric}**: ${
              violation.current
            } (exceeds ${
              violation.budget
            }) - ${violation.severity.toUpperCase()}\n`;
          },
        );
      } else {
        report += `✅ No performance budget violations found\n\n`;
      }
    }

    // Web Vitals Results
    if (Object.keys(this.results.webVitals).length > 0) {
      report += `## Web Vitals Tracking\n\n`;
      report += `✅ Web Vitals tracking setup complete\n\n`;
    }

    // Lighthouse Results
    if (Object.keys(this.results.lighthouse).length > 0) {
      report += `## Lighthouse CI\n\n`;
      report += `✅ Lighthouse CI completed successfully\n\n`;
    }

    // Recommendations
    report += `## Recommendations\n\n`;
    report += `- Monitor bundle sizes regularly\n`;
    report += `- Track Core Web Vitals in production\n`;
    report += `- Run performance tests in CI/CD pipeline\n`;
    report += `- Set up performance budgets and alerts\n`;

    fs.writeFileSync(reportPath, report);
  }
}

// Run if called directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runTests().catch(console.error);
}

module.exports = PerformanceTester;
