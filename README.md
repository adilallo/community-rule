# Community Rule

A Next.js application for community decision-making and governance
documentation.

## Requirements

- Node.js **20+** (LTS)
- npm **10+**

## Getting started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend setup (Postgres, Prisma, magic-link auth) is documented in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Common scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server (Turbopack). |
| `npm run build` / `npm start` | Production build / serve. |
| `npm test` | Vitest unit + component tests with coverage. |
| `npm run test:component` | Faster inner loop — components only. |
| `npm run e2e` | Playwright E2E + visual regression. |
| `npm run storybook` | Storybook on port 6006. |
| `npm run lhci` | Lighthouse CI performance pass. |

## Project layout

```text
app/              Next.js app router (routes, components, hooks, contexts)
lib/              Shared library code (i18n, validation, utilities)
messages/en/      Localized UI copy (see docs/guides/i18n-translation-workflow.md)
prisma/           Database schema, migrations, seed
public/           Static assets
stories/          Storybook stories
tests/            Vitest + Playwright suites
docs/             User-facing documentation (start with docs/README.md)
.cursor/rules/    Implementation conventions enforced by Cursor
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma · Vitest ·
Playwright · Storybook 10 · Lighthouse CI.

## Documentation

- [docs/README.md](docs/README.md) — index of guides and rules.
- [docs/create-flow.md](docs/create-flow.md) — create-rule wizard canon.
- [docs/testing-guide.md](docs/testing-guide.md) — testing philosophy.
- [CONTRIBUTING.md](CONTRIBUTING.md) — local backend, API routes, PR
  workflow.

## License

[MIT](LICENSE).
