# Agent guide

Orientation for AI coding agents working in this repo. Per-file conventions
live in `.cursor/rules/*.mdc` (auto-loaded by Cursor; other agents should
read them on demand). This file is the **map** — load it first, then load
the rule(s) matching the file you're editing.

## What this is

Next.js 16 / React 19 app for community decision-making and governance.
Single-locale (English) today; designed for i18n via `messages/`.

## Read before editing

| If you're touching… | Load this rule |
| --- | --- |
| `app/components/**` | `component-structure.mdc`, `component-props.mdc`, `tailwind-styling.mdc` |
| `Alert`, or user-visible notifications / shell errors / success banners | `alerts.mdc` (and `localization.mdc` for copy) |
| `app/(app)/create/**` | `create-flow.mdc` (+ component rules) |
| `app/api/**` | `api-routes.mdc` |
| `app/hooks/**` | `hooks.mdc` |
| `app/**/page.tsx` or `app/**/layout.tsx` | `routes.mdc` |
| `messages/**` or any user-visible string | `localization.mdc` |
| `tests/**` | `testing.mdc` |
| `stories/**` | `storybook.mdc` |

When in doubt about file structure or naming, the rules win over your
priors — they reflect deliberate decisions.

## Cross-cutting principles (no single rule owns these)

1. **Figma is the source of truth for design.** Container files carry a
   `Figma: "<Path>" (<node-id>)` docstring; views render Figma intent.
   Codebase naming uses lowercase conventions (see `component-props.mdc`)
   even when Figma uses PascalCase enum values.
2. **Container / view split is the component pattern.** Never put state
   or side effects in a `*.view.tsx`. Hooks belong in containers.
3. **All user-visible text lives in `messages/`.** Hardcoded strings in
   components are a bug — even for placeholders.
4. **Tests live in `tests/`, not co-located.** Mirror the source path
   (`app/components/Foo` → `tests/components/Foo.test.tsx`).
5. **Routes live inside groups** — `(marketing)`, `(app)`, `(admin)`,
   `(dev)`. Don't drop a new route folder loose at the top of `app/`.
6. **No new pathname-sniffing chrome.** Compose chrome via group/nested
   layouts, not `usePathname()` checks. (`ConditionalNavigation` is the
   sole tolerated exception — it carries SSR session state.)

## Legacy / scaffolding

Some code exists temporarily while backend services are stood up:

- `NEXT_PUBLIC_ENABLE_BACKEND_SYNC` gating
- `migrateLegacyCreateFlowState`, `LEGACY_LIVE_KEY`, `LEGACY_DRAFT_KEY`
- `/create/right-rail` redirect
- `docs/guides/backend-roadmap.md`, `backend-linear-tickets.md`,
  `template-recommendation-matrix.md`

**Do not delete** without an explicit ask. Do not add new code in this
shape — when adding scaffolding, leave a `// TODO(legacy): …` with the
removal trigger.

## Verification recipe

Run these (in order) before declaring a change done:

```bash
rm -rf .next            # only if you moved/renamed routes or layouts
npx tsc --noEmit        # type check
npx vitest run          # unit + component (101 files / ~700 tests)
npx next build          # production build + route manifest
```

For UI-only changes, also: `npm run storybook` and visually confirm.
For E2E-relevant changes: `npm run e2e`.
For changes under `prisma/`: `npm run migrate:smoke` (see
[docs/testing-guide.md](docs/testing-guide.md) § *Running tests*).

## Where else to look

- [README.md](README.md) — human onboarding, scripts, project layout.
- [CONTRIBUTING.md](CONTRIBUTING.md) — local Postgres + Prisma + magic-link
  setup, PR workflow.
- [docs/README.md](docs/README.md) — index of user-facing docs.
- [docs/create-flow.md](docs/create-flow.md) — wizard URL/persistence canon
  (read alongside `create-flow.mdc`).
