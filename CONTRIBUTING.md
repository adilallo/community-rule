# Contributing

## Local backend

1. Copy [`.env.example`](.env.example) to `.env` and set `SESSION_SECRET`
   (at least 16 characters).
2. `docker compose up -d postgres mailhog` — omit `mailhog` if you only
   need Postgres. Without `SMTP_URL`, the **magic-link verify URL** is
   printed in the dev server log.
3. `npm ci`
4. `npx prisma migrate dev`
5. *(Optional)* `npx prisma db seed` — seeds curated rule templates.
   Idempotent; rows upsert by `slug`.
6. `npm run dev`

Use `npx prisma studio` to inspect the database.

### Prisma migrations

- **Never edit** a migration that has already been applied to staging,
  production, or any shared database. Add a **new** migration that
  corrects the schema instead. Full policy:
  [docs/guides/backend-roadmap.md](docs/guides/backend-roadmap.md) §8.
- **CI smoke:** [`.gitea/workflows/migrate-smoke.yaml`](.gitea/workflows/migrate-smoke.yaml)
  spins up a throwaway Postgres and runs `npm run db:deploy` whenever
  `prisma/**` changes on a PR (or via `workflow_dispatch`). If the
  runner cannot run Docker/Postgres, run the same check locally before
  merging migration changes:

  ```bash
  docker compose up -d postgres
  npm run db:deploy
  ```

### API routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness / DB check. |
| GET | `/api/auth/session` | Current user or null. |
| POST | `/api/auth/magic-link/request` | Send sign-in link email. |
| GET | `/api/auth/magic-link/verify` | Validate token, set cookie, redirect. |
| POST | `/api/auth/logout` | Clear session. |
| GET / PUT | `/api/drafts/me` | Load or save the create-flow draft. |
| GET / POST | `/api/rules` | List or publish rules. |
| GET | `/api/templates` | List curated templates. Optional repeatable `facet.<group>=<value>` query params re-rank results (and may include `scores` in the JSON). See [docs/guides/template-recommendation-matrix.md](docs/guides/template-recommendation-matrix.md) §9.1. |
| GET | `/api/create-flow/methods` | Facet-aware scores for custom-rule card steps: required `section` (`communication` \| `membership` \| `decisionApproaches` \| `conflictManagement`) and optional `facet.*` params (same facet groups as `/api/templates`). Returns `methods` with match metadata for re-ordering in the wizard. |
| POST / GET | `/api/web-vitals` | Ingest or read web vitals. **Production default:** `external` — structured logs only (no writes under `.next`; safe for read-only FS). **Development default:** `local` — aggregates under `.next/web-vitals`. Override with `WEB_VITALS_STORAGE`. See [docs/guides/backend-roadmap.md](docs/guides/backend-roadmap.md) §7. |

### Magic-link sign-in

- Visit **[/login](http://localhost:3000/login)** or use **Log in** in the
  site header.
- Without `SMTP_URL`: copy the verify URL from the dev server terminal.
- With Mailhog: set `SMTP_URL=smtp://localhost:1025` and open the message
  at [http://localhost:8025](http://localhost:8025).
- Open the link in the **same browser** as the app (session cookie).

### Optional draft sync

`NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` enables Postgres draft persistence
via `PUT /api/drafts/me` for signed-in users and post-sign-in upload of
anonymous drafts. Without it, anonymous progress stays in `localStorage`
and signed-in progress stays in memory until **Save & Exit**.

### Create flow

The custom wizard lives under `/create/…`. Step order, URLs, and Figma
stage mapping are canon in [docs/create-flow.md](docs/create-flow.md).
Engineering tracking: Linear **CR-89** (**Done**) /
[docs/guides/backend-linear-tickets.md](docs/guides/backend-linear-tickets.md)
Ticket 17.

## Frontend & tests

- Code conventions are enforced by `.cursor/rules/*.mdc` — Cursor surfaces
  the relevant rule when editing matching files.
- See [docs/testing-guide.md](docs/testing-guide.md) for testing
  philosophy and `.cursor/rules/testing.mdc` for layout/helpers.

## Pull request workflow

1. Branch from `main`: `git checkout -b feature/<short-name>`.
2. Make the change and add/update tests.
3. `npm test && npm run e2e` (and `npm run storybook:build` if you touched
   stories).
4. Commit using a clear message (`feat:`, `fix:`, `chore:`, …).
5. Open a PR; CI runs unit, E2E, visual regression, and Lighthouse.
