# Backend roadmap (reference)

Temporary working notes for building the backend. Safe to delete once the stack is stable.

---

## 1. Where we are

- **Next.js 16** single repo ([`package.json`](package.json)).
- **PostgreSQL + Prisma**: schema and migrations under `prisma/`; product APIs under `app/api/*` (health, auth/magic-link, session, drafts, rules, templates, web-vitals).
- **Server modules** in `lib/server/` (db, session, mail, rate limiting, etc.).
- **Create flow:** **Anonymous** users mirror in-progress state to **`create-flow-anonymous`** in `localStorage`; **Exit** opens the save-progress magic-link modal; after verify, [`PostLoginDraftTransfer`](app/(app)/create/PostLoginDraftTransfer.tsx) can **PUT** `/api/drafts/me` when **`NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true`**. **Signed-in** users get a **fresh** in-memory session per “Create rule” entry, but with sync on the layout may **hydrate** from **`GET /api/drafts/me`** via [`SignedInDraftHydration`](app/(app)/create/SignedInDraftHydration.tsx); **Save & Exit** (from `community-structure` onward) **PUT**s when sync is on. **Log in** from the marketing header uses the global modal ([`AuthModalProvider`](app/contexts/AuthModalContext.tsx)); **`/login`** remains for verify errors and deep links. **Step order and URLs:** [`docs/create-flow.md`](docs/create-flow.md) and [`app/(app)/create/utils/flowSteps.ts`](app/(app)/create/utils/flowSteps.ts).
- **Web vitals** [`app/api/web-vitals/route.ts`](app/api/web-vitals/route.ts): **production default** is **`external`** (structured logs; no `.next` writes). **`local`** file-based mode remains for development (`WEB_VITALS_STORAGE`).
- **Pre-merge checks:** run locally (see [docs/testing-guide.md](../testing-guide.md) § *Running tests*; [CONTRIBUTING.md](../CONTRIBUTING.md) pull request workflow). No in-repo remote CI workflow; production deploy is out of band ([ops-backend-deploy.md](ops-backend-deploy.md)).

### HTTP API (implemented in repo)

Mirrors [CONTRIBUTING.md](../CONTRIBUTING.md) **API routes** table (including `/api/templates` facet params, `/api/create-flow/methods`, and `/api/web-vitals`); handlers live under `app/api/*/route.ts`.

| Method     | Path                           | Purpose                                       |
| ---------- | ------------------------------ | --------------------------------------------- |
| GET        | `/api/health`                  | Liveness / DB check                           |
| GET        | `/api/auth/session`            | Current user or null                          |
| POST       | `/api/auth/magic-link/request` | Send sign-in link email                       |
| GET        | `/api/auth/magic-link/verify`  | Validate token, set session cookie, redirect  |
| POST       | `/api/auth/logout`             | Clear session                                 |
| GET / PUT  | `/api/drafts/me`               | Load or save create-flow JSON (authenticated) |
| GET / POST | `/api/rules`                   | List or publish rules                         |
| GET        | `/api/templates`               | List curated templates; optional `facet.*` re-ranks (see [template-recommendation-matrix.md](template-recommendation-matrix.md)) |
| GET        | `/api/create-flow/methods`      | Facet scores for wizard method lists (`section` + optional `facet.*`) |
| POST / GET | `/api/web-vitals`              | Web vitals ingest / read aggregates (`external` default in production — logs only; `local` under `.next` in dev — see §7) |

**Product sign-in** uses **magic link** (`/api/auth/magic-link/*`).

### HTTP API (profile / account — not implemented yet)

Planned for the signed-in profile/dashboard ([Figma profile frame](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22143-900069); [docs/backend-linear-tickets.md](backend-linear-tickets.md) Ticket 15; Linear **[CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)**):

- Authenticated list of **own** `PublishedRule` rows (e.g. `GET /api/rules/me` or a strictly scoped query—**not** the same as public `GET /api/rules`).
- Owner-only **delete** and **duplicate** (clone) for published rules.
- **Delete account** (authenticated), with an explicit policy for drafts, sessions, and linked rules.

