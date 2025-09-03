# Testing Framework Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Architecture](#testing-architecture)
- [Quick Start](#quick-start)
- [Test Types & Coverage](#test-types--coverage)
- [Unit & Integration Testing](#unit--integration-testing)
- [E2E Testing](#e2e-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Development Workflow](#development-workflow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The CommunityRule platform uses a comprehensive testing framework with multiple layers to ensure code quality, functionality, visual consistency, and accessibility across all browsers and devices.

### Testing Stack

- **Unit/Integration**: Vitest + JSDOM + React Testing Library
- **E2E**: Playwright (Chromium, Firefox, WebKit, Mobile)
- **Visual Regression**: Playwright Screenshots
- **Performance**: Lighthouse CI
- **Accessibility**: Axe-core + Playwright
- **CI/CD**: Gitea Actions

### Current Status

- ✅ **305 Unit Tests** (94.88% coverage - exceeds 85% target)
- ✅ **92 E2E Tests** across 4 browsers
- ✅ **23 Visual Regression Tests** per browser
- ✅ **Performance Budgets** with Lighthouse CI
- ✅ **WCAG 2.1 AA Compliance** with automated testing

## 🏗 Testing Architecture

### Test Pyramid

- **Unit Tests**: Fast, focused, high coverage (94.88%)
- **Integration Tests**: Component interactions, data flow
- **E2E Tests**: Critical user journeys, cross-browser compatibility

### Testing Philosophy

**JSDOM Limitations**: Unit tests in JSDOM can't truly test responsive behavior since CSS media queries aren't evaluated. Therefore:

- **Unit/Integration Tests**: Test component structure, accessibility, and configuration
- **E2E Tests**: Test real responsive behavior at actual viewport widths
- **Visual Tests**: Capture visual consistency across breakpoints

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Essential Commands

```bash
# Unit tests with coverage
npm test

# E2E tests
npm run e2e

# Visual regression tests
npm run visual:test

# Performance tests
npm run lhci

# Storybook tests
npm run test:sb
```

## 🧪 Test Types & Coverage

### Test Structure

```
tests/
├── unit/                          # Component unit tests
│   ├── Button.test.jsx           # 12 tests
│   ├── Logo.test.jsx             # 12 tests
│   ├── RuleCard.test.jsx         # 18 tests
│   ├── SectionHeader.test.jsx    # 17 tests
│   ├── NumberedCard.test.jsx     # 18 tests
│   └── accessibility.test.jsx    # 18 tests
├── integration/                   # Component integration tests
│   ├── component-interactions.integration.test.jsx
│   ├── page-flow.integration.test.jsx
│   ├── user-journey.integration.test.jsx
│   ├── layout.integration.test.jsx
│   └── ContentLockup.integration.test.jsx
└── e2e/                          # End-to-end tests
    ├── homepage.spec.ts          # Homepage functionality
    ├── user-journeys.spec.ts     # User workflows
    ├── header.responsive.spec.js # Responsive header
    ├── footer.responsive.spec.js # Responsive footer
    ├── visual-regression.spec.ts # Visual consistency
    ├── accessibility.spec.ts     # Accessibility compliance
    └── performance.spec.ts       # Performance metrics
```

### Coverage Requirements

- **Statements**: >85% (Current: 94.88%) ✅
- **Branches**: >80% (Current: 86.93%) ✅
- **Functions**: >80% (Current: 88.67%) ✅
- **Lines**: >85% (Current: 94.88%) ✅

## 🧩 Unit & Integration Testing

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

  test("handles user interactions", async () => {
    const user = userEvent.setup();
    render(<Component />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveClass("clicked");
  });
});
```

### Testing Library Queries (Priority Order)

1. **`getByRole`**: Most accessible, tests user experience
2. **`getByLabelText`**: For form inputs
3. **`getByText`**: For content
4. **`getByTestId`**: Last resort, avoid when possible

### Integration Testing

```jsx
test("components work together", () => {
  render(
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );

  // Test that components complement each other
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
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
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  use: {
    timezoneId: "UTC",
    locale: "en-US",
    headless: true,
  },
});
```

### Test Categories

#### 1. Functional Tests

- Page loading and sections
- Component functionality
- Navigation and interactions
- User workflows

#### 2. Responsive Tests

- Layout changes between breakpoints
- Component visibility at different viewports
- Interactive behavior across screen sizes

#### 3. Accessibility Tests

- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast

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

  test("responsive behavior", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId("mobile-nav")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByTestId("desktop-nav")).toBeVisible();
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

Visual regression testing ensures UI consistency across browsers and prevents unintended visual changes by comparing screenshots against baseline images.

### Configuration

- **Snapshot Template**: `{testDir}/{testFileName}-snapshots/{arg}-{projectName}.png`
- **Deterministic Rendering**: Fixed timezone (UTC), locale (en-US), viewport
- **Tolerance**: 2% pixel difference or 500 pixels maximum
- **Animation Handling**: Disabled during capture

### Screenshots Generated

- **Full page screenshots** (mobile, tablet, desktop)
- **Component screenshots** (hero, logo wall, cards, etc.)
- **Interactive states** (hover, focus, loading, error)
- **Special modes** (dark mode, high contrast, reduced motion)

### Breakpoint Coverage

- **Mobile**: 375x667 (iPhone)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1280x800 (Standard)
- **Large Desktop**: 1920x1080 (Full HD)

### Managing Visual Changes

```bash
# Update baselines after intentional changes
npm run visual:update

# Run visual regression tests
npm run visual:test

# Run with UI for debugging
npm run visual:ui
```

### Snapshot Management

```bash
# Update snapshots for all projects
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts

# Update snapshots for specific project
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts --project=chromium

# View test results
npx playwright show-report
```

## ♿ Accessibility Testing

### Framework

- **Unit Level**: jest-axe with Vitest (`tests/accessibility/unit/`)
- **E2E Level**: Playwright accessibility tests (`tests/accessibility/e2e/`)
- **Standards**: WCAG 2.1 AA compliance

### Test Organization

Accessibility tests are organized in a dedicated `tests/accessibility/` folder:

```
tests/accessibility/
├── unit/                          # Unit-level accessibility tests
│   └── components.test.jsx        # Component accessibility (jest-axe)
└── e2e/                          # E2E accessibility tests
    └── wcag-compliance.spec.ts    # WCAG compliance (Playwright)
```

### Unit-Level Accessibility Testing

```jsx
// tests/accessibility/unit/components.test.jsx
import { axe, toHaveNoViolations } from "jest-axe";

test("component has no accessibility violations", async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### E2E Accessibility Testing

```typescript
// tests/accessibility/e2e/wcag-compliance.spec.ts
import { test, expect } from "@playwright/test";

test("WCAG 2.1 AA compliance - homepage", async ({ page }) => {
  await page.goto("/");

  // Check for proper HTML structure
  const html = page.locator("html");
  const lang = await html.getAttribute("lang");
  expect(lang).toBeTruthy();

  // Check for main heading
  const h1 = page.locator("h1").first();
  await expect(h1).toBeVisible();
});
```

### Running Accessibility Tests

```bash
# Run all accessibility tests
npm test tests/accessibility/

# Run unit accessibility tests only
npm test tests/accessibility/unit/

# Run E2E accessibility tests only
npx playwright test tests/accessibility/e2e/

# Run specific accessibility test
npx playwright test tests/accessibility/e2e/wcag-compliance.spec.ts
```

### Manual Testing Checklist

- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast (WCAG AA)
- [ ] Focus management
- [ ] ARIA attributes
- [ ] Semantic HTML

### WCAG 2.1 AA Requirements

- **Perceivable**: Text alternatives, captions, adaptable content
- **Operable**: Keyboard accessible, timing adjustable, navigation
- **Understandable**: Readable, predictable, input assistance
- **Robust**: Compatible with assistive technologies

## ⚡ Performance Testing

### Framework

- **Lighthouse CI**: Automated performance testing
- **Performance Budgets**: Defined thresholds
- **Core Web Vitals**: LCP, FID, CLS monitoring

### Configuration

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3010"],
      "chromeFlags": [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--headless"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.8 }]
      }
    }
  }
}
```

### Performance Metrics

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Performance Score**: >80
- **Accessibility Score**: >80
- **Best Practices**: >90

### Performance Budgets

- **First Contentful Paint**: <3000ms
- **Largest Contentful Paint**: <5000ms
- **First Input Delay**: <100ms
- **TTFB**: <700ms

### Available Scripts

```bash
npm run lhci          # Run Lighthouse CI
npm run lhci:mobile   # Run with mobile preset
npm run lhci:desktop  # Run with desktop preset
```

## 🔄 CI/CD Pipeline

### Gitea Actions Workflow

Location: `.gitea/workflows/ci.yaml`

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
- **Cross-browser validation**: All 4 browser projects

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
npm run visual:test

# If changes are intentional, update baselines
npm run visual:update

# Review and commit updated snapshots
git add tests/e2e/visual-regression.spec.ts-snapshots/
git commit -m "Update visual regression snapshots for [describe changes]"
```

### 4. Performance Monitoring

```bash
# Check performance before deploying
npm run lhci

# Review performance budgets
# Update .lighthouserc.json if needed
```

## 📋 Best Practices

### 1. Test-Driven Development

- Write tests before implementation
- Use descriptive test names
- Test edge cases and error scenarios
- Maintain high test coverage

### 2. Component Testing

```jsx
// ✅ Good: Test behavior, not implementation
test("shows error message when form is invalid", () => {
  render(<Form />);
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByText("Please fill all fields")).toBeInTheDocument();
});

// ❌ Avoid: Testing implementation details
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

### 6. Responsive Testing

```javascript
// ✅ Good: Test real viewport sizes
await page.setViewportSize({ width: 640, height: 700 });

// ✅ Good: Test visibility at breakpoints
if (bp.name === "xs") {
  await expect(page.getByTestId("auth-xs")).toBeVisible();
}

// ❌ Avoid: Testing responsive behavior in JSDOM
// JSDOM doesn't evaluate CSS media queries
```

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
npm run visual:test

# Update baselines if needed
npm run visual:update

# Review screenshot diffs in CI artifacts
```

#### 4. Performance Tests Failing

```bash
# Run locally
npm run lhci

# Check performance budgets in .lighthouserc.json
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
**Maintained by**: CommunityRule Development Team
