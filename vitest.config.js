import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // Enables React transform
    react({ jsxRuntime: "automatic" }),
  ],

  // Key part: make .js be parsed as JSX *before* import-analysis
  esbuild: {
    jsx: "automatic",
    loader: "jsx", // default loader
    include: /(?:^|\/)(app|components|pages|src|tests)\/.*\.[jt]sx?$/, // match your folders
    exclude: [/node_modules/],
  },

  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"], // match your actual filename
    include: [
      "tests/unit/**/*.test.{js,jsx,ts,tsx}",
      "tests/integration/**/*.test.{js,jsx,ts,tsx}",
    ],
    css: true,
    transformMode: { web: [/\.[jt]sx?$/] }, // ensure web transform for JSX
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: { lines: 85, functions: 85, statements: 85, branches: 80 },
    },
    pool: "threads",
    testTimeout: 10000,
  },
});