**Future (separate ticket):** **Change email** with verification (e.g. magic link to a new address, conflict handling)—**out of scope** for the profile milestone above.

---

## 2. What we’re building

**Step 1.** Treat this as **greenfield**: new **PostgreSQL** database and new tables. Do **not** migrate data from the old Community Rule backend.

**Step 2.** Keep the backend **inside this Next app**:

- HTTP handlers under `app/api/…`
- Shared server code under `lib/server/…`

**Step 3.** Use the old backend only as a **product hint** (passwordless email sign-in, saving rules, listing rules). Do **not** copy its Express layout or MySQL schema.

---

## 3. Stack choices

**Step 1.** Use **PostgreSQL** everywhere (local Docker, staging, production).

**Step 2.** Use **Prisma** — `schema.prisma`, `npx prisma migrate dev` / `migrate deploy`.

**Step 3.** Add **SMTP** (or Mailhog locally) for **magic-link** sign-in email in deployed environments; when `SMTP_URL` is unset in dev, the app can log the **verify URL** to the console (same pattern as [`lib/server/mail.ts`](lib/server/mail.ts)).

**Step 4.** **Redis / queues / Kubernetes** — not required for v1. **Exception:** before running **multiple app instances**, plan a **shared rate-limit store** (often Redis) for **passwordless email (magic-link request)**; the current limiter is in-memory per process ([`lib/server/rateLimit.ts`](lib/server/rateLimit.ts)).

---

## 4. Data to model (first pass)

Plain-English entities (names can evolve):

| Area               | Purpose                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **User**           | Identified by email after **magic link verification** (primary v1 path). An optional **display name** (or preferred name) could be added later for richer greetings; it does **not** block the profile page—no schema commitment in this roadmap pass alone. |
| **Session**        | **Custom v1:** HttpOnly cookie; opaque token; **hash** stored in DB ([`lib/server/session.ts`](lib/server/session.ts)). Not NextAuth/Lucia.                                                                                                                  |
| **MagicLinkToken** | Short-lived **hashed** token for email sign-in links; optional `nextPath` for post-login redirect.                                                                                                                                                           |
| **RuleDraft**      | **One** JSON blob per user (create-flow state). Schema already has **`updatedAt`**; no draft **versioning** or **multiple named drafts** in v1.                                                                                                              |
| **PublishedRule**  | Saved rule after publish (title, summary, document JSON). Profile UI badges such as **IN PROGRESS** may be **derived from `document` JSON**, a future `status` column, or UI-only—product decision when implementing Ticket 15.                              |
| **RuleTemplate**   | Curated templates (slug, category, ordering, `body` JSON). **v1 API** lists rows for cards / create entry; **not** yet a recommendation engine (see below).                                                                                                  |

**RuleTemplate — recommendation matrix (after v1 list):** Product may author templates in **spreadsheets** (e.g. one row per governance pattern, columns for **matching dimensions** such as group size, organization type, location, maturity, plus long-form fields for create-flow prefill). That implies: **normalized schema or versioned JSON** for dimensions × template fit (✓/✗, weights, or scores), an **import path** (export `.xlsx` / Sheets → validate → DB or build-time artifact), and **`GET /api/templates` (or a sibling route)** that accepts **user- or wizard-selected facets** and returns a **ranked or filtered** set. **Out of scope for first ship** of Tickets 7–8 (seed + display list); tracked as **Ticket 16** in [docs/backend-linear-tickets.md](backend-linear-tickets.md) and Linear **[CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-facet-data-seed-and-apis-no)** (**Done** — committed JSON + seed; no runtime `.xlsx`). Prefer **batch import** over live Google Sheets API in production unless ops explicitly wants sync.

**Session lifecycle (shipped, [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy)):** **Multi-device** policy — a new sign-in does **not** invalidate the user's other valid sessions. **Cleanup is lazy and cron-free:** every `createSessionForUser` prunes that user's expired rows (uses `@@index([userId])`); ~5% of sign-ins also run a global sweep so rows from users who never return remain bounded over months. Cleanup failures are logged but never fail the sign-in. **Rotation** on privilege-sensitive actions is deferred to v1.1. See the ADR comment block at the top of [`lib/server/session.ts`](../../lib/server/session.ts). Revisit a small auth library (e.g. Auth.js, Lucia) only if maintaining custom code becomes costly.

