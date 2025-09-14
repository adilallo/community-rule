import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  esbuild: {
    jsx: "automatic",
    loader: "jsx",
    include: /\.[jt]sx?$/,
    exclude: [/node_modules/],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "tests/unit/**/*.test.{js,jsx,ts,tsx}",
      "tests/integration/**/*.test.{js,jsx,ts,tsx}",
      "tests/accessibility/**/*.test.{js,jsx,ts,tsx}",
      "tests/e2e/**/*.test.{js,jsx,ts,tsx}",
    ],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "app/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
        "!**/*.test.{js,jsx,ts,tsx}",
        "!**/*.spec.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
        "!**/tests/**",
      ],
      exclude: [
        "**/node_modules/**",
        "**/tests/**",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/*.spec.{js,jsx,ts,tsx}",
        "**/coverage/**",
        "**/.next/**",
        "**/dist/**",
        "**/build/**",
      ],
      thresholds: { lines: 50, functions: 50, statements: 50, branches: 50 },
    },
    pool: process.env.CI ? "forks" : "threads", // Use forks in CI for better stability
    testTimeout: process.env.CI ? 180000 : 30000, // 180s for CI, 30s for local
    hookTimeout: process.env.CI ? 180000 : 30000, // 180s for CI, 30s for local
    teardownTimeout: process.env.CI ? 180000 : 30000, // 180s for CI, 30s for local
    // CI optimizations
    maxConcurrency: process.env.CI ? 1 : 5, // Single test at a time in CI
    maxThreads: process.env.CI ? 1 : 4, // Single thread in CI
    minThreads: process.env.CI ? 1 : 2, // Minimum threads in CI
    retry: process.env.CI ? 3 : 0, // More retries in CI
    // Additional CI timeout settings
    workerTimeout: process.env.CI ? 300000 : 60000, // 5min for CI, 1min for local
    poolTimeout: process.env.CI ? 300000 : 60000, // 5min for CI, 1min for local
  },
});
