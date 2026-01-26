# Testing Quick Reference

## 🚀 Essential Commands

### Daily Development

```bash
# Run all tests with coverage
npm test

# Watch mode (during development)
npm run test:watch

# E2E tests
npm run e2e

# Visual regression tests
npm run visual:test

# Performance check
npm run lhci

# Performance monitoring
npm run test:performance    # Comprehensive performance testing
npm run bundle:analyze      # Bundle size analysis
npm run web-vitals:track   # Web Vitals tracking
npm run monitor:all         # All monitoring tools

# Storybook tests
npm run test:sb
```

### Test UI & Debugging

```bash
# Debug unit tests
npm run test:ui

# Debug E2E tests
npm run e2e:ui

# Debug with browser
npx playwright test --debug

# Run tests in headed mode
npx playwright test --headed
```

## 📊 Current Test Status

- **Unit Tests**: 94.88% ✅ (Target: >85%)
- **Integration Tests**: 5 comprehensive test suites ✅
- **E2E Tests**: 92 tests across 4 browsers ✅
- **Visual Regression**: 23 tests per browser ✅
- **Accessibility Tests**: WCAG 2.1 AA compliance ✅
- **Performance Tests**: Lighthouse CI with budgets ✅
- **Bundle Analysis**: Real-time monitoring with budgets ✅
- **Web Vitals Tracking**: Core Web Vitals collection ✅
- **Performance Optimization**: React.memo + code splitting ✅

## 🔧 Common Test Commands

### Unit Testing

```bash
# Run specific test file
npm test -- --run tests/unit/Component.test.jsx

# Run tests matching pattern
npm test -- --run Component

# Run with coverage report
npm test -- --coverage

# Run in watch mode
npm run test:watch
```

### E2E Testing

```bash
# Run specific test file
npm run e2e -- tests/e2e/homepage.spec.ts

# Run specific project (browser)
npm run e2e -- --project=chromium

# Run with headed browser
npm run e2e -- --headed

# Run with debug mode
npm run e2e -- --debug
```

### Visual Regression

```bash
# Update snapshots for all projects
npm run visual:update

# Update snapshots for specific project
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts --project=chromium

# View test results
npx playwright show-report
```

### Performance Testing

```bash
# Run mobile performance test
npm run lhci:mobile

# Run desktop performance test
npm run lhci:desktop

# Run with custom budget
npm run performance:budget
```

### Accessibility Testing

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

## 📱 Browser Support

| Browser     | Project Name | Status          |
| ----------- | ------------ | --------------- |
| **Chrome**  | `chromium`   | ✅ Full Support |
| **Firefox** | `firefox`    | ✅ Full Support |
| **Safari**  | `webkit`     | ✅ Full Support |
| **Mobile**  | `mobile`     | ✅ Full Support |

## 🎯 Testing Best Practices

### 1. Test Structure (AAA Pattern)

```jsx
test("should do something", () => {
  // Arrange: Set up test data
  const data = { name: "Test" };

  // Act: Perform the action
  const result = processData(data);

  // Assert: Verify the outcome
  expect(result).toBe("Processed Test");
});
```

### 2. Query Priority

1. **`getByRole`** - Most accessible, tests user experience
2. **`getByLabelText`** - For form inputs
3. **`getByText`** - For content
4. **`getByTestId`** - Last resort, avoid when possible

### 3. Async Testing

```jsx
test("async operation", async () => {
  const user = userEvent.setup();

  render(<Component />);
  const button = screen.getByRole("button");

  await user.click(button);
  await waitFor(() => {
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
```

### 4. Responsive Testing

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

## 🔍 Common Issues & Solutions

### Visual Regression Failures

```bash
# Regenerate snapshots
npm run visual:update

# Check for environment differences
# Ensure deterministic rendering in Playwright config
```

### E2E Test Failures

