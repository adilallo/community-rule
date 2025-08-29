# Testing Quick Reference

## 🚀 Essential Commands

### Daily Development

```bash
# Run all tests
npm test

# Watch mode (during development)
npm run test:watch

# E2E tests
npm run e2e

# Performance check
npm run lhci
```

### Visual Regression

```bash
# Update baselines after intentional changes
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots

# Check for visual changes
npx playwright test tests/e2e/visual-regression.spec.ts
```

### Debugging

```bash
# Debug unit tests
npm run test:ui

# Debug E2E tests
npm run e2e:ui

# Debug with browser
npx playwright test --debug
```

## 📝 Writing Tests

### Unit Test Template

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

### E2E Test Template

```typescript
// tests/e2e/feature.spec.ts
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

## 🔧 Common Testing Patterns

### Testing User Interactions

```jsx
// Unit test
import userEvent from "@testing-library/user-event";

test("handles user input", async () => {
  const user = userEvent.setup();
  render(<Form />);

  await user.type(screen.getByLabelText("Email"), "test@example.com");
  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(screen.getByText("Success")).toBeInTheDocument();
});
```

### Testing Async Operations

```jsx
// Unit test
test("loads data", async () => {
  render(<DataComponent />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument();
  });
});
```

### Testing Accessibility

```typescript
// E2E test
import { runA11y } from "./axe";

test("meets accessibility standards", async ({ page }) => {
  await page.goto("/");
  const violations = await runA11y(page);
  expect(violations).toEqual([]);
});
```

## 🎯 Test Coverage Targets

- **Lines**: 85%
- **Functions**: 85%
- **Statements**: 85%
- **Branches**: 80%

## 🚨 Common Issues & Solutions

### Unit Tests

```bash
# Issue: JSX not parsing in .js files
# Solution: Ensure vitest.config.js has proper esbuild config

# Issue: Component not rendering
# Solution: Check imports and component exports

# Issue: Test cleanup errors
# Solution: Add afterEach(cleanup()) to test suites
```

### E2E Tests

```bash
# Issue: Element not found
# Solution: Use semantic selectors (role, text, label)

# Issue: Test timeout
# Solution: Add proper waitFor or waitForLoadState

# Issue: Multiple elements with same selector
# Solution: Use .first(), .nth(), or more specific selectors
```

### Visual Regression

```bash
# Issue: Screenshots don't match
# Solution: Check if changes are intentional, then update baselines

# Issue: Elements not visible
# Solution: Ensure elements are in viewport before screenshot
```

## 📊 Performance Budgets

### Lighthouse CI Targets

- **Performance Score**: >90
- **Accessibility Score**: >95
- **Best Practices**: >90
- **SEO Score**: >90

### Core Web Vitals

- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1

## 🔄 CI/CD Pipeline Jobs

1. **Unit Tests** (Node 18, 20)
2. **E2E Tests** (Chromium, Firefox, WebKit)
3. **Visual Regression Tests**
4. **Performance Tests**
5. **Storybook Tests**
6. **Lint & Format**
7. **Build Verification**

## 📁 Test File Structure

```
tests/
├── unit/                          # Component tests
│   ├── Button.test.jsx
│   ├── HeroBanner.test.jsx
│   └── ...
├── integration/                   # Integration tests
│   └── ContentLockup.integration.test.jsx
└── e2e/                          # E2E tests
    ├── homepage.spec.ts
    ├── user-journeys.spec.ts
    ├── edge-cases.spec.ts
    └── visual-regression.spec.ts
```

## 🎨 Visual Regression Screenshots

### Generated Screenshots

- Full page (mobile, tablet, desktop)
- Component sections (hero, logo wall, cards)
- Interactive states (hover, focus, loading)
- Special modes (dark, high contrast, reduced motion)

### Managing Changes

```bash
# Intentional changes
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots

# Review changes
npx playwright test tests/e2e/visual-regression.spec.ts
```

## 📈 Monitoring

### Test Metrics

- **Unit Tests**: 124 tests
- **E2E Tests**: 308 tests (4 browsers)
- **Visual Screenshots**: 92 baselines
- **Coverage**: >85% target

### CI Metrics

- **Pipeline Jobs**: 7 parallel jobs
- **Execution Time**: Monitor build performance
- **Success Rate**: Track pipeline stability
- **Artifacts**: Test results and screenshots

## 🔗 Useful Links

- [Full Testing Documentation](TESTING.md)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Quick Reference Version**: December 2024
