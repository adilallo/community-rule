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
    pool: "threads",
    testTimeout: 10000,
  },
});
