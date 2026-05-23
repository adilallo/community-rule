# Community Rule

A Next.js application for community decision-making and governance
documentation — author, browse, and share governance "rules" built from
curated templates and a guided wizard.

Live at [communityrule.info](https://communityrule.info). Packaged as a
Cloudron app for MEDLab; see
[docs/guides/ops-backend-deploy.md](docs/guides/ops-backend-deploy.md)
for the deployment handoff.

## Requirements

- Node.js **20+** (LTS)
- npm **10+**
- Docker (for local Postgres and Mailhog)

## Quick start

```bash
cp .env.example .env             # then set SESSION_SECRET (≥16 chars)
docker compose up -d postgres    # add `mailhog` for a local inbox
npm ci
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without
`CLOUDRON_MAIL_SMTP_*` set, magic-link sign-in URLs are printed to the
dev-server log instead of emailed.

Full local backend, API reference, and PR workflow:
[CONTRIBUTING.md](CONTRIBUTING.md).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server (Turbopack). |
| `npm run build` / `npm start` | Production build / serve. |
| `npm test` | Vitest unit + component tests with coverage. |
| `npm run test:component` | Components only — faster inner loop. |
| `npm run e2e` | Playwright E2E + visual regression. |
| `npm run migrate:smoke` | Throwaway Postgres + `prisma migrate deploy` (Docker required). |
| `npm run storybook` | Storybook on port 6006. |
| `npm run knip` | Detect unused files / exports. |
| `npm run lhci` | Lighthouse CI performance pass. |

See [`package.json`](package.json) for the full list (visual regression,
bundle analysis, seeding, etc.).

## Project layout

```text
app/             Next.js app router — route groups (marketing), (app),
                 (admin), (dev); shared components under app/components/;
                 admin-only widgets under app/(admin)/<route>/_components/
lib/             Shared library code (server, validation, create-flow logic)
prisma/          Schema, migrations, seed
messages/en/     Localized UI copy (single-locale today; English)
public/          Static assets
stories/         Storybook stories
tests/           Vitest + Playwright suites (mirror source paths)
docs/            Human-facing documentation — start at docs/README.md
.cursor/rules/   Per-file conventions (auto-loaded by Cursor)
scripts/         Build, release, and smoke-test scripts
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma 6 ·
PostgreSQL · Vitest · Playwright · Storybook 10 · Lighthouse CI.

## Documentation

- [docs/README.md](docs/README.md) — index of guides and rules.
- [docs/create-flow.md](docs/create-flow.md) — create-rule wizard canon.
- [docs/testing-guide.md](docs/testing-guide.md) — testing philosophy.
- [docs/guides/ops-backend-deploy.md](docs/guides/ops-backend-deploy.md)
  — Cloudron deploy + cutover plan.
- [CONTRIBUTING.md](CONTRIBUTING.md) — local backend, API routes, PR workflow.
- [AGENTS.md](AGENTS.md) — orientation for AI coding agents.
