import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    // Transform CSS imports to empty modules to avoid jsdom parsing errors
    {
      name: "css-mock",
      load(id) {
        if (id.endsWith(".css")) {
          return "export default {};";
        }
      },
    },
  ],
  esbuild: {
    target: "node18",
    jsx: "automatic",
    loader: "tsx",
    include: /\.[jt]sx?$/,
    exclude: [/node_modules/],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "tests/components/**/*.test.{js,jsx,ts,tsx}",
      "tests/pages/**/*.test.{js,jsx,ts,tsx}",
      "tests/utils/**/*.test.{js,jsx,ts,tsx}",
      "tests/unit/**/*.test.{js,jsx,ts,tsx}", // Legacy - remaining non-component tests
      "tests/e2e/**/*.e2e.test.{js,jsx,ts,tsx}",
    ],
    exclude: [
      "tests/e2e/**/*.spec.{js,jsx,ts,tsx}",
    ],
    // Disable CSS processing in tests to avoid jsdom parsing errors with Tailwind v4
    // Tailwind classes are still available via JIT compilation
    css: false,
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
      // Global thresholds intentionally removed to prioritize simplicity
      // over strict coverage gating. Use reports for guidance instead.
      enabled: !(typeof process !== "undefined" && process.env.CI),
    },
    pool: "threads", // Use threads for better performance
    testTimeout: 60000, // 60s timeout for all tests
    hookTimeout: 60000, // 60s timeout for hooks
    teardownTimeout: 60000, // 60s timeout for teardown
    // Conservative settings for stability
    maxConcurrency: 1, // Single test at a time to avoid resource contention
    maxThreads: 1, // Single thread to avoid resource contention
    minThreads: 1, // Minimum threads
    retry: 0, // No retries to avoid masking issues
    // Stability measures
    isolate: true, // Enable isolation for better test stability
    passWithNoTests: true, // Don't fail if no tests found
    // Timeout settings
    workerTimeout: 120000, // 2min for worker timeout
    poolTimeout: 120000, // 2min for pool timeout
    // Optimize dependencies
    deps: {
      inline: ["@testing-library/jest-dom"], // Inline testing library
    },
  },
});
