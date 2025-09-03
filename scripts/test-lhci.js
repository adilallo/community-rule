#!/usr/bin/env node

/**
 * Simple test script to verify LHCI configuration
 * This script validates the configuration without running actual tests
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Testing LHCI Configuration...\n");

// Check if .lighthouserc.json exists
const configPath = path.join(process.cwd(), ".lighthouserc.json");
if (fs.existsSync(configPath)) {
  console.log("✅ .lighthouserc.json found");

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    console.log("✅ Configuration is valid JSON");

    if (config.ci && config.ci.collect && config.ci.assert) {
      console.log("✅ Configuration has required sections (collect, assert)");
      console.log(`✅ Testing ${config.ci.collect.numberOfRuns} runs`);
      console.log(`✅ URL: ${config.ci.collect.url[0]}`);
    } else {
      console.log("❌ Configuration missing required sections");
    }
  } catch (error) {
    console.log("❌ Configuration is not valid JSON:", error.message);
  }
} else {
  console.log("❌ .lighthouserc.json not found");
}

// Check if @lhci/cli is installed
try {
  const { execSync } = require("child_process");
  execSync("npx lhci --version", { stdio: "pipe" });
  console.log("✅ @lhci/cli package is installed and working");
} catch (error) {
  console.log("❌ @lhci/cli package is not working:", error.message);
}

// Check package.json scripts
const packagePath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packagePath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    if (packageJson.scripts && packageJson.scripts.lhci) {
      console.log("✅ LHCI script found in package.json");
    } else {
      console.log("❌ LHCI script not found in package.json");
    }
  } catch (error) {
    console.log("❌ Error reading package.json:", error.message);
  }
}

console.log("\n🎉 LHCI Configuration Test Complete!");
console.log(
  "Note: Actual LHCI tests may fail locally due to Node.js architecture issues on macOS.",
);
console.log(
  "The CI environment should work correctly with the provided configuration.",
);