**RuleDraft future (not v1):** versioning, multiple drafts per user, easier corruption recovery—only if product needs them.

Align JSON shapes with `app/(app)/create/types.ts` as it matures.

---

## 5. Session and authentication (v1)

- **Decision:** **Custom** database-backed sessions + **email magic link**; cookies are **httpOnly**; session and magic-link tokens are hashed at rest.
- **Rate limiting (magic-link request):** **In-memory** is acceptable for a **single Node process**. It does **not** coordinate across instances—**add a shared limiter (e.g. Redis)** before horizontal scaling or serious abuse exposure.
- **Lifecycle policy (shipped, [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy)):** multi-device (sign-in does not revoke other valid sessions); lazy expired-row cleanup on every sign-in (per-user prune + ~5% global sweep) — no cron required. Token rotation deferred to v1.1. Canonical comment block lives at the top of [`lib/server/session.ts`](../../lib/server/session.ts).
- Do **not** treat “switch to NextAuth/Lucia” as required for v1; document the custom lifecycle above instead.

---

## 6. Authorization (v1)

Match the current API behavior; tighten as product evolves:

- **`GET /api/drafts/me` / `PUT /api/drafts/me`:** Authenticated user only; draft is **scoped to that user** (`userId`).
- **`POST /api/rules`:** Authenticated user only; rule is stored with **`userId`** (owner).
- **`GET /api/rules`:** **Public list** of published rules (metadata: id, title, summary, timestamps)—no auth required today. **Not** a private “my rules” feed unless you add a separate route later (see §1 “profile / account — not implemented yet” and Ticket 15).
- **Profile / owner scope (planned):** Authenticated **list own rules**, **delete own rule**, **duplicate own rule**—required for the signed-in dashboard in design; **v1 shipped handlers** may not include these until that work lands.
- **Delete account (planned):** Authenticated endpoint + UX to remove the user record per policy (cascade vs orphan `PublishedRule`, drafts, sessions)—Ticket 15. **Change email** is **not** part of that milestone; plan a **future ticket** for verified email updates.
- **v1 (shipped today):** No **editing** or **deleting** published rules via API in current handlers; no **sharing** or **collaborative ownership**—treat each rule as **owned by one user** until product defines more.

---

## 7. API responses, errors, and observability

**Error JSON (implemented):** 4xx/5xx bodies use the canonical shape `{ "error": { "code": "string", "message": "string" }, "details"?: ... }`. Codes come from the `ApiErrorCode` union in [`lib/server/responses.ts`](../lib/server/responses.ts) (helpers: `errorJson`, `dbUnavailable`, `unauthorized`, `notFound`, `rateLimited`, `serverMisconfigured`, `internalError`); validation failures use [`jsonFromZodError`](../lib/server/validation/zodHttp.ts) and surface flattened issues in `details`. **Migrated:** auth (`/api/auth/*`), drafts (`/api/drafts/me`), rules (`/api/rules`, `/api/rules/[id]`). Remaining `app/api/*` handlers (e.g. `web-vitals`, `templates`, `create-flow/methods`, `health`) are a follow-up pass; new routes should adopt the helpers from day one.

**Logging:** Use the shared [`lib/logger.ts`](../lib/logger.ts) where possible. Wrap route handlers with [`apiRoute(scope, handler)`](../lib/server/apiRoute.ts) so a sanitized `x-request-id` is generated (or forwarded) onto every response and uncaught throws return the canonical 500 with the id logged via `logRouteError` ([`lib/server/requestId.ts`](../lib/server/requestId.ts)). Pass the `requestId` through to in-handler `logRouteError(scope, requestId, err, extra?)` calls when catching expected failures (e.g. mail send) so support can tie logs together.

**Metrics:** No vendor required for v1; optional later: request duration, error counts.

