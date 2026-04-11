# Contributing

## Backend (local)

1. Copy [`.env.example`](.env.example) to `.env` and set `SESSION_SECRET` (at least 16 characters).
2. `docker compose up -d postgres mailhog` — omit `mailhog` if you only need Postgres; with `SMTP_URL` unset, the **magic-link verify URL** is printed in the dev server log (see `.env.example`).
3. Install dependencies: `npm ci`
4. Apply migrations: `npx prisma migrate dev`
5. (Optional) Seed curated rule templates: `npx prisma db seed` — requires `DATABASE_URL` and applied migrations. Safe to re-run; rows are upserted by `slug` so duplicates are not created.
6. Run the app: `npm run dev`

Use `npx prisma studio` to inspect the database.

### Prisma migrations (important)

- **Do not edit** migration files that have **already been applied** to **staging, production, or any shared database**. Changing history breaks `migrate deploy` and other environments.
- To fix a bad migration, add a **new** migration that corrects the schema. See [docs/backend-roadmap.md](docs/backend-roadmap.md) §8 for the full policy.

### API routes (overview)

| Method     | Path                           | Purpose                                       |
| ---------- | ------------------------------ | --------------------------------------------- |
| GET        | `/api/health`                  | Liveness / DB check                           |
| GET        | `/api/auth/session`            | Current user or null                          |
| POST       | `/api/auth/magic-link/request` | Send sign-in link email                       |
| GET        | `/api/auth/magic-link/verify`  | Validate token, set session cookie, redirect  |
| POST       | `/api/auth/logout`             | Clear session                                 |
| GET / PUT  | `/api/drafts/me`               | Load or save create-flow JSON (authenticated) |
| GET / POST | `/api/rules`                   | List or publish rules (each **Finalize** creates a new published row until an update/edit-published API exists) |
| GET        | `/api/templates`               | List curated templates                        |

### Email magic link (sign-in)

- Open **[http://localhost:3000/login](http://localhost:3000/login)** or use **Log in** in the site header (modal or full page).
- Enter email and request a link. Complete sign-in by opening the link in the **same browser** you use for the app (session cookie).
- **No `SMTP_URL`:** the full **`GET /api/auth/magic-link/verify?...`** URL is printed in the **dev server terminal** — paste it into the browser address bar.
- **Mailhog:** with Compose Mailhog running, set `SMTP_URL=smtp://localhost:1025` and open the link from the message in the Mailhog UI ([http://localhost:8025](http://localhost:8025)).

**Staging / production:** Sign-in links use the app’s origin. Ensure your reverse proxy sets **`Host`** (and TLS) so links in email match the URL users open. See [docs/backend-roadmap.md](docs/backend-roadmap.md) §9.

### Optional draft sync

Set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` in `.env` so **signed-in** users can persist create-flow drafts to Postgres via **Save & Exit** and so **anonymous** progress can be **uploaded after magic-link sign-in** from the save-progress exit modal. Without it, server **PUT** `/api/drafts/me` is skipped; anonymous work stays in **browser `localStorage`**, but after sign-in with a `?syncDraft=1` return URL the app still **merges that local draft into the in-memory create flow** (no server write) so you can continue and publish.

## Frontend / tests

See [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) and the root [README.md](README.md).
