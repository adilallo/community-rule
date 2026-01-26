#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes webpack bundles and provides detailed performance insights
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BUNDLE_ANALYSIS_DIR = path.join(__dirname, "..", ".next", "analyze");
const PERFORMANCE_BUDGETS = require("../config/performance-budgets.json");

class BundleAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      bundles: {},
      recommendations: [],
      budgetViolations: [],
    };
  }

  /**
   * Run bundle analysis using build output
   */
  async analyzeBundles() {
    console.log("🔍 Starting bundle analysis...");

    try {
      // Ensure analyze directory exists
      if (!fs.existsSync(BUNDLE_ANALYSIS_DIR)) {
        fs.mkdirSync(BUNDLE_ANALYSIS_DIR, { recursive: true });
      }

      // Build the project first
      console.log("🏗️ Building project...");
      execSync("npm run build", { stdio: "inherit" });

      // Parse bundle stats from build output
      await this.parseBundleStats();

      // Check performance budgets
      this.checkPerformanceBudgets();

      // Generate recommendations
      this.generateRecommendations();

      // Save results
      this.saveResults();

      console.log("✅ Bundle analysis complete!");
      console.log(`📁 Results saved to: ${BUNDLE_ANALYSIS_DIR}`);
    } catch (error) {
      console.error("❌ Bundle analysis failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Parse bundle statistics from build output
   */
  async parseBundleStats() {
    const staticPath = path.join(__dirname, "..", ".next", "static");
    const chunksPath = path.join(staticPath, "chunks");

    // Analyze static assets
    if (fs.existsSync(staticPath)) {
      this.analyzeDirectory(staticPath, "static");
    }

    // Analyze chunks
    if (fs.existsSync(chunksPath)) {
      this.analyzeDirectory(chunksPath, "chunks");
    }

    // Analyze pages
    const pagesPath = path.join(__dirname, "..", ".next", "server", "pages");
    if (fs.existsSync(pagesPath)) {
      this.analyzeDirectory(pagesPath, "pages");
    }
  }

  /**
   * Analyze directory for bundle sizes
   */
  analyzeDirectory(dirPath, type) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && (file.endsWith(".js") || file.endsWith(".css"))) {
        const key = `${type}/${file}`;
        this.results.bundles[key] = {
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
          lastModified: stats.mtime,
          type: file.endsWith(".css") ? "css" : "js",
        };
      } else if (stats.isDirectory()) {
        this.analyzeDirectory(filePath, `${type}/${file}`);
      }
    });
  }

  /**
   * Check against performance budgets
   */
  checkPerformanceBudgets() {
    const budgets = PERFORMANCE_BUDGETS.budgets || [];

    Object.entries(this.results.bundles).forEach(([filename, bundle]) => {
      const budget = budgets.find(
        (b) => filename.includes(b.name) || b.name === "all",
      );

      if (budget) {
        if (bundle.sizeKB > budget.maxSizeKB) {
          this.results.budgetViolations.push({
            file: filename,
            currentSize: bundle.sizeKB,
            maxSize: budget.maxSizeKB,
            overage: bundle.sizeKB - budget.maxSizeKB,
            severity:
              bundle.sizeKB > budget.maxSizeKB * 1.2 ? "high" : "medium",
          });
        }
      } else {
        // Default budget check for large files
        if (bundle.sizeKB > 500) {
          this.results.budgetViolations.push({
            file: filename,
            currentSize: bundle.sizeKB,
            maxSize: 500,
            overage: bundle.sizeKB - 500,
            severity: bundle.sizeKB > 600 ? "high" : "medium",
          });
        }
      }
    });
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Check for large bundles
    Object.entries(this.results.bundles).forEach(([filename, bundle]) => {
      if (bundle.sizeKB > 500) {
        recommendations.push({
          type: "large-bundle",
          file: filename,
          size: bundle.sizeKB,
          suggestion:
            "Consider code splitting or dynamic imports for this bundle",
        });
      }
    });

    // Check for budget violations
    if (this.results.budgetViolations.length > 0) {
      recommendations.push({
        type: "budget-violation",
        count: this.results.budgetViolations.length,
        suggestion:
          "Review and optimize bundles that exceed performance budgets",
      });
    }

    // General recommendations
    const totalSize = Object.values(this.results.bundles).reduce(
      (sum, bundle) => sum + bundle.sizeKB,
      0,
    );

    if (totalSize > 2000) {
      recommendations.push({
        type: "total-size",
        size: totalSize,
        suggestion: "Consider implementing more aggressive code splitting",
      });
    }

    this.results.recommendations = recommendations;
  }

  /**
   * Save analysis results
   */
  saveResults() {
    // Ensure directory exists
    if (!fs.existsSync(BUNDLE_ANALYSIS_DIR)) {
      fs.mkdirSync(BUNDLE_ANALYSIS_DIR, { recursive: true });
    }

    const resultsPath = path.join(BUNDLE_ANALYSIS_DIR, "bundle-analysis.json");
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));

    // Generate markdown report
    this.generateMarkdownReport();
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport() {
    const reportPath = path.join(BUNDLE_ANALYSIS_DIR, "bundle-report.md");

    let report = `# Bundle Analysis Report\n\n`;
    report += `**Generated:** ${this.results.timestamp}\n\n`;

    // Bundle sizes
    report += `## Bundle Sizes\n\n`;
    report += `| File | Size (KB) | Status |\n`;
    report += `|------|-----------|--------|\n`;

    Object.entries(this.results.bundles).forEach(([filename, bundle]) => {
      const status = bundle.sizeKB > 500 ? "⚠️ Large" : "✅ Good";
      report += `| ${filename} | ${bundle.sizeKB} | ${status} |\n`;
    });

    // Budget violations
    if (this.results.budgetViolations.length > 0) {
      report += `\n## Budget Violations\n\n`;
      this.results.budgetViolations.forEach((violation) => {
        report += `- **${violation.file}**: ${violation.currentSize}KB (exceeds ${violation.maxSize}KB by ${violation.overage}KB)\n`;
      });
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      report += `\n## Recommendations\n\n`;
      this.results.recommendations.forEach((rec) => {
        report += `- ${rec.suggestion}\n`;
      });
    }

    fs.writeFileSync(reportPath, report);
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyzeBundles().catch(console.error);
}

module.exports = BundleAnalyzer;
