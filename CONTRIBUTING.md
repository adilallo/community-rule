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

Deploying to staging or production (MEDLab Cloudron) — see
[docs/guides/ops-backend-deploy.md](docs/guides/ops-backend-deploy.md)
for the admin handoff and the linked Linear tickets for the actual
deployment-pipeline work.

### Prisma migrations

- **Never edit** a migration that has already been applied to staging,
  production, or any shared database. Add a **new** migration that
  corrects the schema instead. Full policy:
  [docs/guides/backend-roadmap.md](docs/guides/backend-roadmap.md) §8.
- Any change under **`prisma/`**: run **`npm run migrate:smoke`** (see
  [docs/testing-guide.md](docs/testing-guide.md#running-tests), **Prisma**
  under *Running tests*).

### API routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness / DB check. |
| GET | `/api/auth/session` | Current user or null. |
| POST | `/api/auth/magic-link/request` | Send sign-in link email. |
| GET | `/api/auth/magic-link/verify` | Validate token, set cookie, redirect. |
| POST | `/api/auth/logout` | Clear session. |
| GET / PUT | `/api/drafts/me` | Load or save the create-flow draft. |
| POST | `/api/uploads` | Authenticated multipart upload (create-flow images / PDFs); requires `UPLOAD_ROOT`. |
| GET | `/api/uploads/[id]` | Stream a previously uploaded file by opaque id (public read). |
| GET / POST | `/api/rules` | List or publish rules. |
| GET | `/api/templates` | List curated templates. Optional repeatable `facet.<group>=<value>` query params re-rank results (and may include `scores` in the JSON). See [docs/guides/template-recommendation-matrix.md](docs/guides/template-recommendation-matrix.md) §9.1. |
| GET | `/api/create-flow/methods` | Facet-aware scores for custom-rule card steps: required `section` (`communication` \| `membership` \| `decisionApproaches` \| `conflictManagement`) and optional `facet.*` params (same facet groups as `/api/templates`). Returns `methods` with match metadata for re-ordering in the wizard. |
| POST / GET | `/api/web-vitals` | Ingest or read web vitals. **Production default:** `external` — structured logs only (no writes under `.next`; safe for read-only FS). **Development default:** `local` — aggregates under `.next/web-vitals`. Override with `WEB_VITALS_STORAGE`. See [docs/guides/backend-roadmap.md](docs/guides/backend-roadmap.md) §7. |
| GET | `/api/rules/me` | Authenticated list of own published rules. |
| GET / PATCH / DELETE | `/api/rules/[id]` | Public read; owner update/delete. |
| POST | `/api/rules/[id]/duplicate` | Owner clone of a published rule. |
| GET / POST | `/api/rules/[id]/stakeholders` | List or invite rule stakeholders. |
| DELETE | `/api/rules/[id]/stakeholders/[stakeholderId]` | Remove a stakeholder. |
| POST | `/api/rules/[id]/stakeholders/[stakeholderId]/resend` | Resend stakeholder invite email. |
| GET | `/api/invites/rule-stakeholder/verify` | Verify stakeholder invite token; redirect. |
| DELETE | `/api/user/me` | Delete authenticated user account. |
| POST | `/api/user/email-change/request` | Request email change (magic link to new address). |
| GET | `/api/user/email-change/verify` | Verify email-change token; update `User.email`. |
| POST | `/api/organizer-inquiry` | Submit ask-organizer inquiry form. |
| POST | `/api/use-cases/[slug]/duplicate` | Duplicate a use-case demo rule. |

### Magic-link sign-in

- Visit **[/login](http://localhost:3000/login)** or use **Log in** in the
  site header.
- Without `SMTP_URL`: copy the verify URL from the dev server terminal.
- With Mailhog: set `SMTP_URL=smtp://localhost:1025` and open the message
  at [http://localhost:8025](http://localhost:8025).
- Open the link in the **same browser** as the app (session cookie).

### Optional draft sync

Postgres draft persistence via `PUT /api/drafts/me` is **on by default** for
signed-in users and post-sign-in transfer of anonymous drafts. Set
`NEXT_PUBLIC_ENABLE_BACKEND_SYNC=false` to disable server sync (anonymous
progress stays in `localStorage` only).

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
3. Before merging, run [docs/testing-guide.md](docs/testing-guide.md#running-tests) *Running tests*.
4. Commit using a clear message (`feat:`, `fix:`, `chore:`, …).
5. Open a pull request.
