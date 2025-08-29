# Testing Framework Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Unit & Integration Testing](#unit--integration-testing)
- [E2E Testing](#e2e-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Testing](#performance-testing)
- [Storybook Testing](#storybook-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Development Workflow](#development-workflow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Monitoring & Metrics](#monitoring--metrics)

## 🎯 Overview

This project uses a comprehensive testing framework with multiple layers of testing to ensure code quality, functionality, and visual consistency across all browsers and devices.

### Testing Stack

- **Unit/Integration**: Vitest + JSDOM + React Testing Library
- **E2E**: Playwright (Chromium, Firefox, WebKit, Mobile)
- **Visual Regression**: Playwright Screenshots
- **Performance**: Lighthouse CI
- **Accessibility**: Axe-core + Storybook
- **CI/CD**: Gitea Actions

### Test Coverage

- ✅ **124 Unit Tests** (8 components + 1 integration)
- ✅ **308 E2E Tests** (4 browsers × 77 tests)
- ✅ **92 Visual Regression Screenshots**
- ✅ **Performance Budgets**
- ✅ **Accessibility Compliance**

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# All unit tests with coverage
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests
npm run e2e

# Performance tests
npm run lhci

# Storybook tests
npm run test:sb
```

## 📁 Test Structure

```
tests/
├── unit/                          # Component unit tests
│   ├── Button.test.jsx           # 113 lines
│   ├── HeroBanner.test.jsx       # 143 lines
│   ├── FeatureGrid.test.jsx      # 146 lines
│   ├── LogoWall.test.jsx         # 170 lines
│   ├── NumberedCards.test.jsx    # 196 lines
│   ├── RuleStack.test.jsx        # 207 lines
│   ├── QuoteBlock.test.jsx       # 223 lines
│   └── AskOrganizer.test.jsx     # 294 lines
├── integration/                   # Component integration tests
│   └── ContentLockup.integration.test.jsx  # 157 lines
└── e2e/                          # End-to-end tests
    ├── homepage.spec.ts          # 18 tests per browser
    ├── user-journeys.spec.ts     # 13 tests per browser
    ├── edge-cases.spec.ts        # 18 tests per browser
    └── visual-regression.spec.ts # 23 tests per browser
```

## 🧪 Unit & Integration Testing

### Framework

- **Vitest**: Fast unit test runner
- **JSDOM**: Browser environment simulation
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking

### Configuration

```javascript
// vitest.config.js
export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    coverage: {
      provider: "v8",
      thresholds: { lines: 85, functions: 85, statements: 85, branches: 80 },
    },
  },
});
```

### Writing Unit Tests

```jsx
// tests/unit/Component.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import Component from "../../app/components/Component";