**Web vitals:** **Default** is **external** RUM or log drain (e.g. host analytics, Vercel Analytics, OpenTelemetry, SaaS APM)—keep **product Postgres** focused on product entities. Storing vitals in Postgres is an **explicit tradeoff** only if ops strongly wants a single datastore.

---

## 8. Prisma migrations policy

- **Never edit** migration files that have **already been applied** to **staging or production** (or any shared database). Fixing schema drift = **add a new migration**.
- **Local dev:** `prisma migrate dev` creates migrations; **deployed envs:** `prisma migrate deploy` before serving new code that depends on the schema.

---

## 9. Build order (implementation steps)

**Operator / local (always manual):** Steps 1–4 — env file, Docker Postgres, `npm ci`, `prisma migrate dev`, `npm run dev`.

**Backend behavior already in the repo:** Steps **5–10** match implemented Route Handlers and middleware (`lib/server/*`). **Step 11** (web vitals): production defaults to **`external`** (no `.next` writes); optional vendor RUM or DB persistence remains a deliberate ops choice per §7.

**Product / frontend still open (not only “backend exists”):** Sign-in UI, wiring publish from the create flow, template seed + UI consumption (flat list first), **canon create-flow alignment** (Ticket 17 / [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo) — progress bar, resume URL, `[step]` cleanup; spec in [`docs/create-flow.md`](create-flow.md)), **spreadsheet-driven template recommendations** (Ticket 16 / [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion) — after v1 templates), **profile / my rules dashboard** (Ticket 15)—see §12 and [docs/backend-linear-tickets.md](backend-linear-tickets.md).

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

**Step 6.** **Magic-link sign-in** (happy path):

1. `POST /api/auth/magic-link/request` with `{ "email": "you@example.com" }` (optional `"next"` for redirect after verify).
2. Open the link from email, Mailhog, or **server logs** when `SMTP_URL` is unset (dev).
3. Browser hits `GET /api/auth/magic-link/verify?token=...` (and optional `next=...`); response sets the session cookie and redirects.
4. `GET /api/auth/session` should show your user in the same browser.

**Before wiring create-flow session UI:** Confirm the same browser that completed verify gets `user` from `GET /api/auth/session` (cookie + same-site). On **staging/production**, magic-link emails embed the app origin—misconfigured **`Host`** or TLS termination can produce broken links; align reverse proxy with the public site URL.

**Step 7.** **Drafts**: With a session, `GET /api/drafts/me` and `PUT /api/drafts/me` with `{ "payload": { ... } }` (create flow state object).

**Step 8.** **Publish**: `POST /api/rules` with `{ "title", "summary?", "document" }`.

**Step 9.** **Templates** (when ready): seed `RuleTemplate` rows; `GET /api/templates` is implemented.

