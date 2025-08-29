const { defineConfig } = require("vitest/config");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
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
