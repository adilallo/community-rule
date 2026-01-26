# Visual Regression Testing Guide

## Overview

Visual regression testing ensures UI consistency across browsers and prevents unintended visual changes by comparing screenshots against baseline images. This guide covers the complete workflow for managing visual regression tests.

## 🚀 Quick Start

### First-Time Setup

```bash
# 1. Generate baseline snapshots for all projects
npm run visual:update

# 2. Verify snapshots were created
ls tests/e2e/visual-regression.spec.ts-snapshots/

# 3. Commit the snapshots
git add tests/e2e/visual-regression.spec.ts-snapshots/
git commit -m "Add baseline visual regression snapshots"

# 4. Verify setup works
npm run visual:test
```

### Daily Workflow

```bash
# Run visual regression tests
npm run visual:test

# Run with UI for debugging
npm run visual:ui

# Update snapshots after UI changes
npm run visual:update
```

## 📝 Managing Visual Changes

### When UI Changes Are Intentional

1. **Make your UI changes** (design updates, component modifications, etc.)

2. **Update snapshots to reflect new design:**

   ```bash
   npm run visual:update
   ```

3. **Review changes:**

   ```bash
   git diff tests/e2e/visual-regression.spec.ts-snapshots/
   ```

4. **Commit updated snapshots:**
   ```bash
   git add tests/e2e/visual-regression.spec.ts-snapshots/
   git commit -m "Update snapshots for [describe changes]"
   ```

### When UI Changes Are Unintentional

1. **Investigate the failure** - Check what changed and why
2. **Fix the regression** - Revert or fix the unintended change
3. **Re-run tests** - Ensure they pass without updating snapshots
4. **Commit the fix** - Don't update snapshots for bug fixes

## ⚙️ Configuration

### Playwright Configuration

The visual regression tests use these key settings in `playwright.config.ts`:

```typescript
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.02, // 2% tolerance
      maxDiffPixels: 500, // 500 pixel tolerance
    },
  },
  use: {
    timezoneId: "UTC", // Consistent timezone
    locale: "en-US", // Consistent locale
    headless: true, // Headless for CI
  },
  snapshotPathTemplate:
    "{testDir}/{testFileName}-snapshots/{arg}-{projectName}.png",
});
```

### Deterministic Rendering

To ensure consistent screenshots across environments:

- **Fixed timezone**: UTC
- **Fixed locale**: en-US
- **Fixed viewport**: 1280x800 (configurable per test)
- **Disabled animations**: Prevents timing-related differences
- **Browser-specific snapshots**: Separate baselines per browser

## 📱 Breakpoint Coverage

### Standard Viewports

| Breakpoint  | Width  | Height | Description      |
| ----------- | ------ | ------ | ---------------- |
| **Mobile**  | 375px  | 667px  | iPhone portrait  |
| **Tablet**  | 768px  | 1024px | iPad portrait    |
| **Desktop** | 1280px | 800px  | Standard desktop |
| **Large**   | 1920px | 1080px | Full HD desktop  |

### Custom Viewports

```typescript
test("mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot("mobile-layout.png");
});

test("tablet layout", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot("tablet-layout.png");
});
```

## 🎨 Screenshot Types

### Full Page Screenshots

```typescript
test("homepage full page", async ({ page }) => {
  await expect(page).toHaveScreenshot("homepage-full.png", {
    fullPage: true,
    animations: "disabled",
    scale: "css",
  });
});
```

### Component Screenshots

```typescript
test("hero section", async ({ page }) => {
  const hero = page.locator("[data-testid='hero-section']");
  await expect(hero).toHaveScreenshot("hero-section.png");
});
```

### Interactive States

```typescript
test("button hover state", async ({ page }) => {
  const button = page.getByRole("button", { name: "Submit" });

  // Normal state
  await expect(button).toHaveScreenshot("button-normal.png");

  // Hover state
  await button.hover();
  await expect(button).toHaveScreenshot("button-hover.png");
});
```

### Special Modes

```typescript
test("dark mode", async ({ page }) => {
  // Enable dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });

  await expect(page).toHaveScreenshot("dark-mode.png");
});

test("high contrast", async ({ page }) => {
  // Enable high contrast
  await page.evaluate(() => {
    document.body.style.filter = "contrast(200%)";
  });

  await expect(page).toHaveScreenshot("high-contrast.png");
});
```

## 🔄 Snapshot Management

### Update Commands

```bash
# Update all snapshots for all projects
npm run visual:update

# Update snapshots for specific project
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts --project=chromium

# Update snapshots for specific test
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts --grep="homepage"
```

### Snapshot Naming Convention

Snapshots follow this pattern:

```
{testDir}/{testFileName}-snapshots/{arg}-{projectName}.png
```

