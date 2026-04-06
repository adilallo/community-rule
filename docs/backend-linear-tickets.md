# Backend work — linear tickets

Copy each block into Linear (or your tracker) as a separate issue, **in order**. Earlier tickets are prerequisites for later ones.

**Foundation already in the repo (no ticket needed unless you are onboarding a greenfield clone):** Prisma schema ([prisma/schema.prisma](prisma/schema.prisma)), migrations, `lib/server/*`, Route Handlers under `app/api/*`, [docker-compose.yml](docker-compose.yml), [Dockerfile](Dockerfile), [CONTRIBUTING.md](CONTRIBUTING.md), [`.env.example`](.env.example), [lib/create/api.ts](lib/create/api.ts), [CreateFlowBackendSync](app/create/context/CreateFlowBackendSync.tsx) behind `NEXT_PUBLIC_ENABLE_BACKEND_SYNC`.

### Review sync (relevant feedback only)

A backend review was merged into **[docs/backend-roadmap.md](backend-roadmap.md)** after checking the repo. **Incorporated:** custom session lifecycle follow-ups (not a mandate to adopt Auth.js/Lucia), **passwordless email (magic-link request)** rate limits in-memory until multi-instance + shared store, `RuleDraft` already has `updatedAt` (no migration to add it), **prefer external web vitals** over product Postgres by default, API error shape + request-id observability targets, **authorization v1** aligned with `app/api/rules`, Prisma **never edit applied migrations**, **profile / my rules / account** scope from Figma profile (`22143:900069`) as **Ticket 15** (change email deferred). **Excluded:** requiring NextAuth/Lucia; “add `updatedAt` on drafts”; hard ban on DB for vitals (softened to default external). **Parallel Linear issues:** **CR-84** (API errors, blocked by CR-73), **CR-85** (session lifecycle, blocked by CR-75)—see **Linear** table at the end of this doc.

---

## When you need server / admin access (and for what)

Use this if you **do not** have SSH or hosting access yet. Most engineering tickets are **local-only** until you deploy somewhere shared.

### You do **not** need the server admin for

- **Tickets 1–8, 10:** Everything runs on your machine: `docker compose up -d postgres mailhog`, `.env`, `npm run dev`, `npx prisma migrate dev`. **Magic-link** sign-in email can use Mailhog or **dev server logs** (verify URL) when `SMTP_URL` is unset—no real SMTP required locally.
- **Verifying APIs:** Use `localhost` and the same Docker Postgres—no production host.

### The **first** time you need someone with hosting access

That is when you deploy to **staging** or **production** (a URL other people use, or a persistent DB not on your laptop). Until then, you can finish the core product slice without server credentials.

Ask the admin to provide (or do for you) the items below—**Ticket 12** turns this into a written runbook.

| What                 | Why you need it                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Postgres**         | Managed instance or container; a **`DATABASE_URL`** you can plug into the deployed app.                                                                          |
| **Run migrations**   | Someone runs **`npx prisma migrate deploy`** against that database **before** the new app version serves traffic (or gives you a secure way to run it in CI/CD). |
| **`SESSION_SECRET`** | Long random string in production env (sessions **+ hashed magic-link tokens**).                                                                                  |
| **SMTP**             | **`SMTP_URL`** + **`SMTP_FROM`** for real **sign-in link** email; not required on laptop if you use logs/Mailhog.                                                |
| **DNS for mail**     | Often **SPF/DKIM** so **magic-link** messages are not spam—admin or whoever owns DNS.                                                                            |
| **TLS + hostname**   | HTTPS URL for the site; reverse proxy (nginx, Caddy, etc.) in front of Node.                                                                                     |
| **Health check**     | Load balancer or platform should probe **`GET /api/health`** (or your chosen path).                                                                              |
| **Secrets storage**  | Env vars or secret manager—never commit `.env` with secrets.                                                                                                     |
| **Backups**          | Postgres backup/restore for production (and ideally staging).                                                                                                    |

Optional: **Docker image deploy** using the repo [Dockerfile](Dockerfile)—admin builds/pushes/runs the container with the env vars above.

### Ticket-by-ticket: admin involvement

