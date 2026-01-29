## Testing Guide

### Philosophy

- **Test behaviour, not implementation**: Focus on what the user can see and do, not internal details.
- **Single source of truth per component**: Each component should have **one consolidated test file**.
- **Accessibility is mandatory**: Basic a11y checks run as part of every component suite.
- **E2E is sparse**: Only cover critical user journeys that span pages or systems.

### Test Structure

The test directory structure is organized as follows:

```text
tests/
  components/           # All component-focused tests (Vitest + RTL)
    Button.test.tsx
    Input.test.tsx
    Checkbox.test.tsx
    Select.test.tsx
    Switch.test.tsx
  pages/                # Page-level tests (home, blog, etc.)
    home.test.jsx
    blog.test.jsx
  e2e/                  # True end‑to‑end flows + visual regression (Playwright)
    critical-journeys.spec.ts    # Main user journeys (homepage, navigation, interactions)
    visual-regression.spec.ts   # Critical page screenshots only (5 tests)
    edge-cases.spec.ts          # Critical error scenarios (4 tests)
    performance.spec.ts          # Essential performance checks (2 tests)
  utils/                # Shared test utilities
    componentTestSuite.tsx
  msw/                  # MSW server setup for mocking
    server.ts
  accessibility/
    e2e/                # E2E accessibility checks (WCAG compliance)
      wcag-compliance.spec.ts
```

**Component tests** (`tests/components/`) use the standard `componentTestSuite` utility to ensure consistent baseline coverage for all UI components. **Page tests** (`tests/pages/`) cover page-level rendering and flows. **E2E tests** (`tests/e2e/`) focus on critical user journeys, visual regression, and performance. **Accessibility E2E** (`tests/accessibility/e2e/`) provides high-level WCAG compliance checks.

### E2E Testing Philosophy

E2E tests follow a **sparse, critical-path approach** optimized for open source projects:

- **Focus on user value**: Test critical user journeys that span multiple pages or systems, not individual component interactions
- **Maintainability over coverage**: Keep tests maintainable and contributor-friendly rather than comprehensive
- **Visual regression is minimal**: Only capture screenshots of major pages (homepage, blog listing/post, 404), not every component or viewport
- **Performance monitoring is essential**: Track homepage load and Core Web Vitals, but detailed performance analysis is handled by Lighthouse CI
- **Edge cases are critical only**: Test scenarios that would break user experience (slow network, offline mode, JS errors, missing images)

This approach reduces test maintenance burden while ensuring critical functionality remains stable.

### Standard Component Test Suite

Use the shared suite in `tests/utils/componentTestSuite.tsx` to get a consistent baseline:

```ts
import Component from "../../app/components/Component";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type Props = React.ComponentProps<typeof Component>;

const config: ComponentTestSuiteConfig<Props> = {
  component: Component,
  name: "Component",
  props: {
    /* default props */
  } as Props,
  requiredProps: ["label"],
  optionalProps: {
    disabled: true,
  },
  queries: {
    getPrimaryElement: (s) => s.getByRole("button"),
  },
  variants: {
    disabled: {
      props: { disabled: true },
      assert: (el) => {
        expect(el).toBeDisabled();
      },
    },
    error: {
      props: { error: true } as Partial<Props>,
      assert: (el) => {
        expect(el).toHaveClass(
          "border-[var(--color-border-default-utility-negative)]",
        );
      },
    },
  },
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: true,
    errorState: true,
  },
};

componentTestSuite<Props>(config);
```

#### What the Standard Suite Covers

- **Rendering**
  - Component renders without throwing using the provided `props`.
  - Required props are present and do not break rendering.
  - Optional props can be applied without breaking.

- **Accessibility**
  - Runs `axe` against the rendered output.
  - Fails on common WCAG 2.1 issues (roles, labels, contrast, etc.).

- **Keyboard Navigation**
  - Ensures the primary element can receive focus.
  - Smoke‑tests basic keyboard activation (`Enter`, `Space`) without runtime errors.

- **Disabled State**
  - Uses `variants.disabled` to verify disabled behaviour (e.g., `aria-disabled`, `disabled` attribute, tab index).

- **Error State**
  - Uses `variants.error` to verify error styling/attributes when applicable.

### When to Add Custom Tests

Use the standard suite for **baseline coverage**, then add custom `describe` blocks in the same file when:

- The component has **important variants** (different sizes, modes, label variants).
- There is **non‑trivial interaction** (menus, dropdowns, complex keyboard behaviour).
- You need to exercise **stateful flows** (forms, validation, error messages).

Example (inside the same `*.test.tsx` file):

```ts
describe("Input – behaviour specifics", () => {
  it("calls onChange when user types", async () => {
    // ...
  });
});
```

### Test Commands

- **All component tests** (Vitest + RTL):

  ```bash
  npm test
  ```

- **Component-only tests** (faster inner loop, focused on `tests/components/`):

  ```bash
  npm run test:component
  # filter by name:
  npm run test:component -- --run tests/components/Button.test.tsx
  ```

- **E2E tests only** (Playwright):

  ```bash
  npm run test:e2e
  # or, equivalently:
  npm run e2e
  ```

### What to Test vs. What Not to Test

- **Do test**
  - Public behaviour: visible text, roles, labels, ARIA, keyboard paths.
  - State transitions that users rely on (error -> success, disabled -> enabled).
  - Critical component interactions (clicks, form submissions, dropdown selection).
  - Accessibility invariants (no axe violations, basic keyboard support).

- **Avoid testing**
  - Pure styling details that are likely to change frequently (exact shadow radius, minor spacing).
  - Internal implementation details (private helpers, hook internals, memoisation specifics).
  - Responsive visibility in JSDOM (use Playwright visual / responsive tests instead).

### Adding Tests for a New Component (≈5 minutes)

1. **Create the component file** in `app/components/`.
2. **Create a test file** in `tests/components/ComponentName.test.tsx`.
3. **Wire the standard suite** using `componentTestSuite`.
4. **Add 1–3 custom tests** for any unique behaviours.
5. Run:

   ```bash
   npm run test:component -- --run tests/components/ComponentName.test.tsx
   ```

### E2E and Visual Regression

E2E tests are organized into focused files:

- **`critical-journeys.spec.ts`**: Main user journeys (homepage loads, navigation, key interactions)
- **`visual-regression.spec.ts`**: Critical page screenshots only (homepage full/viewport, blog listing/post, 404)
- **`edge-cases.spec.ts`**: Critical error scenarios (slow network, offline mode, JS errors, missing images)
- **`performance.spec.ts`**: Essential performance checks (homepage load, Core Web Vitals)

**Commands:**

```bash
# Run all E2E tests
npm run test:e2e

# Run visual regression tests only
npm run visual:test

# Update visual regression snapshots (after UI changes)
npm run visual:update

# Run specific test file
npx playwright test tests/e2e/critical-journeys.spec.ts
```

**When to add E2E tests:**

- **Add E2E tests** when:
  - A new critical user journey is introduced (e.g., new multi-step flow)
  - A major page is added that needs visual regression coverage
  - A critical error scenario needs to be tested (e.g., payment failure, form submission errors)

- **Don't add E2E tests** for:
  - Component-level interactions (use component tests instead)
  - Single-page functionality (use page tests instead)
  - Minor UI changes (visual regression will catch major regressions)
  - Edge cases that don't impact core user experience

**Visual regression snapshots:**

Visual regression tests capture screenshots of critical pages. When UI changes are intentional, update snapshots:

```bash
npm run visual:update
```

This updates snapshots for all 5 critical page tests. Review the changes carefully before committing.

### Storybook

**Storybook is used for component documentation and visual review only.** It is not used for automated testing.

- Component tests (`tests/components/*.test.tsx`) provide all test coverage previously handled by Storybook test-runner
- Storybook stories (`stories/*.stories.js`) serve as living documentation and visual examples
- Interaction functions are inlined in story files for demonstration purposes
- Run Storybook locally with `npm run storybook` for component development and review

### Accessibility Testing

Accessibility is tested at two levels:

1. **Component-level accessibility** (`tests/components/*.test.tsx`):
   - Automatically covered by `componentTestSuite` using `jest-axe`
   - Tests roles, labels, ARIA attributes, keyboard navigation
   - Runs as part of every component test suite

2. **Full-page accessibility** (`tests/accessibility/e2e/wcag-compliance.spec.ts`):
   - E2E tests using Playwright and `@axe-core/playwright`
   - Validates WCAG 2.1 AA compliance across entire pages
   - Tests complete user journeys for accessibility barriers

This two-tier approach ensures both individual components and full page experiences meet accessibility standards.