describe("Component", () => {
  afterEach(() => cleanup());

  test("renders correctly", () => {
    render(<Component />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

### Available Scripts

```bash
npm test              # Run all tests with coverage
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
```

## 🌐 E2E Testing

### Framework

- **Playwright**: Cross-browser E2E testing
- **Browsers**: Chromium, Firefox, WebKit, Mobile
- **Accessibility**: Axe-core integration

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./tests/e2e",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["iPhone 12"] } },
  ],
});
```

### Test Categories

#### 1. Homepage Tests (18 tests per browser)

- Page loading and sections
- Component functionality
- Navigation and interactions
- Responsive design
- Accessibility compliance
- Performance metrics

#### 2. User Journey Tests (13 tests per browser)

- Complete user workflows
- Feature exploration
- Contact flows
- Learning paths
- Navigation patterns

#### 3. Edge Cases Tests (18 tests per browser)

- Network conditions
- Browser behavior
- Error scenarios
- Accessibility edge cases
- Performance under stress

#### 4. Visual Regression Tests (23 tests per browser)

- Full page screenshots
- Component screenshots
- Responsive screenshots
- Interactive states

### Writing E2E Tests

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should work correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/CommunityRule/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
```

### Available Scripts

```bash
npm run e2e           # Run all E2E tests
npm run e2e:ui        # Run E2E tests with UI
npm run e2e:serve     # Start dev server and run tests
```

## 🎨 Visual Regression Testing

### Overview

Visual regression testing ensures UI consistency across browsers and prevents unintended visual changes.

### Screenshots Generated

- **Full page screenshots** (mobile, tablet, desktop)
- **Component screenshots** (hero, logo wall, cards, etc.)
- **Interactive states** (hover, focus, loading, error)
- **Special modes** (dark mode, high contrast, reduced motion)

### Baseline Screenshots

```
tests/e2e/visual-regression.spec.ts-snapshots/
├── homepage-full-chromium-darwin.png
├── homepage-mobile-chromium-darwin.png
├── hero-banner-chromium-darwin.png
├── logo-wall-chromium-darwin.png
└── ... (92 total screenshots)
```

### Managing Visual Changes

```bash
# Update baselines after intentional changes
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots

# Run visual regression tests
npx playwright test tests/e2e/visual-regression.spec.ts
```

### Cross-Browser Coverage

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)
- **Mobile** (Mobile Chrome)

## ⚡ Performance Testing

### Framework

- **Lighthouse CI**: Automated performance testing
- **Performance Budgets**: Defined thresholds

### Configuration

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm run preview"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

### Performance Metrics

- **Core Web Vitals**: LCP, FID, CLS
- **Performance Score**: Overall performance rating
- **Accessibility Score**: WCAG compliance
- **Best Practices**: Web development standards
- **SEO Score**: Search engine optimization

### Available Scripts

```bash
npm run lhci          # Run Lighthouse CI
```

## 📚 Storybook Testing

### Framework

- **Storybook**: Component development environment
- **@storybook/test-runner**: Automated testing
- **@storybook/test**: Testing utilities

### Configuration

```javascript
// .storybook/preview.js
export const parameters = {
  a11y: { element: "#storybook-root", manual: false },
  viewport: { defaultViewport: "responsive" },
  chromatic: { viewports: [360, 768, 1024, 1440] },
};
```

### Testing Features

- **Accessibility Testing**: Automated WCAG compliance
- **Visual Testing**: Component screenshots
- **Interaction Testing**: User interactions
- **Responsive Testing**: Multiple viewports

### Available Scripts

```bash
npm run storybook     # Start Storybook dev server
npm run test:sb       # Run Storybook tests
npm run build-storybook # Build Storybook
```

## 🔄 CI/CD Pipeline

### Gitea Actions Workflow

Location: `.gitea/workflows/ci.yml`

### Pipeline Jobs

#### 1. Unit Tests

- **Node.js versions**: 18, 20
- **Coverage reporting**: Codecov integration
- **Parallel execution**: Matrix strategy

#### 2. E2E Tests

- **Browsers**: Chromium, Firefox, WebKit
- **Parallel execution**: Matrix strategy
- **Artifact upload**: Test results and reports

#### 3. Visual Regression Tests

- **Screenshot comparison**: Baseline vs current
- **Artifact upload**: Screenshot diffs
- **Cross-browser validation**

#### 4. Performance Tests

- **Lighthouse CI**: Performance budgets
- **Core Web Vitals**: Monitoring
- **Accessibility compliance**

#### 5. Storybook Tests

- **Component testing**: Automated tests
- **Accessibility validation**: WCAG compliance
- **Build verification**: Storybook compilation

#### 6. Lint & Format

- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Type checking**: TypeScript validation

#### 7. Build Verification

- **Next.js build**: Application compilation
- **Storybook build**: Documentation compilation

### Triggers

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

## 🛠 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-component

# Write tests first (TDD)
npm run test:watch

# Implement feature
# Ensure tests pass

# Run E2E tests
npm run e2e

# Commit changes
git add .
git commit -m "feat: add new component with tests"
```

### 2. Pull Request Process

1. **Create PR** → CI pipeline starts automatically
2. **Review CI Results** → All 7 jobs must pass
3. **Check Coverage** → Ensure >85% coverage
4. **Review Visual Changes** → Check screenshot diffs
5. **Merge** → Only if all checks pass

### 3. Visual Changes

```bash
# Make visual changes
# Run visual regression tests
npm run e2e:serve
npx playwright test tests/e2e/visual-regression.spec.ts

# If changes are intentional, update baselines
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots
```

### 4. Performance Monitoring

```bash
# Check performance before deploying
npm run lhci

# Review performance budgets
# Update lighthouserc.json if needed
```

## 📋 Best Practices

### 1. Test-Driven Development

- Write tests before implementation
- Use descriptive test names
- Test edge cases and error scenarios
- Maintain high test coverage

### 2. Component Testing

```jsx
// Good: Test behavior, not implementation
test("shows error message when form is invalid", () => {
  render(<Form />);
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByText("Please fill all fields")).toBeInTheDocument();
});