| Ticket | Need server admin?                                                                       | What for                                                                                                                                                             |
| ------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2    | **No**                                                                                   | Docs and app code only.                                                                                                                                              |
| 3      | **No** to build/test; **Yes** when **magic-link email** must work on a **deployed** env  | Real **SMTP** + DNS on staging/prod (same as table above).                                                                                                           |
| 4–8    | **No**                                                                                   | Local or staging URL is still “your” deploy—admin only if that URL is on their infra.                                                                                |
| 9      | **No** to implement; **Yes** when **production** uses multiple instances or read-only FS | **Default** is external RUM/log drain; Postgres vitals only if ops explicitly wants one datastore—may need vendor keys for SaaS.                                     |
| 10     | **No** to code                                                                           | Same deploy pipeline as the rest of the app.                                                                                                                         |
| 11     | **Maybe**                                                                                | Whoever owns **Gitea runners**: can they run Postgres in CI? Not the same as production server, but often the same “infra” person.                                   |
| 12     | **Yes—this is the handoff ticket**                                                       | You (or admin) write **`docs/ops-backend-deploy.md`** so deploy steps are explicit; **you need admin input** to fill in hostnames, DB provider, SMTP, backup policy. |

### One-line summary

**You only need the server admin when you move off your laptop to a shared staging/production host**—for database, secrets, TLS, SMTP/DNS, migrations on that DB, health checks, and backups. Until then, **Tickets 1–8 are unblocked** with Docker Compose locally.

---

## Ticket 1 — Align `docs/backend-roadmap.md` with the current codebase

**Depends on:** nothing.

**Goal:** Remove stale statements so the roadmap matches reality and stays a trustworthy reference until you delete it.

**Context:** Section 1 still says there is no DB and only web-vitals API; the app now has Postgres models, auth, drafts, rules, templates API, etc.

**Implementation:**

1. Rewrite **§1 Where we are** to list: Prisma + Postgres, existing `app/api/*` routes, `localStorage` + optional server draft sync, web-vitals still file-based.
2. In **§9 Build order** (build steps were renumbered from old §5), mark what is **operator/manual**, what is **already shipped in the repo**, and what is **still product/frontend** (sign-in UI, publish wiring, etc.).
3. Add **HTTP API (implemented in repo)** — table mirroring [CONTRIBUTING.md](CONTRIBUTING.md), plus note for `/api/web-vitals`.

**Acceptance criteria:**

- [x] A new contributor reading only the roadmap does not think the backend is unbuilt.
- [x] **§13 Optional later** (old §9) unchanged in intent — optional Redis, session-library spike, draft versioning, standalone API, OpenAPI, fourth env.

