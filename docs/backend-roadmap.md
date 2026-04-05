# Backend roadmap (reference)

Temporary working notes for building the backend. Safe to delete once the stack is stable.

---

## 1. Where we are

- **Next.js 16** single repo ([`package.json`](package.json)).
- **PostgreSQL + Prisma**: schema and migrations under `prisma/`; product APIs under `app/api/*` (health, auth/OTP, session, drafts, rules, templates, web-vitals).
- **Server modules** in `lib/server/` (db, session, mail, rate limiting, etc.).
- **Create flow** persists in the browser (`localStorage`); optional **server draft sync** when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` and the user is signed in ([`app/create/context/CreateFlowBackendSync.tsx`](app/create/context/CreateFlowBackendSync.tsx)).
- **Web vitals** [`app/api/web-vitals/route.ts`](app/api/web-vitals/route.ts) still use **file-based** storage under `.next` (not suitable for multi-instance production).
- **CI:** [`.gitea/workflows/ci.yaml`](.gitea/workflows/ci.yaml) (build, test, lint, `prisma validate`); no in-repo production deploy definition.

### HTTP API (implemented in repo)

Mirrors [CONTRIBUTING.md](../CONTRIBUTING.md) **API routes** table; handlers live under `app/api/*/route.ts`.

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

**Also present (not in CONTRIBUTING table):** `POST` / `GET` [`/api/web-vitals`](../app/api/web-vitals/route.ts) — file-based store today; production path TBD (§7).

---

## 2. What we’re building

**Step 1.** Treat this as **greenfield**: new **PostgreSQL** database and new tables. Do **not** migrate data from the old Community Rule backend.

**Step 2.** Keep the backend **inside this Next app**:

- HTTP handlers under `app/api/…`
- Shared server code under `lib/server/…`

**Step 3.** Use the old backend only as a **product hint** (email OTP, saving rules, listing rules). Do **not** copy its Express layout or MySQL schema.

---

## 3. Stack choices

**Step 1.** Use **PostgreSQL** everywhere (local Docker, staging, production).

**Step 2.** Use **Prisma** — `schema.prisma`, `npx prisma migrate dev` / `migrate deploy`.

**Step 3.** Add **SMTP** (or Mailhog locally) for email OTP in deployed environments; dev can log OTP to the console when `SMTP_URL` is unset.

**Step 4.** **Redis / queues / Kubernetes** — not required for v1. **Exception:** before running **multiple app instances**, plan a **shared rate-limit store** (often Redis) for OTP endpoints; the current limiter is in-memory per process ([`lib/server/rateLimit.ts`](lib/server/rateLimit.ts)).

---

## 4. Data to model (first pass)

Plain-English entities (names can evolve):

| Area              | Purpose                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**          | Identified by email after OTP verification.                                                                                                     |
| **Session**       | **Custom v1:** HttpOnly cookie; opaque token; **hash** stored in DB ([`lib/server/session.ts`](lib/server/session.ts)). Not NextAuth/Lucia.     |
| **OtpChallenge**  | Short-lived email codes (hashed).                                                                                                               |
| **RuleDraft**     | **One** JSON blob per user (create-flow state). Schema already has **`updatedAt`**; no draft **versioning** or **multiple named drafts** in v1. |
| **PublishedRule** | Saved rule after publish (title, summary, document JSON).                                                                                       |
| **RuleTemplate**  | Curated templates (slug, category, ordering).                                                                                                   |

**Session follow-ups to implement or decide:** token **rotation** on sensitive events, whether **new login invalidates other sessions**, and **cleanup** of expired `Session` rows (job or lazy delete). Revisit a small auth library (e.g. Auth.js, Lucia) only if maintaining custom code becomes costly.

**RuleDraft future (not v1):** versioning, multiple drafts per user, easier corruption recovery—only if product needs them.

Align JSON shapes with `app/create/types.ts` as it matures.

---

## 5. Session and authentication (v1)

- **Decision:** **Custom** database-backed sessions + email OTP; cookies are **httpOnly**; tokens are hashed at rest.
- **OTP rate limiting:** **In-memory** is acceptable for a **single Node process**. It does **not** coordinate across instances—**add a shared limiter (e.g. Redis)** before horizontal scaling or serious abuse exposure.
- Do **not** treat “switch to NextAuth/Lucia” as required for v1; document the custom lifecycle above instead.

---

## 6. Authorization (v1)

Match the current API behavior; tighten as product evolves:

- **`GET /api/drafts/me` / `PUT /api/drafts/me`:** Authenticated user only; draft is **scoped to that user** (`userId`).
- **`POST /api/rules`:** Authenticated user only; rule is stored with **`userId`** (owner).
- **`GET /api/rules`:** **Public list** of published rules (metadata: id, title, summary, timestamps)—no auth required today. **Not** a private “my rules” feed unless you add a separate route later.
- **v1:** No **editing** or **deleting** published rules via API in the shipped handlers; no **sharing** or **collaborative ownership**—treat each rule as **owned by one user** until product defines more.

---

## 7. API responses, errors, and observability

**Error JSON (target):** Prefer a stable shape, e.g. `{ "error": { "code": "string", "message": "string" }, "details"?: ... }` for 4xx/5xx, instead of only `{ "error": "string" }`. Validation errors can map into `details`. Implement gradually in route handlers.

**Logging:** Use the shared [`lib/logger.ts`](../lib/logger.ts) where possible. Include a **request correlation id** (reuse `x-request-id` if present, else generate) on API routes and log it with errors so support can tie logs together.

**Metrics:** No vendor required for v1; optional later: request duration, error counts.

**Web vitals:** **Default** is **external** RUM or log drain (e.g. host analytics, Vercel Analytics, OpenTelemetry, SaaS APM)—keep **product Postgres** focused on product entities. Storing vitals in Postgres is an **explicit tradeoff** only if ops strongly wants a single datastore.

---

## 8. Prisma migrations policy

- **Never edit** migration files that have **already been applied** to **staging or production** (or any shared database). Fixing schema drift = **add a new migration**.
- **Local dev:** `prisma migrate dev` creates migrations; **deployed envs:** `prisma migrate deploy` before serving new code that depends on the schema.

---

## 9. Build order (implementation steps)

**Operator / local (always manual):** Steps 1–4 — env file, Docker Postgres, `npm ci`, `prisma migrate dev`, `npm run dev`.

**Backend behavior already in the repo:** Steps **5–10** match implemented Route Handlers and middleware (`lib/server/*`). **Step 11** (web vitals) is **not** production-ready (files under `.next`); treat as follow-up work aligned with §7.

**Product / frontend still open (not only “backend exists”):** Sign-in UI, wiring publish from the create flow, template seed + UI consumption — see §12 and [docs/backend-linear-tickets.md](backend-linear-tickets.md).

---

**Step 1.** Copy `.env.example` to `.env`. Set `DATABASE_URL` and secrets (see file comments).

**Step 2.** Start Postgres locally:

```bash
docker compose up -d postgres
```

**Step 3.** Install dependencies and apply migrations:

```bash
npm ci
npx prisma migrate dev
```

**Step 4.** Run the app:

```bash
npm run dev
```

**Step 5.** Confirm **health**: `GET /api/health` should return JSON.

**Step 6.** **OTP login** (happy path):

1. `POST /api/auth/otp/request` with `{ "email": "you@example.com" }`
2. Read the code from your mail catcher or server logs (dev).
3. `POST /api/auth/otp/verify` with `{ "email": "...", "code": "..." }`
4. `GET /api/auth/session` should show your user.

**Step 7.** **Drafts**: With a session, `GET /api/drafts/me` and `PUT /api/drafts/me` with `{ "payload": { ... } }` (create flow state object).

**Step 8.** **Publish**: `POST /api/rules` with `{ "title", "summary?", "document" }`.

**Step 9.** **Templates** (when ready): seed `RuleTemplate` rows; `GET /api/templates` is implemented.

**Step 10.** **Frontend sync**: Set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` in `.env` for server drafts when logged in; `localStorage` remains fallback when off or anonymous.

**Step 11.** **Web vitals:** Move off `.next` files—**prefer an external analytics or logging pipeline** (see §7). Use Postgres for vitals only as a deliberate ops choice.

---

## 10. Security checklist

- **HTTPS** in staging/production; session cookie **Secure**.
- **Rate-limit** OTP (in-memory OK for one instance; **shared store before multi-instance**—see §5).
- **Hash** OTP codes and session tokens before storing; short OTP expiry.
- **Secrets** only in env / secret store — never commit `.env` with real values.
- **CORS:** prefer **same-origin** `/api/*`; if cross-origin, configure CORS and CSRF carefully.

---

## 11. Environments

| Environment    | Purpose                         | Notes                                                                 |
| -------------- | ------------------------------- | --------------------------------------------------------------------- |
| **Local**      | Daily development               | Docker Compose: Postgres + optional Mailhog (`docker compose up -d`). |
| **Staging**    | Rehearse deploys and migrations | Match prod as closely as possible; test SMTP.                         |
| **Production** | Users                           | Backups, monitoring, migration job before traffic.                    |

**Optional QA:** Run automated tests against an **ephemeral** database in CI instead of maintaining a fourth long-lived server.

**Admin / infra (coordinate with whoever runs the server):**

1. TLS certificates and hostnames.
2. PostgreSQL backups and restore drill.
3. SMTP DNS (SPF, DKIM).
4. Health check URL for reverse proxy (`/api/health`).
5. Log retention and alerts for 5xx errors.

---

## 12. Frontend hook-up

**Step 1.** Keep default behavior: **no env flag** → create flow uses **only** `localStorage` (current behavior).

**Step 2.** Set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` to opt in to server drafts when logged in.

**Step 3.** Implement sign-in UI when you are ready: call the OTP routes, then rely on the browser cookie for `/api/drafts/me`.

**Step 4.** On publish, call `POST /api/rules` from the completed step when the backend is required (wire when the final review UI is ready).

---

## 13. Optional later

- **Session library** spike (Auth.js, Lucia) if custom lifecycle cost grows.
- **Redis** (or similar) for **shared OTP rate limits** and horizontal scale.
- **RuleDraft** versioning or multiple drafts per user.
- Standalone **API service** (Fastify/Hono) if scaling or workers demand it.
- **OpenAPI** if external API clients appear.
- **Fourth environment** or stricter rate limiting at the edge.

---

## 14. Useful commands

| Command                                 | When                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npx prisma studio`                     | Inspect/edit DB locally.                                                                   |
| `npx prisma migrate dev`                | After changing `schema.prisma` in development.                                             |
| `npx prisma migrate deploy`             | Apply migrations in staging/production.                                                    |
| `docker compose up -d postgres mailhog` | Local DB + mail UI (http://localhost:8025).                                                |
| `docker build -t community-rule .`      | Optional production image (Next **standalone** + `node server.js`; see repo `Dockerfile`). |

---

## External reading

- [Docker: development best practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose in production](https://docs.docker.com/compose/how-tos/production/)
