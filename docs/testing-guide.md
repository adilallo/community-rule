# Testing guide

This is the **why** of testing in CommunityRule. For file layout, helper
APIs, and required imports see `.cursor/rules/testing.mdc`.

## Running tests

```bash
npx tsc --noEmit
npm test
npx next build
npm run e2e                          # when routes, auth, or critical flows change
npm run storybook:build              # when stories/ change
npm run test:component               # components only, faster inner loop
npm run visual:update                # after UI changes to visual regression tests
```

**Prisma** (`prisma/**` changes): **requires Docker.**

```bash
npm run migrate:smoke
```

Starts a throwaway Postgres on `127.0.0.1:5433`, runs `prisma migrate
deploy`, checks the connection, then removes the container. Port **5433**
avoids clashing with `docker compose` on **5432**. If you already use
Compose on 5432: `docker compose up -d postgres` then
`DATABASE_URL=postgresql://communityrule:communityrule@127.0.0.1:5432/communityrule npm run db:deploy`.

Do not rewrite migrations already applied to shared DBs — see
[CONTRIBUTING.md](../CONTRIBUTING.md) and
[guides/backend-roadmap.md](guides/backend-roadmap.md) §8.

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

## Adding tests for a new component

1. Create `app/components/<Name>/`.
2. Create `tests/components/<Name>.test.tsx` and call `componentTestSuite`
   (see `.cursor/rules/testing.mdc`).
3. Add behaviour-specific `describe` blocks for any unique interactions.
4. Run `npm run test:component -- --run tests/components/<Name>.test.tsx`.

## Storybook is documentation, not tests

Stories are visual examples for design review and Code Connect — they do
not replace component tests. Run `npm run storybook` locally to browse.