**Status:** [CR-72](https://linear.app/community-rule/issue/CR-72/backend-align-docsbackend-roadmapmd-with-current-codebase) **Done**.

**Files:** [docs/backend-roadmap.md](docs/backend-roadmap.md) only.

---

## Ticket 2 — Formalize `CreateFlowState` and validate API payloads

**Depends on:** Ticket 1 (optional but keeps docs honest).

**Goal:** Replace the open `[key: string]: unknown` shape in [app/create/types.ts](app/create/types.ts) with real fields (or nested objects) agreed with design/product, and validate JSON on the server for drafts and publish.

**Context:** `PUT /api/drafts/me` and `POST /api/rules` accept loose objects today; oversized or malformed payloads are a stability and security concern.

**Implementation:**

1. Document intended fields per create-flow step (can start minimal: e.g. `title`, `sections`, `stakeholders` placeholders) in `CreateFlowState`.
2. Add **Zod** (or reuse **Ajv** if you prefer consistency with [lib/validation.ts](lib/validation.ts)) schemas:
   - `createFlowStateSchema` for draft `payload`.
   - `publishedRuleDocumentSchema` for `document` on `POST /api/rules`.
3. In [app/api/drafts/me/route.ts](app/api/drafts/me/route.ts) and [app/api/rules/route.ts](app/api/rules/route.ts), parse with schema; on failure return `400` with a small `{ error, details? }` body.
4. Enforce a **max payload size** (e.g. reject bodies &gt; 512KB) via route handler check or Next config if applicable.

**Acceptance criteria:**

- [x] TypeScript reflects the real shape of `CreateFlowState` (no unnecessary `unknown` for known keys).
- [x] Invalid draft/publish requests return 400, not 500.
- [x] Unit tests for schemas (Vitest) or route tests with MSW.

**Status:** [CR-73](https://linear.app/community-rule/issue/CR-73/backend-formalize-createflowstate-validate-draftpublish-api-payloads) **Done**.

**Files:** [app/create/types.ts](app/create/types.ts), [app/api/drafts/me/route.ts](app/api/drafts/me/route.ts), [app/api/rules/route.ts](app/api/rules/route.ts), [lib/server/validation/](lib/server/validation/) (Zod + plain-JSON checks), [package.json](package.json) (`zod`).

**Note:** Repo-wide **API error JSON shape** and **request-id logging** are **Ticket 13 / CR-84**—coordinate 400 response bodies with that issue so validation errors match the agreed `{ error: { code, message } }` pattern.

---

## Ticket 3 — Email magic-link sign-in UI (end-to-end with existing APIs)

**Depends on:** Ticket 2 (soft dependency: types help name fields you might store post-login; can start in parallel if needed).

**Server / admin:** **Not required** to build and test (Mailhog or verify URL in server logs locally). **Required** when **magic-link email** must work on **staging/production**: admin provides **SMTP** + usually **DNS (SPF/DKIM)** and sets env on the host (see top table). **Residual:** links in email use the app origin—reverse proxy / `Host` must match the URL users open.

**Goal:** Let a user request a **sign-in link** and complete sign-in in the browser using existing endpoints.

**Context:** APIs: `POST /api/auth/magic-link/request`, `GET /api/auth/magic-link/verify`, `GET /api/auth/session`, `POST /api/auth/logout`. Prisma: `MagicLinkToken`. Client: [`requestMagicLink`](lib/create/api.ts).

**Implementation (shipped):**

1. **`/login`** route and/or **modal** from the header (designer-approved)—[app/login/page.tsx](app/login/page.tsx), [app/login/LoginPageClient.tsx](app/login/LoginPageClient.tsx), [app/components/modals/Login/](app/components/modals/Login/) (`LoginForm.tsx`, container/view).
2. Flow: email → “Send link” → user opens link (email, Mailhog, or dev log) → `GET /api/auth/magic-link/verify?token=...` sets session and redirects; optional `next` for post-login path.
3. Surface API errors: invalid email, 429 `retryAfterMs`, expired/invalid token, network failure (accessible copy).
4. Ensure `fetch` calls use `credentials: "include"` where needed (see [lib/create/api.ts](lib/create/api.ts)).
5. **Dev:** without `SMTP_URL`, verify URL is logged; with Mailhog, use [docker-compose.yml](docker-compose.yml) and `SMTP_URL=smtp://localhost:1025`.
6. **Marketing header:** When signed in (`fetchAuthSession`), **Log in** becomes **Profile** linking to [`/profile`](app/profile/page.tsx) (placeholder until Ticket 15 / CR-86). Implemented in [TopNavWithPathname.tsx](app/components/navigation/TopNav/TopNavWithPathname.tsx) + [TopNav.container.tsx](app/components/navigation/TopNav/TopNav.container.tsx).

**Acceptance criteria:**

- [x] Happy path: user completes magic-link verify and `GET /api/auth/session` returns `user` in the same browser session.
- [x] Keyboard + screen-reader friendly forms (labels, errors associated with fields).
- [x] No secrets in client bundle.
- [x] Header shows **Profile** → placeholder `/profile` when session present; **Log in** when anonymous.

**Status:** [CR-74](https://linear.app/community-rule/issue/CR-74/backend-email-otp-sign-in-ui-existing-apis) **Done** for shipped UI/APIs. **Residual checklist** below: repo doc items are **done**; use Linear (CR-74 or child issue) to track **per-environment** staging URL checks.

**Files:** [app/login/](app/login/), [app/profile/](app/profile/) (placeholder), [app/components/modals/Login/](app/components/modals/Login/), [messages/en/pages/login.json](messages/en/pages/login.json), [messages/en/pages/profile.json](messages/en/pages/profile.json), [messages/en/components/header.json](messages/en/components/header.json), [app/components/navigation/TopNav/TopNav.container.tsx](app/components/navigation/TopNav/TopNav.container.tsx), [app/components/navigation/TopNav/TopNavWithPathname.tsx](app/components/navigation/TopNav/TopNavWithPathname.tsx), [lib/create/api.ts](lib/create/api.ts), [app/api/auth/magic-link/request/route.ts](app/api/auth/magic-link/request/route.ts), [app/api/auth/magic-link/verify/route.ts](app/api/auth/magic-link/verify/route.ts), [prisma/schema.prisma](prisma/schema.prisma) (`MagicLinkToken`), [lib/server/mail.ts](lib/server/mail.ts). Onboarding: [CONTRIBUTING.md](CONTRIBUTING.md), [`.env.example`](.env.example).

### Residual / before CR-75 (create-flow session UI)

**Intent:** [Ticket 4](#ticket-4--session-affordances-in-the-create-flow-signed-in-state--sign-out) (**CR-75**) needs a reliable signed-in story across marketing + `/create`. Below: what is **done in repo** vs what to **verify per environment**.

1. **Contributor / onboarding** — **Done:** [CONTRIBUTING.md](CONTRIBUTING.md) API table and sign-in section describe **magic-link** request/verify, dev log URL, and Mailhog. [`.env.example`](.env.example) comments match.
2. **Smoke checklist** — **Done:** **Email magic link (sign-in)** in [CONTRIBUTING.md](CONTRIBUTING.md); build-order §9 in [docs/backend-roadmap.md](backend-roadmap.md) includes the same happy path + session check.
3. **Staging / production URLs** — **Verify on each deploy:** emails use `request.nextUrl.origin`; confirm reverse proxy and **`Host`** so links in mail match the public site (CONTRIBUTING + roadmap §9 spell this out).
4. **Docs alignment** — **Done:** [docs/backend-roadmap.md](backend-roadmap.md) and this doc treat magic link as primary; CR-72/CR-73 schema work is not a blocker for CR-75.

---

## Ticket 4 — Session affordances in the create flow (signed-in state + sign out)

**Depends on:** Ticket 3.

**Goal:** While in `/create/*`, users see whether they are signed in and can sign out without leaving the flow awkwardly.

**Context:** [CreateFlowTopNav](app/components/utility/CreateFlowTopNav/) has props like `loggedIn` currently tied to step UI in [app/create/layout.tsx](app/create/layout.tsx) (`isCompletedStep`). Decouple **auth session** from **step**.

**Implementation:**

1. On create layout mount (or a small wrapper provider), call `fetchAuthSession()` and store `{ user }` in React state or a tiny `AuthSessionContext`.
2. Pass **real** `loggedIn={Boolean(user)}` (or rename prop to `isAuthenticated` if clearer) and show **email** (truncated) per design.
3. Wire **Sign out** to `logout()` from [lib/create/api.ts](lib/create/api.ts), clear client state as needed, refresh session.
4. Optionally: if `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` and user is anonymous, show one-line CTA “Sign in to save progress to your account” linking to login.

**Acceptance criteria:**

- [ ] Completed step still works; auth state is independent of `completed` step.
- [ ] Sign out clears httpOnly session server-side and UI updates.

**Files:** [app/create/layout.tsx](app/create/layout.tsx), [app/components/utility/CreateFlowTopNav/](app/components/utility/CreateFlowTopNav/), optional new `app/create/context/AuthSessionContext.tsx`.

---

## Ticket 5 — Harden server draft sync (UX + edge cases)

**Depends on:** Tickets 2–4.

**Goal:** `CreateFlowBackendSync` is production-grade when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true`.

**Context:** [app/create/context/CreateFlowBackendSync.tsx](app/create/context/CreateFlowBackendSync.tsx) hydrates from server and debounces saves; today it can race with localStorage-first paint and silently fail saves.

**Implementation:**

1. **Hydration:** Show a non-blocking “Loading your saved progress…” until first session + draft fetch completes (only when sync enabled).
2. **Conflict:** If `localStorage` has non-empty state and server returns non-empty draft, pick a policy: prefer server with confirm modal, or prefer newer `updatedAt` (requires storing timestamp client-side). Document choice in code comment.
3. **Save failures (API surface):** Change [saveDraftToServer](lib/create/api.ts) from `Promise<boolean>` to a result type such as `{ ok: true } | { ok: false; message: string; status?: number }`, parsing the response body with [readApiErrorMessage](lib/create/api.ts) so both legacy `{ error: string }` and CR-73 validation `{ error: { message } }` (and 413 `payload_too_large`) produce a useful `message`. Update [CreateFlowBackendSync](app/create/context/CreateFlowBackendSync.tsx) to branch on that result.
4. **Save failures (UX):** On `ok: false`, show toast/banner (include `message`); optionally retry with backoff.
5. **Tests:** Component test or Playwright scenario with sync flag on (may require test DB or route mocks).

**Acceptance criteria:**

- [ ] No silent data loss when server save fails.
- [ ] User understands when server draft replaced local state (if applicable).

**Files:** [lib/create/api.ts](lib/create/api.ts), [app/create/context/CreateFlowBackendSync.tsx](app/create/context/CreateFlowBackendSync.tsx), possibly [CreateFlowContext](app/create/context/CreateFlowContext.tsx), tests under `tests/`.

---

## Ticket 6 — Wire “Publish rule” from the create flow to `POST /api/rules`

**Depends on:** Tickets 2–4 (Ticket 5 optional).

**Goal:** Completing the flow persists a **PublishedRule** via existing [publishRule](lib/create/api.ts).

**Context:** [lib/create/api.ts](lib/create/api.ts) already wraps `POST /api/rules`. UI on [app/create/final-review/page.tsx](app/create/final-review/page.tsx) or [completed/page.tsx](app/create/completed/page.tsx) must call it with `{ title, summary?, document }` derived from `CreateFlowState`.

**Implementation:**

1. Map `useCreateFlow().state` → `title` / `summary` / `document` (document likely mirrors [CommunityRuleDocument](app/components/sections/CommunityRuleDocument/) shape or raw JSON).
2. Call `publishRule` on explicit user action (“Publish” / “Finalize”) or on transition to `completed` (product decision—prefer explicit button to avoid double-submit).
3. Handle **401**: redirect or modal to sign-in (Ticket 3).
4. Success: navigate to `completed` with rule id in query or state; optional confetti per design.

**Acceptance criteria:**

- [ ] Published row appears in Postgres (`PublishedRule`) and `GET /api/rules` lists it.
- [ ] User sees clear success/failure.

**Files:** relevant `app/create/*/page.tsx`, [lib/create/api.ts](lib/create/api.ts) if request shape changes, types from Ticket 2.

---

## Ticket 7 — Seed `RuleTemplate` data and document how to re-run

**Depends on:** none (API exists at [app/api/templates/route.ts](app/api/templates/route.ts)).

**Goal:** Curated templates exist in DB for recommendations (v1 = static curated list, no ML).

**Implementation:**

1. Add [Prisma seed](https://www.prisma.io/docs/guides/migrate/seed-database): `prisma/seed.ts` with `upsert` on `slug` for idempotent runs.
2. In [package.json](package.json), set `"prisma": { "seed": "tsx prisma/seed.ts" }` or `node --loader ts-node/esm` per your preference.
3. Seed 3–10 rows aligned with marketing copy today ([messages/en/components/ruleStack.json](messages/en/components/ruleStack.json) or home cards) — `title`, `category`, `description`, `body` JSON, `sortOrder`, `featured`.
4. Document: `npx prisma db seed` in [CONTRIBUTING.md](CONTRIBUTING.md).

**Acceptance criteria:**

- [ ] `GET /api/templates` returns non-empty `templates` after seed on empty DB.
- [ ] Re-running seed does not duplicate rows.

**Files:** `prisma/seed.ts`, [package.json](package.json), [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Ticket 8 — Load rule templates from the API in the UI

**Depends on:** Ticket 7.

**Goal:** Home or create entry surfaces use live template data instead of only static i18n JSON.

**Context:** [RuleStack.view.tsx](app/components/sections/RuleStack/RuleStack.view.tsx) and [app/create/[step]/page.tsx](app/create/[step]/page.tsx) placeholders reference future template work (CR-51–55).

**Implementation:**

1. Add a small client or server data fetch to `GET /api/templates` (RSC `fetch` with cache tags, or client `useEffect` with loading skeleton—match existing data-fetch patterns in the app).
2. Map API rows to existing card components; keep i18n for chrome strings (“See all templates”).
3. Empty state: if API returns `[]`, fall back to static copy or hide section per design.

**Acceptance criteria:**

- [ ] Changing a template row in Prisma Studio reflects after refresh (or revalidate).
- [ ] No layout shift regression on LCP-critical pages (use skeletons).

**Files:** [app/components/sections/RuleStack/](app/components/sections/RuleStack/), [app/create/[step]/page.tsx](app/create/[step]/page.tsx) or related, possibly new `lib/templates/fetchTemplates.ts`.

---

## Ticket 9 — Persist web vitals outside `.next` (prefer external RUM)

**Depends on:** none (orthogonal).

**Server / admin:** **Not required** to implement. **Relevant** when production is **multi-instance** or **read-only filesystem**; external tools may need **vendor API keys** in env.

**Goal:** [app/api/web-vitals/route.ts](app/api/web-vitals/route.ts) stops relying on ephemeral files under `.next/web-vitals` in production.

**Context:** Multi-instance / Docker loses file-based metrics. [docs/backend-roadmap.md](backend-roadmap.md) §7: **default** is **external** analytics or log drain—keep product Postgres for product data.

**Implementation (pick one — prefer A or B first):**

- **A (preferred):** Integrate **external RUM / logging** (host metrics, Vercel Web Analytics, OpenTelemetry export, Datadog, etc.); stop or thin local aggregation; `app/(admin)/monitor/page.tsx` links out or shows reduced scope.
- **B:** Forward events from the route to a **log drain** or APM; trim custom dashboard if redundant.
- **C (fallback only):** New Prisma model `WebVitalEvent` + migrate + read path in monitor—**only** if ops explicitly chooses a single-store tradeoff (document why).

**Acceptance criteria:**

- [ ] Production with read-only filesystem does not break vitals collection path.
- [ ] Monitor page still useful or intentionally replaced with a doc link.

**Files:** [app/api/web-vitals/route.ts](app/api/web-vitals/route.ts), [app/(admin)/monitor/](<app/(admin)/monitor/page.tsx>) (adjust paths as needed), optionally `prisma/schema.prisma` **only if** option C.

---

## Ticket 10 — Public rule detail (optional product scope)

**Depends on:** Ticket 6.

**Goal:** Shareable link for a published rule.

**Note:** Complements **Ticket 15** profile cards: users can open a **public** detail URL from a rule listed on their dashboard; the profile page does **not** replace this ticket.

**Implementation:**

1. Add `GET /api/rules/[id]/route.ts` returning `{ rule }` or 404 (public read; no secrets).
2. Add `app/(marketing)/rules/[id]/page.tsx` (or under `create` if private) rendering `document` JSON with existing document components.
3. Consider soft-delete flag later; out of scope unless product requires hide.

**Acceptance criteria:**

- [ ] UUID/cuid from Ticket 6 opens a readable page for anonymous users.
- [ ] Invalid id returns 404.

**Files:** new route handler, new page, optional layout.

**Linear:** [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional). **Related in Linear:** [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile) (Ticket 15 — profile cards linking to public detail).

---

## Ticket 11 — CI: database migration smoke (optional, runner-dependent)

**Depends on:** existing [`.gitea/workflows/ci.yaml`](.gitea/workflows/ci.yaml).

**Server / admin:** **Not production server**—but you may need whoever runs **Gitea/self-hosted runners** to allow **Postgres in CI** (Docker service / sidecar) or to accept a **manual migrate** process documented instead.

**Goal:** Catch broken SQL migrations before merge.

**Context:** Lint job already runs `prisma validate` with a dummy `DATABASE_URL`. **Migrate** needs a real Postgres reachable from the runner.

**Implementation:**

1. If Gitea runners support **Docker sidecar** or **postgres service**, add a job: start Postgres, set `DATABASE_URL`, `npx prisma migrate deploy`, then run a minimal test that hits `/api/health` with DB connected (may require `next build` + short `next start` + curl).
2. If **macOS self-hosted** runners cannot run service containers easily, document in CONTRIBUTING: “run `migrate deploy` against staging before prod” and keep validate-only in CI.

**Acceptance criteria:**

- [ ] Broken migration fails CI **or** documented alternative process is explicit.

**Files:** [.gitea/workflows/ci.yaml](.gitea/workflows/ci.yaml), [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Ticket 12 — Staging / production runbook (operator checklist)

**Depends on:** Tickets 1–8 complete enough to deploy a vertical slice.

**Server / admin:** **This is the main ticket where you need the admin.** You draft the runbook; **admin fills in real hostnames, DB endpoint, SMTP, backup tooling, and who runs `migrate deploy`.** Without their input, you cannot complete production-ready deploy steps.

**Goal:** Single doc for admin: env vars, TLS, DB backups, migrations, Docker, SMTP, health checks.

**Implementation:**

1. Add `docs/ops-backend-deploy.md` (or similar) with numbered steps:
   - Required env: `DATABASE_URL`, `SESSION_SECRET`, `SMTP_URL`, `SMTP_FROM`, optional `NEXT_PUBLIC_ENABLE_BACKEND_SYNC`.
   - `docker compose` vs `Dockerfile` deploy; `prisma migrate deploy` before traffic.
   - Reverse proxy: `GET /api/health` for LB health.
   - Backups and restore drill for Postgres.
   - SMTP DNS (SPF/DKIM).
2. Cross-link [docs/backend-roadmap.md](docs/backend-roadmap.md) §11 (environments) and §8 (migrations policy); note **never rewrite applied migrations** and where application logs go.

**Acceptance criteria:**

- [ ] Someone who did not write the code can deploy and roll back migrations with only the doc.

**Files:** new `docs/ops-backend-deploy.md`.

---

## Ticket 13 — API error contract + structured logging

**Depends on:** Ticket 2 (validation work defines many 400s).

**Server / admin:** None.

**Goal:** Standardize JSON errors and lightweight observability per [docs/backend-roadmap.md](backend-roadmap.md) §7.

**Implementation:**

1. Document target shape `{ error: { code, message }, details? }` and map validation failures into `details` where useful.
2. Add a small **route helper** or wrapper: generate or forward **`x-request-id`**, log errors with `lib/logger` + id.
3. Migrate high-traffic or auth routes first; follow-up pass for remaining `app/api/*`.

**Acceptance criteria:**

- [ ] At least auth + draft + rules routes return the agreed shape for new code paths.
- [ ] Errors in logs include request id when available.

**Files:** `lib/server/` (new helper), selected `app/api/**/route.ts`, optional tests.

**Linear:** [CR-84](https://linear.app/community-rule/issue/CR-84/backend-api-error-contract-request-id-logging) (blocked by **CR-73**).

---

## Ticket 14 — Custom session lifecycle (rotation, cleanup, policy)

**Depends on:** Ticket 4 (session visible in create flow).

**Server / admin:** None for implementation; production cron may need admin if cleanup runs as a job.

**Goal:** Make custom Prisma sessions maintainable: rotation, invalidation policy, expired-row cleanup—per [docs/backend-roadmap.md](backend-roadmap.md) §4–5.

**Implementation:**

1. **Policy:** On **new sign-in** (magic-link verification / session creation), decide whether to **delete other `Session` rows** for that user (single active session) or allow multiple devices (document choice).
2. **Rotation (optional v1.1):** Issue new token on privilege-sensitive actions if product requires.
3. **Cleanup:** Delete or mark expired sessions (scheduled job, or prune on read with occasional batch).
4. **Docs:** Add short ADR or comment block in `lib/server/session.ts`.

**Acceptance criteria:**

- [ ] Documented behavior matches implementation.
- [ ] Expired sessions do not accumulate unbounded in production over months.

**Files:** [lib/server/session.ts](lib/server/session.ts), [app/api/auth/magic-link/verify/route.ts](app/api/auth/magic-link/verify/route.ts), optional `prisma` migration if new columns (unlikely).

**Linear:** [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy) (blocked by **CR-75**).

---

## Ticket 15 — Profile dashboard + account (Figma profile)

**Depends on:** Ticket 3 (auth), **Ticket 4** (session in UI), **Ticket 6** (publish so users have rules to list). Soft optional: Tickets 7–8 for “create from template” CTA parity.

**Goal:** Signed-in **profile** experience matching [Figma — Profile](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22143-900069): **Your CommunityRules** (list **own** published rules), **duplicate** / **delete** per rule, CTAs into create flow (custom + from template), **logout** (existing API), **delete account** (policy + API + confirmation UX).

**Out of scope for this ticket**

- **Change your account email** (shown in Figma options): **deferred**—no backend in this slice. Product may **hide** the row, show **“Coming soon,”** or backlog until a **future ticket** (verified email change, conflicts, sessions).
- **`displayName` / new `User` fields:** not required—use **static** welcome copy, generic greeting, or **email local-part in UI only** until a later schema/product decision.

**Context:** Today `GET /api/rules` is a **public** list of all published rules; there is no authenticated **my rules** endpoint, no owner **DELETE** / **duplicate**, and no **delete user** API. See [docs/backend-roadmap.md](backend-roadmap.md) §1 “profile / account — not implemented yet” and §6.

**Implementation (sketch):**

1. **API:** Authenticated route(s) to list rules **where `userId` = session user**; owner-only `DELETE` (and duplicate via `POST` reuse or dedicated handler); `DELETE` user (or equivalent) with explicit Prisma policy—cascade vs orphan `PublishedRule` (today `onDelete: SetNull` on user) and cleanup of `Session` / `RuleDraft`.
2. **UI:** Marketing route (e.g. `/profile`), rule cards (title, summary, artwork from `document` as needed), **IN PROGRESS** badge per roadmap §4 (derive from JSON / future `status` / UI-only).
3. **Nav:** Link from header when signed in if design requires.
4. **i18n** for strings; legal/product review for **delete account** copy.

**Acceptance criteria:**

- [ ] Signed-in user sees **only their** published rules (not the global public list).
- [ ] Duplicate and delete actions work for **owner** only; errors are clear.
- [ ] Logout still works from profile context.
- [ ] Delete account flow matches agreed policy and is confirmed in UI.
- [ ] No verified **email change** shipped in this ticket; Figma row handled per product (hide/disabled/backlog).

**Files:** new `app/` routes and components, `app/api/rules/...` (or new segment handlers), [lib/create/api.ts](lib/create/api.ts) as needed, [prisma/schema.prisma](prisma/schema.prisma) only if account-delete policy requires schema tweaks, [messages/en/](messages/en/) for copy.

**Linear:** [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile) (**Backlog**). **Blocked by** **CR-75** + **CR-77**. **Related:** [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional) (public rule detail for deep links from profile cards). **Not** part of the sequential **CR-72 → CR-83** chain—parallel after publish + session, similar to CR-84/CR-85.

---

## Summary order

| Order | Ticket | Short name                        |
| ----: | ------ | --------------------------------- |
|     1 | 1      | Refresh backend-roadmap           |
|     2 | 2      | CreateFlowState + API validation  |
|     3 | 3      | Magic-link sign-in UI             |
|     4 | 4      | Create flow session UI            |
|     5 | 5      | Draft sync hardening              |
|     6 | 6      | Publish wiring                    |
|     7 | 7      | Template seed                     |
|     8 | 8      | Templates in UI                   |
|     9 | 9      | Web vitals persistence            |
|    10 | 10     | Public rule detail (optional)     |
|    11 | 11     | CI migrate smoke (optional)       |
|    12 | 12     | Ops runbook                       |
|    13 | 13     | API errors + request-id logging   |
|    14 | 14     | Session lifecycle + cleanup       |
|    15 | 15     | Profile + account (Figma profile) |

Tickets **10–11** can be deferred without blocking the core “auth + drafts + publish + templates” vertical slice. **Tickets 13–14** are parallel to that chain (blocked by **CR-73** and **CR-75** respectively), not sequential after CR-83. **Ticket 15** is also **parallel** (blocked by auth + session + publish—not by the ops runbook); Linear: **CR-86**.

---

## Linear (Community-rule team)

**Main chain:** **CR-72 → CR-83** (each blocks the next). **Parallel:** **CR-84** (blocked by CR-73), **CR-85** (blocked by CR-75), **CR-86** / Ticket 15 (blocked by CR-75 + CR-77, not in the CR-72–83 sequence).

| Doc ticket | Linear                                                                                                                      | Title (short)                          |
| ---------: | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
|          1 | [CR-72](https://linear.app/community-rule/issue/CR-72/backend-align-docsbackend-roadmapmd-with-current-codebase)            | Align backend-roadmap                  |
|          2 | [CR-73](https://linear.app/community-rule/issue/CR-73/backend-formalize-createflowstate-validate-draftpublish-api-payloads) | CreateFlowState + API validation       |
|          3 | [CR-74](https://linear.app/community-rule/issue/CR-74/backend-email-otp-sign-in-ui-existing-apis)                           | Magic-link sign-in UI + CR-75 prep     |
|          4 | [CR-75](https://linear.app/community-rule/issue/CR-75/backend-create-flow-session-ui-sign-out)                              | Create flow session UI                 |
|          5 | [CR-76](https://linear.app/community-rule/issue/CR-76/backend-harden-server-draft-sync-createflowbackendsync)               | Draft sync hardening                   |
|          6 | [CR-77](https://linear.app/community-rule/issue/CR-77/backend-wire-publish-rule-from-create-flow-post-apirules)             | Publish wiring                         |
|          7 | [CR-78](https://linear.app/community-rule/issue/CR-78/backend-prisma-seed-ruletemplate-document)                            | Template seed                          |
|          8 | [CR-79](https://linear.app/community-rule/issue/CR-79/backend-load-rule-templates-from-get-apitemplates-in-ui)              | Templates in UI                        |
|          9 | [CR-80](https://linear.app/community-rule/issue/CR-80/backend-persist-web-vitals-outside-next-db-or-external-rum)           | Web vitals (prefer external)           |
|         10 | [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional)              | Public rule detail (optional)          |
|         11 | [CR-82](https://linear.app/community-rule/issue/CR-82/backend-ci-postgres-migration-smoke-optional)                         | CI migrate smoke (optional)            |
|         12 | [CR-83](https://linear.app/community-rule/issue/CR-83/backend-stagingproduction-runbook-admin-handoff-docsops-backend)      | Ops runbook / admin handoff            |
|         13 | [CR-84](https://linear.app/community-rule/issue/CR-84/backend-api-error-contract-request-id-logging)                        | API errors + request-id logging        |
|         14 | [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy)         | Session lifecycle + cleanup            |
|         15 | [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)                      | Profile + account (Figma 22143:900069) |

---

## Updating Linear issue CR-74 (manual)

Keep **[CR-74](https://linear.app/community-rule/issue/CR-74/backend-email-otp-sign-in-ui-existing-apis)** aligned with **Ticket 3** (Linear UI or MCP). If Linear still describes an old sign-in approach, update it so it matches **Ticket 3** above (magic link only):

- **Title (examples):** `Magic-link sign-in UI + APIs; prep for CR-75` or `Email magic-link sign-in (UI + routes) — residuals for create-flow auth`.
- **Description — Shipped:** Magic link: `POST /api/auth/magic-link/request`, `GET /api/auth/magic-link/verify`, `MagicLinkToken`, `/login` + modal UI, `requestMagicLink`, session cookie.
- **Description — Residual / before CR-75:** Use the checklist under **Residual / before CR-75** (Ticket 3 above). Mark **done** for items 1, 2, and 4 (repo docs). Keep **open** until verified: **(3)** staging/prod `Host` / link URLs on your real hosts.
- **Comment (optional):** Start **CR-75** only after residuals are done **or** the team defers specific lines (e.g. CONTRIBUTING in a separate PR).

**Status:** CR-74 can stay **Done** with a **child issue** (e.g. “CR-74 follow-ups: auth docs + smoke”) if you prefer not to reopen the parent.