```bash
# Use waitFor instead of waitForTimeout
await page.waitForSelector("button", { state: "visible" });

# Use role-based selectors
await page.getByRole("button", { name: "Submit" }).click();

# Check for selector changes
# Verify component structure hasn't changed
```

### Performance Test Failures

```bash
# Check Chrome path on macOS
# Ensure arm64 Chrome for Apple Silicon
# Verify performance budgets in config/lighthouse.json
```

### Unit Test Failures

```bash
# Check for missing imports
# Verify component exports
# Ensure test environment setup
# Check for component changes
```

## 📈 Performance Budgets

### Lighthouse CI Targets

- **Performance Score**: >80
- **Accessibility Score**: >80
- **Best Practices**: >90
- **SEO Score**: >90

### Core Web Vitals

- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1

### Performance Budgets

- **First Contentful Paint**: <3000ms
- **Largest Contentful Paint**: <5000ms
- **First Input Delay**: <100ms
- **TTFB**: <700ms

## 🔄 CI/CD Pipeline Jobs

1. **Unit Tests** (Node 18, 20) - Coverage reporting
2. **E2E Tests** (Chromium, Firefox, WebKit) - Cross-browser testing
3. **Visual Regression Tests** - Screenshot comparison
4. **Performance Tests** - Lighthouse CI with budgets
5. **Storybook Tests** - Component testing & accessibility
6. **Lint & Format** - Code quality & formatting
7. **Build Verification** - Next.js & Storybook builds

## 📁 Test File Structure

```
tests/
├── unit/                          # Component tests
│   ├── Button.test.jsx           # 12 tests
│   ├── Logo.test.jsx             # 12 tests
│   ├── RuleCard.test.jsx         # 18 tests
│   ├── SectionHeader.test.jsx    # 17 tests
│   ├── NumberedCard.test.jsx     # 18 tests
│   └── ...                       # Other component tests
├── integration/                   # Integration tests
│   ├── component-interactions.integration.test.jsx
│   ├── page-flow.integration.test.jsx
│   ├── user-journey.integration.test.jsx
│   ├── layout.integration.test.jsx
│   └── ContentLockup.integration.test.jsx
├── accessibility/                 # Accessibility-focused tests
│   ├── unit/                     # Unit-level accessibility (jest-axe)
│   │   └── components.test.jsx   # Component accessibility tests
│   └── e2e/                      # E2E accessibility (Playwright + axe-core)
│       └── wcag-compliance.spec.ts # WCAG compliance tests
└── e2e/                          # General E2E tests
    ├── homepage.spec.ts          # Homepage functionality
    ├── user-journeys.spec.ts     # User workflows
    ├── header.responsive.spec.js # Responsive header
    ├── footer.responsive.spec.js # Responsive footer
    ├── visual-regression.spec.ts # Visual consistency
    ├── accessibility.spec.ts     # General accessibility tests
    └── performance.spec.ts       # Performance metrics
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
npm run visual:update

# Review changes
git diff tests/e2e/visual-regression.spec.ts-snapshots/

# Commit updated snapshots
git add tests/e2e/visual-regression.spec.ts-snapshots/
git commit -m "Update visual regression snapshots for [describe changes]"
```

## 📈 Monitoring

### Test Metrics

- **Unit Tests**: 305 tests (94.88% coverage)
- **E2E Tests**: 92 tests (4 browsers)
- **Visual Screenshots**: 92 baselines per browser
- **Coverage**: >85% target (exceeded)

### CI Metrics

- **Pipeline Jobs**: 7 parallel jobs
- **Execution Time**: Monitor build performance
- **Success Rate**: Track pipeline stability
- **Artifacts**: Test results and screenshots

## 🔗 Useful Links

- **Full Testing Documentation**: [docs/guides/testing-framework.md](./testing-framework.md)
- **Vitest Docs**: https://vitest.dev/
- **Playwright Docs**: https://playwright.dev/
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci

---

**Quick Reference Version**: December 2024  
**For detailed guidelines, see [testing-framework.md](./testing-framework.md)**
