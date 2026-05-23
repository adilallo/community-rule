# Contributing

Thanks for working on Community Rule. This file covers local setup, the
API surface, and the pull-request workflow. Per-file implementation
conventions live in [`.cursor/rules/`](.cursor/rules/) (auto-loaded by
Cursor); high-level orientation is in [`AGENTS.md`](AGENTS.md).

## Local setup

Prerequisites: Node **20+**, npm **10+**, Docker.

```bash
cp .env.example .env                    # set SESSION_SECRET (≥16 chars)
docker compose up -d postgres mailhog   # omit `mailhog` if you don't need
                                        # a local inbox
npm ci
npx prisma migrate dev
npx prisma db seed                      # optional — seeds curated templates
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use
`npx prisma studio` to browse the database.

Deploying to staging or production (MEDLab Cloudron at `my.medlab.host`)
is documented in
[`docs/guides/ops-backend-deploy.md`](docs/guides/ops-backend-deploy.md).

### Magic-link sign-in

1. Go to [/login](http://localhost:3000/login) or click **Log in** in
   the site header.
2. Submit your email.
3. Open the verify link in the **same browser** (the session cookie is
   bound to that origin):
   - **Without SMTP:** copy the URL from the dev-server log.
   - **With Mailhog:** open the message at
     [http://localhost:8025](http://localhost:8025).

### Prisma migrations

- **Never edit a migration** that has already been applied to staging,
  production, or any shared database — add a new migration instead.
  Full policy: [`docs/guides/backend-roadmap.md`](docs/guides/backend-roadmap.md) §8.
- **After any change under `prisma/`**, run `npm run migrate:smoke`
  (Docker required). A throwaway Postgres on `127.0.0.1:5433` verifies
  the migration applies cleanly. See
  [`docs/testing-guide.md`](docs/testing-guide.md) → *Running tests*.

### Draft persistence

Signed-in create-flow drafts sync to Postgres via `PUT /api/drafts/me`
by default; anonymous progress stays in `localStorage`. Set
`NEXT_PUBLIC_ENABLE_BACKEND_SYNC=false` to disable server sync.

### Create flow

The custom wizard lives under `/create/…`. Step order, URLs, and Figma
stage mapping are canon in
[`docs/create-flow.md`](docs/create-flow.md); component conventions are
in `.cursor/rules/create-flow.mdc`.

## API routes

All routes return JSON. Non-`GET` requests expect
`Content-Type: application/json` unless noted (uploads are multipart).

### Auth & account

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness + DB connectivity. |
| GET | `/api/auth/session` | Current user or `null`. |
| POST | `/api/auth/magic-link/request` | Send sign-in link. |
| GET | `/api/auth/magic-link/verify` | Validate token, set cookie, redirect. |
| POST | `/api/auth/logout` | Clear session. |
| DELETE | `/api/user/me` | Delete authenticated account. |
| POST | `/api/user/email-change/request` | Send verify link to new address. |
| GET | `/api/user/email-change/verify` | Apply email change. |

### Drafts & uploads

| Method | Path | Purpose |
| --- | --- | --- |
| GET, PUT | `/api/drafts/me` | Load / save the signed-in create-flow draft. |
| POST | `/api/uploads` | Multipart upload (requires `UPLOAD_ROOT`). |
| GET | `/api/uploads/[id]` | Stream a previously uploaded file (public). |

### Rules

| Method | Path | Purpose |
| --- | --- | --- |
| GET, POST | `/api/rules` | List or publish rules. |
| GET | `/api/rules/me` | Owner's published rules. |
| GET, PATCH, DELETE | `/api/rules/[id]` | Public read; owner update / delete. |
| POST | `/api/rules/[id]/duplicate` | Owner clone. |
| GET, POST | `/api/rules/[id]/stakeholders` | List / invite stakeholders. |
| DELETE | `/api/rules/[id]/stakeholders/[stakeholderId]` | Remove stakeholder. |
| POST | `/api/rules/[id]/stakeholders/[stakeholderId]/resend` | Resend invite email. |
| GET | `/api/invites/rule-stakeholder/verify` | Verify stakeholder invite token. |

### Templates & create-flow catalog

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/templates` | List curated templates. Repeatable `facet.<group>=<value>` query params re-rank results. |
| GET | `/api/templates/[slug]` | Single template with normalized `{ section, slug }` composition. |
| GET | `/api/create-flow/methods` | Built-in governance methods / core values for the wizard. Required `section` query param. |

Facet semantics and the recommendation matrix:
[`docs/guides/template-recommendation-matrix.md`](docs/guides/template-recommendation-matrix.md)
§9.

### Misc

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/organizer-inquiry` | "Ask an organizer" form submission. |
| POST | `/api/use-cases/[slug]/duplicate` | Duplicate a use-case demo rule. |
| GET, POST | `/api/web-vitals` | Read / ingest web vitals. Storage mode set by `WEB_VITALS_STORAGE` (`local` in dev, `external` in prod). |

## Testing

The full testing recipe and philosophy live in
[`docs/testing-guide.md`](docs/testing-guide.md). Component conventions
and shared helpers are in `.cursor/rules/testing.mdc`.

A typical pre-merge subset:

```bash
npx tsc --noEmit
npm run knip
npm test
npx next build
```

Add `npm run e2e` for routing, auth, or critical-flow changes, and
`npm run migrate:smoke` for anything under `prisma/`.

## Pull-request workflow

1. Branch from `main`: `git checkout -b feature/<short-name>`.
2. Make the change and add or update tests.
3. Run the relevant subset of the testing recipe above.
4. Commit using a conventional-commit prefix: `feat:`, `fix:`,
   `chore:`, `docs:`, `refactor:`, `test:`.
5. Open a pull request; link the Linear ticket if there is one (e.g.
   `CR-123`).
