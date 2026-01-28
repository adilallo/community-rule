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
    homepage.spec.ts
    user-journeys.spec.ts
    visual-regression.spec.ts
    performance.spec.ts
  utils/                # Shared test utilities
    componentTestSuite.tsx
  msw/                  # MSW server setup for mocking
    server.ts
  accessibility/
    e2e/                # E2E accessibility checks (WCAG compliance)
      wcag-compliance.spec.ts
```

**Component tests** (`tests/components/`) use the standard `componentTestSuite` utility to ensure consistent baseline coverage for all UI components. **Page tests** (`tests/pages/`) cover page-level rendering and flows. **E2E tests** (`tests/e2e/`) focus on critical user journeys, visual regression, and performance. **Accessibility E2E** (`tests/accessibility/e2e/`) provides high-level WCAG compliance checks.

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
        expect(el).toHaveClass("border-[var(--color-border-default-utility-negative)]");
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

- Use **Playwright** for:
  - Critical user journeys (e.g., create rule, navigate blog, key flows).
  - Responsive behaviour and cross‑browser checks.
  - Visual regression (`tests/e2e/visual-regression.spec.ts`).

  ```bash
  npm run test:e2e
  npm run visual:test
  ```

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