Examples:

- `tests/e2e/visual-regression.spec.ts-snapshots/homepage-full-chromium.png`
- `tests/e2e/visual-regression.spec.ts-snapshots/hero-section-firefox.png`
- `tests/e2e/visual-regression.spec.ts-snapshots/button-hover-webkit.png`
- `tests/e2e/visual-regression.spec.ts-snapshots/mobile-layout-mobile.png`

### File Organization

```
tests/e2e/visual-regression.spec.ts-snapshots/
├── homepage-full-chromium.png
├── homepage-full-firefox.png
├── homepage-full-webkit.png
├── homepage-full-mobile.png
├── hero-section-chromium.png
├── hero-section-firefox.png
├── hero-section-webkit.png
├── hero-section-mobile.png
└── ... (92 total screenshots)
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Snapshot doesn't exist" errors

**Cause**: Baseline snapshots haven't been generated or are missing

**Solution**:

```bash
# Regenerate all snapshots
npm run visual:update

# Or regenerate for specific project
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts --project=chromium
```

#### 2. Platform differences (macOS vs Linux)

**Cause**: Different font rendering between platforms

**Solution**:

- Use CI-generated snapshots for consistency
- Ensure deterministic rendering settings
- Check font availability across platforms

#### 3. Minor pixel differences

**Cause**: Font rendering, anti-aliasing, scaling differences

**Solution**:

- Check tolerance settings in `playwright.config.ts`
- Use `scale: "css"` for consistent scaling
- Ensure deterministic CSS properties

#### 4. Animation-related failures

**Cause**: Animations not fully disabled

**Solution**:

- Ensure `animations: "disabled"` is set in test configuration
- Wait for animations to complete before screenshots
- Use `waitForTimeout` if necessary

#### 5. Height differences (especially WebKit)

**Cause**: WebKit may render elements with slightly different heights

**Solution**:

- Increase tolerance for height-sensitive tests
- Use `maxDiffPixels: 1000` for specific tests
- Consider using `ignoreSize: false` (default)

### Debug Commands

```bash
# Run with UI for visual debugging
npm run visual:ui

# Run specific test with debugging
npx playwright test tests/e2e/visual-regression.spec.ts --grep="homepage" --debug

# Run with headed browser
npx playwright test tests/e2e/visual-regression.spec.ts --headed

# View test results
npx playwright show-report
```

### Environment Consistency

To ensure consistent results:

1. **Use same Node.js version** across environments
2. **Use same Playwright version** across environments
3. **Use same browser versions** when possible
4. **Set consistent environment variables** (timezone, locale)
5. **Use deterministic CSS** (avoid random values, timestamps)

## 📊 CI/CD Integration

### CI Workflow

Visual regression tests run automatically in the CI pipeline:

- **Main branch**: Tests run against existing snapshots
- **Feature branches**: Tests run against existing snapshots
- **Artifacts**: Test results and screenshots uploaded for review

### CI Best Practices

1. **Don't regenerate snapshots in CI** for feature branches
2. **Use CI-generated snapshots** as the source of truth
3. **Review screenshot diffs** in CI artifacts
4. **Fail fast** on visual regressions

### Artifact Management

```yaml
# Example CI artifact configuration
- name: Upload visual regression results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: visual-regression-results
    path: |
      test-results/
      tests/e2e/visual-regression.spec.ts-snapshots/
```

## 🎯 Best Practices

### 1. Snapshot Management

- **Update snapshots only for intentional changes**
- **Review all changes** before committing
- **Use descriptive names** for snapshot files
- **Keep snapshots in version control**

### 2. Test Design

- **Test critical UI components** first
- **Use consistent viewport sizes** across tests
- **Test responsive breakpoints** systematically
- **Include interactive states** when relevant

### 3. Performance

- **Limit snapshot count** to essential components
- **Use appropriate timeouts** for slow operations
- **Parallelize tests** when possible
- **Cache browser installations** in CI

### 4. Maintenance

- **Regular cleanup** of outdated snapshots
- **Update snapshots promptly** after UI changes
- **Monitor test execution time** and optimize
- **Review and update tolerance settings** as needed

## 📚 Additional Resources

- **Main Testing Documentation**: [testing-framework.md](./testing-framework.md) | [testing.md](./testing.md)
- **Playwright Visual Testing**: https://playwright.dev/docs/screenshots
- **Visual Regression Best Practices**: https://storybook.js.org/docs/writing-tests/visual-testing
- **CI/CD Integration**: [testing-quick-reference.md](./testing-quick-reference.md)
- **Performance Guide**: [performance.md](./performance.md)

---

**Last Updated**: December 2024  
**Maintained by**: CommunityRule Development Team
