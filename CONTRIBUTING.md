# Contributing

## Backend (local)

1. Copy [`.env.example`](.env.example) to `.env` and set `SESSION_SECRET` (at least 16 characters).
2. `docker compose up -d postgres mailhog` — omit `mailhog` if you only need Postgres; with `SMTP_URL` unset, OTPs are printed in the dev server log (see `.env.example`).
3. Install dependencies: `npm ci`
4. Apply migrations: `npx prisma migrate dev`
5. Run the app: `npm run dev`

Use `npx prisma studio` to inspect the database.

### Prisma migrations (important)

- **Do not edit** migration files that have **already been applied** to **staging, production, or any shared database**. Changing history breaks `migrate deploy` and other environments.
- To fix a bad migration, add a **new** migration that corrects the schema. See [docs/backend-roadmap.md](docs/backend-roadmap.md) §8 for the full policy.

### API routes (overview)

| Method     | Path                    | Purpose                                       |
| ---------- | ----------------------- | --------------------------------------------- |
| GET        | `/api/health`           | Liveness / DB check                           |
| GET        | `/api/auth/session`     | Current user or null                          |
| POST       | `/api/auth/otp/request` | Send email OTP                                |
| POST       | `/api/auth/otp/verify`  | Verify OTP, set session cookie                |
| POST       | `/api/auth/logout`      | Clear session                                 |
| GET / PUT  | `/api/drafts/me`        | Load or save create-flow JSON (authenticated) |
| GET / POST | `/api/rules`            | List or publish rules                         |
| GET        | `/api/templates`        | List curated templates                        |

### Optional draft sync

Set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` in `.env` so the create flow saves drafts to the server when a user is logged in.

## Frontend / tests

See [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) and the root [README.md](README.md).
