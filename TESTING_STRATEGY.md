# Testing Strategy for CommunityRule

## Overview

This document outlines our comprehensive testing strategy that properly separates unit testing from responsive behavior testing, following best practices for JSDOM limitations and real browser testing.

## Current Test Status

- **184 total tests** across the project
- **176 tests passing** (95.7% success rate)
- **8 tests failing** (all related to multiple element instances)
- **13 test files** covering all major components

## Testing Philosophy

### The Problem with JSDOM and Responsive Testing

**Short take: Unit tests in JSDOM can't truly "switch breakpoints."** JSDOM doesn't evaluate CSS media queries, so Tailwind's `hidden sm:block …` won't change visibility when you "resize" the window.

### Solution: Proper Test Separation

- **Unit / component tests (Vitest + RTL):** assert **structure and classes**, not responsive visibility.
- **Responsive behavior:** verify with **browser-based tests** (Playwright) or **visual tests** (Chromatic/Storybook) at real viewport widths.

## Test Categories

### 1. Unit Tests (Vitest + React Testing Library)

**Purpose:** Test component structure, accessibility, and configuration data.

**What to test:**

- DOM roles/labels exist: `role="banner"`, nav landmark, menu items
- The right **Tailwind classes** are present on wrappers (`block sm:hidden`, `hidden md:block`, etc.)
- Data-driven bits produce the expected count/order (e.g., `navigationItems`, `avatarImages`, `logoConfig`)
- Component configuration and exported data structures

**Example:**

```javascript
// tests/unit/Header.structure.test.js
test("logo wrappers include breakpoint classes", () => {
  render(<Header />);
  const logoWrappers = screen.getAllByTestId("logo-wrapper");

  // Check first logo variant (xs only)
  expect(logoWrappers[0]).toHaveClass("block", "sm:hidden");

  // Check second logo variant (sm only)
  expect(logoWrappers[1]).toHaveClass("hidden", "sm:block", "md:hidden");
});
```

### 2. Browser-Based Tests (Playwright)

**Purpose:** Test real responsive behavior at actual viewport widths.

**What to test:**

- **Visibility** at real breakpoints
- **Layout changes** between breakpoints
- **Interactive behavior** at different screen sizes
- **Accessibility** across viewports

**Example:**

```javascript
// tests/e2e/header.responsive.spec.js
const breakpoints = [
  { name: "xs", width: 360, height: 700 },
  { name: "sm", width: 640, height: 700 },
  { name: "md", width: 768, height: 700 },
  { name: "lg", width: 1024, height: 700 },
  { name: "xl", width: 1280, height: 700 },
];

for (const bp of breakpoints) {
  test(`header layout at ${bp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: /main navigation/i });
    await expect(nav).toBeVisible();
  });
}
```

### 3. Visual Tests (Storybook + Chromatic)

**Purpose:** Visual regression testing and design system validation.

**What to test:**

- **Visual diffs** per breakpoint
- **Design consistency** across viewports
- **Component variations** and states

**Example:**

```javascript
// stories/Header.responsive.stories.js
export default {
  parameters: {
    chromatic: {
      viewports: [360, 640, 768, 1024, 1280],
      delay: 100,
    },
  },
};
```

## Component Improvements

### Header Component Enhancements

1. **Added Test IDs** for easier testing:

   ```jsx
   <div data-testid="logo-wrapper" className={config.breakpoint}>
     {renderLogo(config.size, config.showText)}
   </div>
   ```

2. **Exported Configuration** for testing:

   ```javascript
   export const navigationItems = [...];
   export const avatarImages = [...];
   export const logoConfig = [...];
   ```

3. **Structured Breakpoint Containers**:
   ```jsx
   <div data-testid="nav-xs" className="block sm:hidden">
   <div data-testid="nav-sm" className="hidden sm:block md:hidden">
   <div data-testid="nav-md" className="hidden md:block lg:hidden">
   ```

## Test File Structure

```
tests/
├── unit/                    # Unit tests (Vitest + RTL)
│   ├── Header.test.jsx     # CONSOLIDATED: Comprehensive Header tests
│   ├── Footer.test.jsx
│   ├── Layout.test.jsx
│   └── Page.test.jsx
├── integration/            # Integration tests
│   └── ContentLockup.integration.test.jsx
├── e2e/                   # Browser tests (Playwright)
│   └── header.responsive.spec.js  # NEW: Responsive behavior tests
└── stories/               # Storybook stories
    └── Header.responsive.stories.js  # NEW: Visual testing
```

## Best Practices

### Unit Testing (JSDOM)

1. **Test structure, not visibility**:

   ```javascript
   // ✅ Good: Test classes exist
   expect(element).toHaveClass("block", "sm:hidden");

   // ❌ Bad: Test visibility (doesn't work in JSDOM)
   expect(element).toBeVisible();
   ```

2. **Use test IDs for containers**:

   ```javascript
   // ✅ Good: Test specific containers
   const logoWrapper = screen.getByTestId("logo-wrapper");

   // ❌ Bad: Query by complex class strings
   const logoWrapper = document.querySelector(".block.sm\\:hidden");
   ```

3. **Test configuration data**:
   ```javascript
   // ✅ Good: Test exported configuration
   expect(navigationItems).toHaveLength(3);
   expect(logoConfig).toHaveLength(5);
   ```

### Browser Testing (Playwright)

1. **Test real viewport sizes**:

   ```javascript
   await page.setViewportSize({ width: 640, height: 700 });
   ```

2. **Test visibility at breakpoints**:

   ```javascript
   if (bp.name === "xs") {
     await expect(page.getByTestId("auth-xs")).toBeVisible();
   }
   ```

3. **Test accessibility across viewports**:

   ```javascript
   const interactiveElements = [
     page.getByRole("link", { name: /use cases/i }),
     page.getByRole("button", { name: /create rule/i }),
   ];

   for (const element of interactiveElements) {
     await expect(element).toBeVisible();
     await expect(element).toBeEnabled();
   }
   ```

## Running Tests

### Unit Tests

```bash
npm test                    # Run all unit tests
npm test tests/unit/        # Run only unit tests
npm test Header.structure   # Run specific test file
```

### Browser Tests

```bash
npx playwright test         # Run all browser tests
npx playwright test header.responsive.spec.js  # Run specific test
```

### Visual Tests

```bash
npm run storybook          # Start Storybook
npx chromatic --project-token=xxx  # Run visual tests
```

## Future Improvements

1. **Add more Playwright tests** for other components
2. **Set up Chromatic** for visual regression testing
3. **Add performance tests** for responsive behavior
4. **Create component-specific test utilities**
5. **Add accessibility testing** with axe-core

## Key Takeaways

1. **JSDOM limitations** require separating structure tests from visibility tests
2. **Test IDs** make testing more reliable and maintainable
3. **Exported configuration** enables better data structure testing
4. **Real browser testing** is essential for responsive behavior
5. **Visual testing** catches design regressions across breakpoints

This strategy provides comprehensive coverage while respecting the limitations of different testing environments.
