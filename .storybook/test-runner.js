module.exports = {
  // Test runner configuration
  testMatch: ["**/*.stories.@(js|jsx|ts|tsx)"],
  testTimeout: 30000,
  retries: 2,
  // Fix for the StorybookTestRunnerError initialization issue
  setupFilesAfterEnv: [
    "<rootDir>/node_modules/@storybook/test-runner/jest-setup.js",
  ],
  // Ensure proper module resolution
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  // Test environment configuration
  testEnvironment: "jsdom",
  // Transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-react"] },
    ],
  },
  // Module file extensions
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  // Coverage configuration
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/*.stories.{js,jsx,ts,tsx}",
  ],
};
