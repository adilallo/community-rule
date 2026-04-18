# Testing guide

This is the **why** of testing in CommunityRule. For file layout, helper
APIs, and required imports see `.cursor/rules/testing.mdc`.

## Philosophy

- **Test behaviour, not implementation.** Assert on what a user can see and
  do (visible text, roles, labels, keyboard paths). Avoid leaning on
  internal class names, hook internals, or memoization details.
- **One consolidated file per component.** A component's standard suite,
  variant assertions, and behaviour-specific cases all live in
  `tests/components/<Name>.test.tsx`.
- **Accessibility is non-negotiable.** Every component suite runs
  `jest-axe`; full-page WCAG runs in Playwright. A failing axe check is a
  failing build.
- **E2E is sparse and high-signal.** Playwright covers critical journeys,
  visual regression of major pages, and a handful of edge cases — not
  per-component clicks. Component coverage is the job of Vitest.

## Layered coverage

| Layer | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest | Pure logic, reducers, utilities (`tests/unit/`). |
| Component | Vitest + RTL | DS components in isolation (`tests/components/`). |
| Page / context | Vitest + RTL | Screens and provider wiring (`tests/pages/`, `tests/contexts/`). |
| Accessibility (page) | Playwright + axe | WCAG 2.1 AA on key pages (`tests/accessibility/e2e/`). |
| E2E | Playwright | Critical journeys, visual regression, edge cases (`tests/e2e/`). |

## What to test vs. skip

**Test:**

- Public behaviour — visible text, roles, ARIA, keyboard activation.
- State transitions users observe (error → success, disabled → enabled).
- Interaction contracts (click handlers, form submission, dropdown
  selection).
- Accessibility invariants.

**Skip:**

- Pure styling that changes with the design system (exact shadow radius,
  minor spacing).
- Hook internals or memoization specifics.
- Responsive visibility in JSDOM — use Playwright instead.

## Running tests

```bash
npm test                  # vitest run with coverage
npm run test:component    # vitest, components only (faster inner loop)
npm run e2e               # playwright (alias: test:e2e)
npm run visual:update     # refresh playwright screenshots after UI changes
```

## Adding tests for a new component

1. Create `app/components/<Name>/`.
2. Create `tests/components/<Name>.test.tsx` and call `componentTestSuite`
   (see `.cursor/rules/testing.mdc`).
3. Add behaviour-specific `describe` blocks for any unique interactions.
4. Run `npm run test:component -- --run tests/components/<Name>.test.tsx`.

## Storybook is documentation, not tests

Stories are visual examples for design review and Code Connect — they do
not replace component tests. Run `npm run storybook` locally to browse.