**Step 10.** **Frontend draft sync:** Set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` in `.env` so **Save & Exit** and **post-login anonymous → account transfer** can **PUT** `/api/drafts/me`. Without sync, drafts are **not** written to the server (anonymous progress still lives in `localStorage` only).

**Step 11.** **Web vitals:** Production uses **`external`** storage (structured logs). Add a browser RUM SDK or Postgres-backed vitals only as a deliberate ops choice (see §7).

---

## 10. Security checklist

- **HTTPS** in staging/production; session cookie **Secure**.
- **Rate-limit** magic-link **request** — in-memory OK for one instance; **shared store before multi-instance** (see §5).
- **Hash** magic-link tokens and session tokens before storing; short **magic-link** TTL (align with implementation, e.g. 15 minutes).
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

**Target platform:** **Cloudron at MEDLab** — same host as the legacy [`CommunityRule/CommunityRuleBackend`](https://git.medlab.host/CommunityRule/CommunityRuleBackend) (Express + MySQL). The new app is packaged as a proper Cloudron app (Docker image + `CloudronManifest.json`, **postgresql + sendmail + localstorage** addons). Cloudron's container supervisor replaces the legacy 30-min `run.sh` watchdog. Admin handoff (access, env vars, platform settings, open decisions): [`docs/guides/ops-backend-deploy.md`](ops-backend-deploy.md). Note: Cloudron injects `CLOUDRON_POSTGRESQL_URL` and `CLOUDRON_MAIL_SMTP_*`; the app reads `DATABASE_URL` / `SMTP_URL`, so a small env-var bridge in [`lib/server/env.ts`](../../lib/server/env.ts) / [`lib/server/mail.ts`](../../lib/server/mail.ts) is needed (tracked in [**CR-96**](https://linear.app/community-rule/issue/CR-96/backend-bridge-cloudron-env-vars-to-canonical-names), filed under CR-83 — see [backend-linear-tickets.md](backend-linear-tickets.md) Ticket 12 follow-ups).

**Admin / infra (coordinate with whoever runs the server):**

1. TLS certificates and hostnames. _On Cloudron: handled by the platform per chosen subdomain._
2. PostgreSQL backups and restore drill. _On Cloudron: daily snapshots; configure retention in admin UI._
3. SMTP DNS (SPF, DKIM). _On Cloudron: handled for the platform-managed domain._
4. Health check URL for reverse proxy (`/api/health`). _On Cloudron: set `healthCheckPath` in `CloudronManifest.json`._
5. Log retention and alerts for 5xx errors. _On Cloudron: app log viewer; export off-platform if longer retention is needed._

---

## 12. Frontend hook-up

**Step 1.** **Anonymous** create flow: in-progress state is stored in **`create-flow-anonymous`** (`localStorage`). **Signed-in** users: when **`NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true`**, the create layout may **hydrate** in-memory flow state from **`GET /api/drafts/me`** once per session ([`SignedInDraftHydration`](../app/(app)/create/SignedInDraftHydration.tsx)), including conflict handling if anonymous storage also has data. Without sync, signed-in progress stays **in memory** until **Save & Exit** (no automatic server read on entry). **Canonical wizard step order, URLs, and Figma product stages** (**Create Community** → **Create Custom CommunityRule** → **Review and complete**) are documented in [`docs/create-flow.md`](create-flow.md). The route **`/create/review-template/[slug]`** is an **auxiliary** template preview (not a numbered wizard step); a **full create-from-template** path will likely be **separate route(s)** when defined. **Prefilling the wizard or landing on `final-review` from a template** is **not** shipped yet — see **[CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)** / Ticket 17 in [docs/backend-linear-tickets.md](backend-linear-tickets.md).

**Step 2.** Set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` to enable **PUT** on **Save & Exit** and after **magic-link transfer** from the save-progress exit modal.

**Step 3.** Sign-in: **Log in** in the header opens the **modal** ([`AuthModalProvider`](app/contexts/AuthModalContext.tsx)); **`/login`** is still used for verify **error** redirects and bookmarks. Flow: request magic link → open verify URL → session cookie → `GET /api/auth/session` / `/api/drafts/me` as needed.

**Step 4.** On publish, call `POST /api/rules` from the completed step when the backend is required (wire when the final review UI is ready).

**Step 5.** **Profile / dashboard** (`/profile` or agreed path): signed-in hub for **my rules** (after Ticket 15 APIs exist), **duplicate** / **delete** rule actions, **logout**, **delete account**—aligned with [Figma profile](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22143-900069). **Change email** in design is **deferred** (hide, “coming soon,” or backlog) until a future account ticket; greeting copy can stay **static** or use **email local-part in UI only**—no `displayName` field required for MVP.

**Step 6.** **Templates:** **Tickets 7–8** — seed `RuleTemplate` and load **`GET /api/templates`** in home / create surfaces (flat list, optional `featured`). **Ticket 16 / [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion)** — add **facet-based recommendations** and **spreadsheet ingestion** when product is ready (matrix rows + dimension columns like the decision-making workbook).

---

## 13. Optional later

- **Template recommendation matrix** + `.xlsx` / Sheets import pipeline — see **Ticket 16** / **[CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion)** (also §4 `RuleTemplate` note); not bundled into v1 template list work.
- **Session library** spike (Auth.js, Lucia) if custom lifecycle cost grows.
- **Redis** (or similar) for **shared magic-link rate limits** and horizontal scale.
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