// Avoid: Testing implementation details
test("calls onSubmit with form data", () => {
  const mockSubmit = vi.fn();
  render(<Form onSubmit={mockSubmit} />);
  // Implementation details...
});
```

### 3. E2E Testing

- Test user workflows, not technical details
- Use semantic selectors (role, text, label)
- Test accessibility features
- Include error scenarios

### 4. Visual Regression

- Update baselines only for intentional changes
- Review screenshot diffs carefully
- Test across multiple viewports
- Consider animation states

### 5. Performance Testing

- Set realistic performance budgets
- Monitor Core Web Vitals
- Test on different network conditions
- Regular performance audits

## 🔧 Troubleshooting

### Common Issues

#### 1. Unit Tests Failing

```bash
# Run tests locally
npm test

# Check for:
# - Missing imports
# - Incorrect assertions
# - Component changes
# - Test environment issues
```

#### 2. E2E Tests Failing

```bash
# Run locally first
npm run e2e:serve
npm run e2e

# Common issues:
# - Selector changes
# - Component structure changes
# - Network issues
# - Browser compatibility
```

#### 3. Visual Regression Failing

```bash
# Check if changes are intentional
npx playwright test tests/e2e/visual-regression.spec.ts

# Update baselines if needed
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots

# Review screenshot diffs in CI artifacts
```

#### 4. Performance Tests Failing

```bash
# Run locally
npm run lhci

# Check performance budgets in lighthouserc.json
# Optimize slow components
# Review bundle size
```

#### 5. CI Pipeline Issues

```bash
# Check Gitea Actions logs
# Verify workflow configuration
# Check for missing dependencies
# Review environment variables
```

### Debug Commands

```bash
# Debug unit tests
npm run test:ui

# Debug E2E tests
npm run e2e:ui

# Debug with browser dev tools
npx playwright test --debug

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run tests in headed mode
npx playwright test --headed
```

## 📊 Monitoring & Metrics

### 1. Test Coverage

- **Target**: >85% line coverage
- **Monitoring**: Codecov integration
- **Trends**: Track coverage over time
- **Reports**: Available in CI artifacts

### 2. Performance Metrics

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Performance Score**: >90
- **Accessibility Score**: >95
- **Monitoring**: Lighthouse CI reports

### 3. Visual Regression

- **Baseline Screenshots**: 92 total
- **Cross-browser Coverage**: 4 browsers
- **Responsive Testing**: 4 viewports
- **Monitoring**: Screenshot diffs in CI

### 4. E2E Test Results

- **Total Tests**: 308 across 4 browsers
- **Success Rate**: Monitor test stability
- **Execution Time**: Track performance
- **Reports**: Available in CI artifacts

### 5. CI Pipeline Health

- **Job Success Rate**: Monitor pipeline stability
- **Execution Time**: Track build performance
- **Resource Usage**: Monitor CI costs
- **Failure Analysis**: Identify common issues

## 📚 Additional Resources

### Documentation

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Storybook Testing](https://storybook.js.org/docs/writing-tests/introduction)

### Tools

- [Codecov](https://codecov.io/) - Coverage reporting
- [Axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing
- [MSW](https://mswjs.io/) - API mocking

### Best Practices

- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [E2E Testing Guide](https://playwright.dev/docs/best-practices)
- [Visual Regression Testing](https://storybook.js.org/docs/writing-tests/visual-testing)

---

**Last Updated**: December 2024  
**Framework Version**: Next.js 15 + React 19 + Tailwind 4 + Storybook 9
