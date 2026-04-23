# Backend work — linear tickets

Copy each block into Linear (or your tracker) as a separate issue, **in order**. Earlier tickets are prerequisites for later ones.

**Foundation already in the repo (no ticket needed unless you are onboarding a greenfield clone):** Prisma schema ([prisma/schema.prisma](prisma/schema.prisma)), migrations, `lib/server/*`, Route Handlers under `app/api/*`, [docker-compose.yml](docker-compose.yml), [Dockerfile](Dockerfile), [CONTRIBUTING.md](CONTRIBUTING.md), [`.env.example`](.env.example), [lib/create/api.ts](lib/create/api.ts), create-flow draft **PUT** via `useCreateFlowExit` / `PostLoginDraftTransfer` when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC`.

### Review sync (relevant feedback only)

A backend review was merged into **[docs/backend-roadmap.md](backend-roadmap.md)** after checking the repo. **Incorporated:** custom session lifecycle follow-ups (not a mandate to adopt Auth.js/Lucia), **passwordless email (magic-link request)** rate limits in-memory until multi-instance + shared store, `RuleDraft` already has `updatedAt` (no migration to add it), **prefer external web vitals** over product Postgres by default, API error shape + request-id observability targets, **authorization v1** aligned with `app/api/rules`, Prisma **never edit applied migrations**, **profile / my rules / account** scope from Figma profile (`22143:900069`) as **Ticket 15** (change email deferred). **Excluded:** requiring NextAuth/Lucia; “add `updatedAt` on drafts”; hard ban on DB for vitals (softened to default external). **Parallel Linear issues:** **CR-84** (API errors — **Done**), **CR-85** (session lifecycle — **Done**)—see **Linear** table at the end of this doc.

### Audit note (Linear CR-72+ vs repo, 2026-04)

- **Done in Linear and shipped:** **CR-72–CR-76**, **CR-77** (publish from create flow), **CR-78** (template seed), **CR-79**, **CR-88**, **CR-89**. The **CR-72 → CR-83** numbering is the original **sequential plan**, not current blocking order; the **core product vertical** through publish + templates is effectively complete in-repo.
- **Backlog (still open):** **CR-80** (web vitals — file-based route remains), **CR-81** (public rule detail — no `GET /api/rules/[id]` or marketing detail page yet), **CR-82** (CI migrate smoke), **CR-86** (profile + account + draft resume — UI mostly placeholder), **CR-90** / **CR-91**, **CR-93** (template grid facets on marketing). **CR-84 Done** — canonical error contract `{ error: { code, message }, details? }` and `x-request-id` propagation shipped via `lib/server/{responses,requestId,apiRoute}.ts`; auth + drafts + rules routes migrated, remaining `app/api/*` are a follow-up pass. **CR-85 Done** — multi-device session policy + lazy expired-row cleanup (per-user prune on every sign-in plus ~5% global sweep, no cron); ADR comment block in [`lib/server/session.ts`](../../lib/server/session.ts).
- **CR-83 Done (admin handoff scope):** [`docs/guides/ops-backend-deploy.md`](ops-backend-deploy.md) shipped as the **admin handoff sheet** (access, env vars, platform settings, open decisions). The full deploy runbook is intentionally split out — see the new follow-up tickets in [Ticket 12 / CR-83 follow-ups](#follow-up-tickets-filed-under-cr-83) below.
- **CR-86** is **no longer blocked** by publish — **CR-77** is **Done**; profile work is gated by **implementation**, not waiting on publish wiring.
- **Not in this ticket list** but called out in **[docs/backend-roadmap.md](backend-roadmap.md):** shared **rate-limit store** (e.g. Redis) before multi-instance; **`GET /api/create-flow/methods`** exists for facet scoring (Ticket 16 / CR-88) but is not duplicated as a separate doc ticket.

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

1. Rewrite **§1 Where we are** to list: Prisma + Postgres, existing `app/api/*` routes, create-flow persistence (anonymous `localStorage` + optional server draft PUT when sync is on), web-vitals still file-based.
2. In **§9 Build order** (build steps were renumbered from old §5), mark what is **operator/manual**, what is **already shipped in the repo**, and what is **still product/frontend** (publish wiring, templates in UI, etc.).
3. Add **HTTP API (implemented in repo)** — table mirroring [CONTRIBUTING.md](CONTRIBUTING.md), plus note for `/api/web-vitals`.

**Acceptance criteria:**

- [x] A new contributor reading only the roadmap does not think the backend is unbuilt.
- [x] **§13 Optional later** (old §9) unchanged in intent — optional Redis, session-library spike, draft versioning, standalone API, OpenAPI, fourth env.

**Status:** [CR-72](https://linear.app/community-rule/issue/CR-72/backend-align-docsbackend-roadmapmd-with-current-codebase) **Done**.

**Files:** [docs/backend-roadmap.md](docs/backend-roadmap.md) only.

---

## Ticket 2 — Formalize `CreateFlowState` and validate API payloads

**Depends on:** Ticket 1 (optional but keeps docs honest).

**Goal:** Replace the open `[key: string]: unknown` shape in [app/(app)/create/types.ts](app/(app)/create/types.ts) with real fields (or nested objects) agreed with design/product, and validate JSON on the server for drafts and publish.

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

**Files:** [app/(app)/create/types.ts](app/(app)/create/types.ts), [app/api/drafts/me/route.ts](app/api/drafts/me/route.ts), [app/api/rules/route.ts](app/api/rules/route.ts), [lib/server/validation/](lib/server/validation/) (Zod + plain-JSON checks), [package.json](package.json) (`zod`).

**Note:** Repo-wide **API error JSON shape** and **request-id logging** are **Ticket 13 / CR-84**—coordinate 400 response bodies with that issue so validation errors match the agreed `{ error: { code, message } }` pattern.

---

## Ticket 3 — Email magic-link sign-in UI (end-to-end with existing APIs)

**Depends on:** Ticket 2 (soft dependency: types help name fields you might store post-login; can start in parallel if needed).

**Server / admin:** **Not required** to build and test (Mailhog or verify URL in server logs locally). **Required** when **magic-link email** must work on **staging/production**: admin provides **SMTP** + usually **DNS (SPF/DKIM)** and sets env on the host (see top table). **Residual:** links in email use the app origin—reverse proxy / `Host` must match the URL users open.

**Goal:** Let a user request a **sign-in link** and complete sign-in in the browser using existing endpoints.

**Context:** APIs: `POST /api/auth/magic-link/request`, `GET /api/auth/magic-link/verify`, `GET /api/auth/session`, `POST /api/auth/logout`. Prisma: `MagicLinkToken`. Client: [`requestMagicLink`](lib/create/api.ts).

**Implementation (shipped):**

1. **`/login`** route **and** **header modal** — primary **Log in** entry is [`AuthModalProvider`](app/contexts/AuthModalContext.tsx) + [app/components/modals/Login/](app/components/modals/Login/); [app/(app)/login/page.tsx](app/(app)/login/page.tsx) (solid shell, `usePortal={false}`) remains for verify **error** redirects and bookmarks.
2. Flow: email → “Send link” → user opens link (email, Mailhog, or dev log) → `GET /api/auth/magic-link/verify?token=...` sets session and redirects; optional `next` for post-login path.
3. Surface API errors: invalid email, 429 `retryAfterMs`, expired/invalid token, network failure (accessible copy).
4. Ensure `fetch` calls use `credentials: "include"` where needed (see [lib/create/api.ts](lib/create/api.ts)).
5. **Dev:** without `SMTP_URL`, verify URL is logged; with Mailhog, use [docker-compose.yml](docker-compose.yml) and `SMTP_URL=smtp://localhost:1025`.
6. **Marketing header:** When signed in (`fetchAuthSession`), **Log in** becomes **Profile** linking to [`/profile`](app/(app)/profile/page.tsx) (placeholder until Ticket 15 / CR-86). Implemented in [TopNavWithPathname.tsx](app/components/navigation/TopNav/TopNavWithPathname.tsx) + [TopNav.container.tsx](app/components/navigation/TopNav/TopNav.container.tsx).

**Acceptance criteria:**

- [x] Happy path: user completes magic-link verify and `GET /api/auth/session` returns `user` in the same browser session.
- [x] Keyboard + screen-reader friendly forms (labels, errors associated with fields).
- [x] No secrets in client bundle.
- [x] Header shows **Profile** → placeholder `/profile` when session present; **Log in** when anonymous (opens modal, not only `/login`).

**Status:** [CR-74](https://linear.app/community-rule/issue/CR-74/backend-magic-link-sign-in-ui-apis-ticket-3-cr-75-done) **Done** for shipped UI/APIs. **Residual checklist** below: repo doc items are **done**; use Linear (CR-74 or child issue) to track **per-environment** staging URL checks.

**Files:** [app/(app)/login/](app/(app)/login/), [app/(app)/profile/](app/(app)/profile/) (placeholder), [app/components/modals/Login/](app/components/modals/Login/), [messages/en/pages/login.json](messages/en/pages/login.json), [messages/en/pages/profile.json](messages/en/pages/profile.json), [messages/en/components/header.json](messages/en/components/header.json), [app/components/navigation/TopNav/TopNav.container.tsx](app/components/navigation/TopNav/TopNav.container.tsx), [app/components/navigation/TopNav/TopNavWithPathname.tsx](app/components/navigation/TopNav/TopNavWithPathname.tsx), [lib/create/api.ts](lib/create/api.ts), [app/api/auth/magic-link/request/route.ts](app/api/auth/magic-link/request/route.ts), [app/api/auth/magic-link/verify/route.ts](app/api/auth/magic-link/verify/route.ts), [prisma/schema.prisma](prisma/schema.prisma) (`MagicLinkToken`), [lib/server/mail.ts](lib/server/mail.ts). Onboarding: [CONTRIBUTING.md](CONTRIBUTING.md), [`.env.example`](.env.example).

### Residual / before CR-75 (create-flow session UI)

**Intent:** [Ticket 4](#ticket-4--session-affordances-in-the-create-flow-signed-in-state--sign-out) (**CR-75**) needs a reliable signed-in story across marketing + `/create`. Below: what is **done in repo** vs what to **verify per environment**.

1. **Contributor / onboarding** — **Done:** [CONTRIBUTING.md](CONTRIBUTING.md) API table and sign-in section describe **magic-link** request/verify, dev log URL, and Mailhog. [`.env.example`](.env.example) comments match.
2. **Smoke checklist** — **Done:** **Email magic link (sign-in)** in [CONTRIBUTING.md](CONTRIBUTING.md); build-order §9 in [docs/backend-roadmap.md](backend-roadmap.md) includes the same happy path + session check.
3. **Staging / production URLs** — **Verify on each deploy:** emails use `request.nextUrl.origin`; confirm reverse proxy and **`Host`** so links in mail match the public site (CONTRIBUTING + roadmap §9 spell this out).
4. **Docs alignment** — **Done:** [docs/backend-roadmap.md](backend-roadmap.md) and this doc treat magic link as primary; CR-72/CR-73 schema work is not a blocker for CR-75.

---

## Ticket 4 — Session affordances in the create flow (signed-in state + sign out)

**Depends on:** Ticket 3.

**Goal:** In `/create/*`, **Exit** / **Save & Exit** (from `select` onward for signed-in users) is the only top-nav chrome—no email or Sign out in the create shell. **Anonymous:** progress in **`create-flow-anonymous`** localStorage; **Exit** opens the global **Save your progress?** auth modal (magic link + `?syncDraft=1` return); after verify, [`PostLoginDraftTransfer`](app/(app)/create/PostLoginDraftTransfer.tsx) **PUT**s to `/api/drafts/me` when sync is on. **Signed-in:** **Save & Exit** **PUT**s via [`useCreateFlowExit`](app/(app)/create/hooks/useCreateFlowExit.ts) when **`NEXT_PUBLIC_ENABLE_BACKEND_SYNC`**. **Sign out** for QA lives on **[ProfilePageClient](app/(app)/profile/ProfilePageClient.tsx)**. Site **Log in** opens the same modal overlay ([`AuthModalProvider`](app/contexts/AuthModalContext.tsx)), not only `/login`.

**Context:** **`saveDraftOnExit`** is gated on **session + step ≥ select**. Layout **`fetchAuthSession`** drives anonymous vs authenticated persistence and exit behavior. **Save & Exit** styling: Figma [20907:212637](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=20907-212637). Save-progress exit modal: Figma `22398:23743`.

**Implementation (repo):**

1. [app/(app)/create/layout.tsx](app/(app)/create/layout.tsx): session + `enableAnonymousPersistence`; anonymous exit → `openLogin({ variant: 'saveProgress', nextPath })`; signed-in exit → `useCreateFlowExit`.
2. [CreateFlowTopNav](app/components/utility/CreateFlowTopNav/): i18n [`messages/en/create/topNav.json`](messages/en/create/topNav.json); logo + Share/Export/Edit (completed) + Exit/Save & Exit only.
3. [useCreateFlowExit](app/(app)/create/hooks/useCreateFlowExit.ts): `saveDraftToServer` when sync + signed in; `clearState` + home.
4. [CreateFlowContext](app/(app)/create/context/CreateFlowContext.tsx): optional anonymous localStorage mirror via `enableAnonymousPersistence`.
5. **QA:** [ProfilePageClient](app/(app)/profile/ProfilePageClient.tsx) Sign out when session present.

**Acceptance criteria:**

- [x] Completed step still works; **Save & Exit** gating uses session + step (not conflated with `completed` only).
- [x] Signed in + sync: Save & Exit persists server-side; anonymous: localStorage + exit modal + transfer after magic link. Sign out on profile clears session. _(Re-verify on staging/prod as needed.)_

**Files:** [app/(app)/create/layout.tsx](app/(app)/create/layout.tsx), [app/(app)/create/hooks/useCreateFlowExit.ts](app/(app)/create/hooks/useCreateFlowExit.ts), [app/components/utility/CreateFlowTopNav/](app/components/utility/CreateFlowTopNav/), [app/(app)/create/context/CreateFlowContext.tsx](app/(app)/create/context/CreateFlowContext.tsx), [messages/en/create/topNav.json](messages/en/create/topNav.json), [app/(app)/profile/ProfilePageClient.tsx](app/(app)/profile/ProfilePageClient.tsx).

---

## Ticket 5 — Harden server draft sync (UX + edge cases)

**Depends on:** Tickets 2–4.

**Goal:** Server draft **PUT** path is production-grade when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` (Save & Exit, post-login transfer from anonymous draft).

**Context:** Auto-hydrate / debounced autosave component was removed; signed-in resume uses `GET /api/drafts/me` in the create layout.

**Implementation:**

1. **Hydration:** **Done:** [SignedInDraftHydration](app/(app)/create/SignedInDraftHydration.tsx) + [messages/en/create/draftHydration.json](messages/en/create/draftHydration.json); skips `?syncDraft=1` / transfer-pending (PostLogin owns that). Wired in [layout](app/(app)/create/layout.tsx).
2. **Conflict:** **Done:** If `create-flow-anonymous` and server draft are both non-empty, `window.confirm` (OK = account draft, Cancel = browser copy); documented on [anonymousDraftStorage](app/(app)/create/utils/anonymousDraftStorage.ts). Newer-`updatedAt` client compare remains optional.
3. **Save failures (API surface):** **Done (CR-76):** [saveDraftToServer](lib/create/api.ts) returns `SaveDraftResult` with parsed API `message`; wired in [useCreateFlowExit](app/(app)/create/hooks/useCreateFlowExit.ts) and [PostLoginDraftTransfer](app/(app)/create/PostLoginDraftTransfer.tsx).
4. **Save failures (UX):** **Done (CR-76):** Dismissible banner with server `message` (no second confirm to leave); post-login transfer shows reason; unit tests in `tests/unit/saveDraftToServer.test.ts`. Retry/backoff remains optional.
5. **Tests:** `saveDraftToServer` unit tests; [draftHydrationUtils](lib/create/draftHydrationUtils.ts) unit tests. Playwright against Next standalone + route mocks for `/api/auth/session` was flaky here; cover hydration with **manual QA** (signed in + sync on + server draft) or add a future E2E with a dedicated auth fixture.

**Acceptance criteria:**

- [x] No silent data loss when server save fails (user sees reason in banner; stays in flow to retry Save & Exit or leave via e.g. logo).
- [x] User understands when server draft replaced local state (if applicable) — conflict `window.confirm` when both browser anonymous draft and account draft exist; otherwise silent apply of single source.

**Files:** [lib/create/api.ts](lib/create/api.ts), [app/(app)/create/hooks/useCreateFlowExit.ts](app/(app)/create/hooks/useCreateFlowExit.ts), [app/(app)/create/PostLoginDraftTransfer.tsx](app/(app)/create/PostLoginDraftTransfer.tsx), [app/(app)/create/SignedInDraftHydration.tsx](app/(app)/create/SignedInDraftHydration.tsx), [app/(app)/create/layout.tsx](app/(app)/create/layout.tsx), [CreateFlowContext](app/(app)/create/context/CreateFlowContext.tsx), tests under `tests/`.

---

## Ticket 6 — Wire “Publish rule” from the create flow to `POST /api/rules`

**Depends on:** Tickets 2–4 (Ticket 5 optional).

**Goal:** Completing the flow persists a **PublishedRule** via existing [publishRule](lib/create/api.ts).

**Context:** [lib/create/api.ts](lib/create/api.ts) wraps `POST /api/rules` with Zod-validated body (Ticket 2). Finalize flows through [useCreateFlowFinalize](app/(app)/create/hooks/useCreateFlowFinalize.ts) from [CreateFlowLayoutClient](app/(app)/create/CreateFlowLayoutClient.tsx) (`final-review` → `publishRule` → `/create/completed`).

**Implementation (shipped):**

1. Map `CreateFlowState` → `title` / `summary` / `document` via [buildPublishPayload](lib/create/buildPublishPayload.ts) (and related builders).
2. Call `publishRule` on explicit **Finalize** from `final-review` ([useCreateFlowFinalize](app/(app)/create/hooks/useCreateFlowFinalize.ts)).
3. **401** → `openLogin` with return path (Ticket 3 / `AuthModalProvider`).
4. Success: navigate to `completed` with rule id in query string.

**Acceptance criteria:**

- [x] Published row appears in Postgres (`PublishedRule`) and `GET /api/rules` lists it.
- [x] User sees clear success/failure (banner / flow state; see finalize hook).

**Files:** [app/(app)/create/hooks/useCreateFlowFinalize.ts](app/(app)/create/hooks/useCreateFlowFinalize.ts), [CreateFlowLayoutClient.tsx](app/(app)/create/CreateFlowLayoutClient.tsx), [app/api/rules/route.ts](app/api/rules/route.ts), [lib/create/api.ts](lib/create/api.ts), [lib/create/buildPublishPayload.ts](lib/create/buildPublishPayload.ts).

**Status:** [CR-77](https://linear.app/community-rule/issue/CR-77/backend-wire-publish-rule-from-create-flow-post-apirules) **Done**.

---

## Ticket 7 — Seed `RuleTemplate` data and document how to re-run

**Depends on:** none (API exists at [app/api/templates/route.ts](app/api/templates/route.ts)).

**Goal:** Curated templates exist in DB for recommendations (v1 = static curated list, no ML).

**Not in v1 (this ticket):** **Facet-based method/template intelligence** beyond a flat curated list — that work is **Ticket 16 / [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-facet-data-seed-and-apis-no)** (facet data + APIs + wizard method ranking). **Template marketing grids** ranked by user facets are **[CR-93](https://linear.app/community-rule/issue/CR-93/product-rank-template-cards-by-community-facets-reuse-get-apitemplates)** (product/UI follow-up).

**Implementation:**

1. Add [Prisma seed](https://www.prisma.io/docs/guides/migrate/seed-database): `prisma/seed.ts` with `upsert` on `slug` for idempotent runs.
2. In [package.json](package.json), set `"prisma": { "seed": "tsx prisma/seed.ts" }` or `node --loader ts-node/esm` per your preference.
3. Seed 3–10 rows aligned with marketing copy today ([messages/en/components/ruleStack.json](messages/en/components/ruleStack.json) or home cards) — `title`, `category`, `description`, `body` JSON, `sortOrder`, `featured`.
4. Document: `npx prisma db seed` in [CONTRIBUTING.md](CONTRIBUTING.md).

**Acceptance criteria:**

- [x] `GET /api/templates` returns non-empty `templates` after seed on empty DB.
- [x] Re-running seed does not duplicate rows.

**Files:** `prisma/seed.ts`, [package.json](package.json), [CONTRIBUTING.md](CONTRIBUTING.md).

**Status:** [CR-78](https://linear.app/community-rule/issue/CR-78/backend-prisma-seed-ruletemplate-document) **Done**.

---

## Ticket 8 — Load rule templates from the API in the UI

**Depends on:** Ticket 7.

**Goal:** Home or create entry surfaces use live template data instead of only static i18n JSON.

**Context:** [RuleStack.view.tsx](app/components/sections/RuleStack/RuleStack.view.tsx) renders cards from API-shaped grid entries. The custom wizard uses [`app/(app)/create/[screenId]/page.tsx`](app/(app)/create/[screenId]/page.tsx) and [`docs/create-flow.md`](create-flow.md) (**Ticket 17**).

**Implementation (shipped):**

1. **Server-first paint:** [MarketingRuleStackSection](app/(marketing)/_components/MarketingRuleStackSection.tsx) loads rows via `listRuleTemplatesFromDb` and passes `initialGridEntries` into [RuleStack.container.tsx](app/components/sections/RuleStack/RuleStack.container.tsx) (avoids client fetch on LCP-critical home).
2. **Client fetch:** [lib/create/fetchTemplates.ts](lib/create/fetchTemplates.ts) when `initialGridEntries` is not provided (`GET /api/templates`, credentials, abort); catalog fallback on error/empty.
3. **Templates index:** [app/(marketing)/templates/page.tsx](app/(marketing)/templates/page.tsx) server-loads the full grid for first paint.
4. **Empty / error:** Fallback presentation via [templateGridPresentation.ts](lib/templates/templateGridPresentation.ts) + catalog slugs.

**Acceptance criteria:**

- [x] Changing a template row in the DB reflects after refresh (SSR path) or client refetch where the client path is used.
- [x] No layout shift regression on LCP-critical pages: dynamic `RuleStack` loading shell + server-provided `initialGridEntries` on home.

**Files:** [app/components/sections/RuleStack/](app/components/sections/RuleStack/), [app/(marketing)/_components/MarketingRuleStackSection.tsx](app/(marketing)/_components/MarketingRuleStackSection.tsx), [app/(marketing)/templates/](app/(marketing)/templates/), [lib/create/fetchTemplates.ts](lib/create/fetchTemplates.ts), [lib/templates/templateGridPresentation.ts](lib/templates/templateGridPresentation.ts).

**Follow-up:** **[CR-93](https://linear.app/community-rule/issue/CR-93/product-rank-template-cards-by-community-facets-reuse-get-apitemplates)** — rank marketing template cards by community facets (API already supports `facet.*`; UI wiring is product work).

**Status:** [CR-79](https://linear.app/community-rule/issue/CR-79/backend-load-rule-templates-from-get-apitemplates-in-ui) **Done**.

---

## Ticket 16 — Template recommendation matrix (facet data + APIs; no xlsx import)

**Depends on:** Tickets 7–8 (templates exist in DB and UI can fetch them).

**Goal:** **Facet-aware recommendations** for **methods** in the create-flow card decks, and **API-level** ranking for **templates** when `facet.*` query params are present — without a runtime `.xlsx` / SheetJS import (authoring stays **committed JSON** + Prisma seed, with spreadsheets as optional one-time offline references only).

**Context:** [`RuleTemplate`](prisma/schema.prisma) remains a list row per template; facet match data for **methods** lives in `MethodFacet` (seeded from `data/create/customRule/*.json`). See [template-recommendation-matrix.md](template-recommendation-matrix.md).

**Implementation (shipped):**

1. **Authoring contract + storage:** Zod-validated JSON under `data/create/customRule/`; seed into `MethodFacet` (and related); documented in template-recommendation-matrix.md.
2. **APIs:** `GET /api/templates?facet.*` returns `{ templates, scores? }`; `GET /api/create-flow/methods?section=…&facet.*` returns methods with match scores for card re-ranking.
3. **UI (wizard):** `useFacetRecommendations` + `rankMethodsByScore` / `deriveCompactCards` on the custom-rule card / right-rail steps (recommended methods).
4. **Not shipped here:** **Marketing template grids** (home, `/templates`) still call `GET /api/templates` **without** facets — product/UI follow-up **[CR-93](https://linear.app/community-rule/issue/CR-93/product-rank-template-cards-by-community-facets-reuse-get-apitemplates)**. **Automated tests** for template ranking via `/api/templates` are **deferred to CR-93** with that UI work.

**Acceptance criteria:**

- [x] Updating committed facet JSON + re-seeding changes recommendations without hand-editing arbitrary Prisma rows for facet data.
- [x] API behavior documented in template-recommendation-matrix.md §9; facet parsing / method route covered by tests; template ranking tests deferred per CR-93.
- [x] Invalid / partial facet combinations degrade gracefully (curated / score-0 fallbacks).

**Files:** [prisma/schema.prisma](prisma/schema.prisma), [data/create/customRule/](data/create/customRule/), [app/api/templates/route.ts](app/api/templates/route.ts), [app/api/create-flow/methods/route.ts](app/api/create-flow/methods/route.ts), [lib/server/ruleTemplates.ts](lib/server/ruleTemplates.ts), [lib/server/validation/methodFacetsSchemas.ts](lib/server/validation/methodFacetsSchemas.ts), [app/(app)/create/hooks/useFacetRecommendations.ts](app/(app)/create/hooks/useFacetRecommendations.ts), [docs/guides/template-recommendation-matrix.md](template-recommendation-matrix.md).

**Status:** [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-facet-data-seed-and-apis-no) **Done**.

---

## Ticket 17 — Canon custom create-rule wizard (routes, resume, progress) + docs

**Depends on:** none for documentation; soft optional **CR-73**, **CR-76**, **CR-77** for payload/resume/publish alignment.

**Goal:** Establish the **official custom** create-rule flow (ordered steps, URLs, persistence, entry points, **Figma three-stage framing**) in repo docs and close gaps between that spec and the implementation (routing clutter, progress UI, step source of truth, resume vs URL).

**Context:** Step order lives in [`app/(app)/create/utils/flowSteps.ts`](app/(app)/create/utils/flowSteps.ts). Wizard screens render from [`app/(app)/create/[screenId]/page.tsx`](app/(app)/create/[screenId]/page.tsx) plus [`CREATE_FLOW_SCREEN_REGISTRY`](app/(app)/create/utils/createFlowScreenRegistry.ts) (Figma node + layout family per slug). [`docs/create-flow.md`](create-flow.md) is the **canonical** URL/persistence summary: **Create Community** (eight semantic steps ending at `review`) → **Create Custom CommunityRule** → **Review and complete**. **Full create-from-template** will likely use **additional route(s)** when product defines it; **`/create/review-template/[slug]`** remains auxiliary preview only. **Template → `final-review` prefill** (skipping straight to publish) is **out of scope** here (future ticket). The **Customize** button on `/create/review-template/[slug]` now prefills customize selections and routes to `core-values` (or `informational` when Community is empty) via [`buildTemplateCustomizePrefill`](../../lib/create/applyTemplatePrefill.ts). **Use without changes** writes `template.body.sections` into `state.sections` and routes to `confirm-stakeholders`, so the user exits through the normal `final-review → handleFinalize → publishRule` pipeline and inherits its 401 sign-in gate. When either button is clicked **before** the community stage is done, the handler still applies its side effects eagerly and pins a `pendingTemplateAction: { slug, mode }` on `CreateFlowState`; [`CommunityReviewScreen`](app/(app)/create/screens/review/CommunityReviewScreen.tsx) consumes the pin on mount and `router.replace`s past itself to the right downstream step (`core-values` for customize, `confirm-stakeholders` for useWithoutChanges), so users never see the community-review page after expressing template intent at the template-review step.

**Implementation:**

1. Keep [`docs/create-flow.md`](create-flow.md) in sync with product/Figma (stage ↔ step mapping, future template routes).
2. ~~Remove legacy [`app/(app)/create/[step]/page.tsx`](app/(app)/create/[step]/page.tsx)~~ — replaced by [`app/(app)/create/[screenId]/page.tsx`](app/(app)/create/[screenId]/page.tsx) with real screens; unknown slugs `notFound()`.
3. ~~Unify **step source of truth** / **resume after `SignedInDraftHydration`~~ — moved to **[CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)** (profile lists drafts, continue at last step, new rule vs server draft; see `docs/create-flow.md` known gaps).
4. Wire [`CreateFlowFooter`](app/components/utility/CreateFlowFooter/) `ProportionBar` to step progress from `FLOW_STEP_ORDER` (and `review-template` / `completed` exceptions per design); optional **two-level progress** (stage + step within stage) when design specifies.
5. When Figma hands off, surface **stage labels** in create shell (top nav, footer, or step chrome) using the mapping in `create-flow.md`.

**Acceptance criteria:**

- [x] [`docs/create-flow.md`](create-flow.md) matches shipped behavior or lists known gaps, including **Figma three-stage** mapping and **future template route** note; draft/hydration follow-ups point to **CR-86**.
- [x] No misleading dynamic step placeholder for valid wizard URLs.
- [x] Footer progress reflects step index via `getProportionBarProgressForCreateFlowStep` (optional stage labels still Figma-dependent).
- [x] Template **Customize** prefill is documented (maps template body to `selected*Ids` + `coreValuesChipsSnapshot`, routes to `core-values` when Community has data else `informational`); full template-customize-from-mid-wizard entry beyond `core-values` stays deferred.

**Files:** [`docs/create-flow.md`](create-flow.md), [`app/(app)/create/`](app/(app)/create/), [`app/components/utility/CreateFlowFooter/`](app/components/utility/CreateFlowFooter/), optionally [`docs/backend-roadmap.md`](backend-roadmap.md) §12 cross-links.

**Linear:** [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo) **Done**. Open-ended draft/hydration work: **[CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)**. **Parallel** to templates (7–8) and publish (6); not part of **CR-72 → CR-83**.

---

## Ticket 18 — Invite stakeholders (email) from `confirm-stakeholders` step

**Depends on:** **Ticket 3 / CR-74** + **Ticket 4 / CR-75** (magic-link + session) for per-stakeholder identity, **Ticket 6 / CR-77** (publish) so a `PublishedRule` exists to invite people to, **Ticket 2 / CR-73** (`CreateFlowState` validation) to land the persisted stakeholder shape.

**Server / admin:** **Same as CR-74** — dev works against Mailhog / dev-log; **staging/prod** reuses the **SMTP** + **SPF/DKIM** already set up for magic-link email.

**Goal:** Turn the [`confirm-stakeholders`](../../app/(app)/create/screens/select/ConfirmStakeholdersScreen.tsx) step from a local chip list into a real **stakeholder invite** feature. Today the screen only collects in-memory `ChipOption[]` labels with no email, no persistence, no notification. Product copy in [`messages/en/create/reviewAndComplete/confirmStakeholders.json`](../../messages/en/create/reviewAndComplete/confirmStakeholders.json) already promises that "Adding people at this step will **invite them** to see your proposed CommunityRule and make their own proposals" — we need the feature behind that promise.

**Context:** **No Figma hand-off or product direction yet** for the invite mechanic. **Email is the working assumption** (magic-link parity) but could become email + copy-link, in-app invite, SMS, etc. `CreateFlowState` has no structured `stakeholders` field and there is no `RuleStakeholder` / `RuleInvite` Prisma model. Leaving the step as-is ships a copy promise we do not keep; this ticket is the container for closing that gap once the design + product brief lands.

**Open product questions (block implementation until resolved):**

1. Invite channel: email only, email + shareable link, or in-app (account required)?
2. Does accepting an invite require a CommunityRule account (magic-link), or can stakeholders read / propose anonymously?
3. Per-stakeholder permissions: view-only vs. propose-changes vs. co-owner? Default?
4. Timing: invites sent on **publish** (after `POST /api/rules`) or at **confirm-stakeholders** save? How are post-publish additions handled?
5. Revocation / re-send UX and rate limits (reuse magic-link per-IP limiter or a new per-rule limiter?).
6. Notification copy + sender identity (reuse `SMTP_FROM` or dedicated sender).

**Implementation sketch (subject to product sign-off):**

1. **Product + design pass** to answer the questions above and produce Figma for the stakeholder row (email field, validation, resend/remove affordances, empty state).
2. **Schema:** Add a structured `stakeholders: StakeholderInvite[]` to `CreateFlowState` (Ticket 2 pattern) and/or a Prisma `RuleStakeholder` (`id`, `ruleId`, `email`, `role`, `invitedAt`, `acceptedAt`, `revokedAt`, `tokenHash?`). Decide draft vs. published semantics.
3. **API:** Likely `POST /api/rules/:id/stakeholders` (invite), `DELETE /api/rules/:id/stakeholders/:id` (revoke), `POST /api/rules/:id/stakeholders/:id/resend`. Validate with Zod; align error shape with **Ticket 13 / CR-84**.
4. **Mail:** Reuse [`lib/server/mail.ts`](../../lib/server/mail.ts) + Mailhog/dev-log pattern from **CR-74**; per-stakeholder hashed token akin to `MagicLinkToken` if acceptance requires identity.
5. **UI:** Replace free-text chips with `email` + optional `label` input, client-side email validation, inline errors (invalid email, 429 `retryAfterMs`, duplicate). Use `markCreateFlowInteraction()` per the create-flow guardrails in [`.cursor/rules/create-flow.mdc`](../../.cursor/rules/create-flow.mdc).
6. **i18n:** Expand [`confirmStakeholders.json`](../../messages/en/create/reviewAndComplete/confirmStakeholders.json) with invite copy (send button, error strings, resend, revoke confirm).
7. **Tests:** Schema + route unit tests; Vitest component tests for the form; optional E2E once publish is stable.

**Out of scope:**

- Real-time collaboration / editing by stakeholders.
- Threaded proposals / comments UI (future product work).
- Notifications beyond the initial invite (digest emails, reminders).

**Acceptance criteria:**

- [ ] Product + design brief answering the open questions, linked from the Linear issue.
- [ ] `CreateFlowState.stakeholders` (or equivalent) is typed, validated server-side, and persists across draft save / resume.
- [ ] An invited stakeholder receives the chosen notification (email in the default proposal) in local dev via Mailhog / dev-log, same pattern as magic-link.
- [ ] Invalid / duplicate / rate-limited invites show clear, accessible errors; no silent failures.
- [ ] Copy in [`confirmStakeholders.json`](../../messages/en/create/reviewAndComplete/confirmStakeholders.json) matches the shipped capability (no "will invite" promise without implementation).

**Files (expected):** [`app/(app)/create/screens/select/ConfirmStakeholdersScreen.tsx`](../../app/(app)/create/screens/select/ConfirmStakeholdersScreen.tsx), [`messages/en/create/reviewAndComplete/confirmStakeholders.json`](../../messages/en/create/reviewAndComplete/confirmStakeholders.json), [`app/(app)/create/types.ts`](../../app/(app)/create/types.ts), [`prisma/schema.prisma`](../../prisma/schema.prisma), new `app/api/rules/[id]/stakeholders/*`, [`lib/server/mail.ts`](../../lib/server/mail.ts), [`lib/server/validation/`](../../lib/server/validation/), tests under `tests/`.

**Linear:** [CR-90](https://linear.app/community-rule/issue/CR-90/productbackend-invite-stakeholders-email-from-confirm-stakeholders) (**Backlog**). **Parallel** to the CR-72 → CR-83 chain; unblocked to start the product/design brief now — implementation waits on **CR-74 / CR-75 / CR-77 / CR-73**.

---

## Ticket 19 — `Add` button behavior on custom-rule pages and Final Review chips

**Depends on:** nothing technical. Pure **product + design** clarification — blocks consistent UX of the Create flow's custom path and the Final Review screen, but does not block any backend work.

**Server / admin:** none.

**Goal:** Decide what the **`Add`** affordance should do on each custom-rule page and on the **Final Review** screen, and produce Figma covering the chosen behavior. Today the affordance is inconsistent: on most custom-rule pages it just expands the card list, on `core-values` it opens a real modal flow, and on Final Review the `+` button on each chip row is a no-op.

**Context — what `Add` does today:**

- **Core values** ([`CoreValuesSelectScreen.tsx`](../../app/(app)/create/screens/select/CoreValuesSelectScreen.tsx)) — full custom-chip flow: `Add value` → empty chip with input → check → opens an editable `meaning` / `signals` modal. Dismissing the modal now drops the brand-new chip (`customPending` session). Add Value confirms it as a selected chip.
- **Communication / Membership / Conflict management / Decision approaches** (card-style screens, e.g. [`CommunicationMethodsScreen.tsx`](../../app/(app)/create/screens/card/CommunicationMethodsScreen.tsx)) — there is **no `Add custom method` affordance**. The inline `add` link in the page description (`messages/en/create/customRule/*.json`, `compactDescriptionLinkLabel: "add"`) only toggles `setExpanded(true)` on the card stack — it shows more preset cards, it does **not** open a creation modal.
- **Confirm stakeholders** — multiselect-style add (free-text chip), pending real invite work in **Ticket 18 / CR-90**.
- **Community structure** — multiselect-style add (free-text chip).
- **Final Review** ([`FinalReviewScreen.tsx`](../../app/(app)/create/screens/review/FinalReviewScreen.tsx)) — renders `<RuleCard categories=…>` and only wires `onChipClick`. `category.onAddClick` is **not provided**, so the `+` button on each MultiSelect category renders by default (`addButton={!hideCategoryAddButton}` in [`RuleCard.view.tsx`](../../app/components/cards/RuleCard/RuleCard.view.tsx)) but **does nothing** when clicked. Dead control we are shipping today.

**Open product questions (block implementation until resolved):**

_Section A — custom-rule card pages (communication, membership, conflict management, decision approaches):_

1. Should each of these pages have a true **"Add custom \<method/approach/protocol\>"** button, distinct from the existing `add` text link that just expands the card stack?
2. If yes: where does it sit (header CTA / end of stack / both)? Does it open a **clean empty modal** in the same shape as the page's edit modal (the `*EditFields` components under `app/(app)/create/components/methodEditFields/`)? Same `customPending` semantics as core values (dismiss = drop, confirm = persist + select)? Required vs optional fields?
3. If no: should we **rename or remove** the inline `add` link in the description so it doesn't promise creation behavior we don't deliver?

_Section B — Final Review screen `+` button per category:_

1. Pick one:
   - **Option 1 — fresh modal in place.** Clicking `+` opens [`FinalReviewChipEditModal`](../../app/(app)/create/components/FinalReviewChipEditModal.tsx) seeded empty for the category. On Save, append a new chip and write through to the matching `*MethodDetailsById` (or `coreValueDetailsByChipId` + snapshot) map, matching the editable chip flow that just shipped.
   - **Option 2 — bounce back to the source step.** Navigate the user to the corresponding custom-rule step (e.g. communication chip `+` → `/create/communication`) so they add via the existing card-page flow, then return to Final Review.
   - **Option 3 — hide the button.** Pass `hideCategoryAddButton` to the Final Review `<RuleCard>` so the dead control disappears until product knows what they want.
2. If Option 1, what is the empty state of the modal (title only, all fields, recommended seeds)?
3. If Option 2, how do we preserve the user's place on Final Review so they can come back without re-confirming everything?
4. Does the answer differ for `coreValues` vs the four method categories? (Different edit-fields components, different state slices.)

**Implementation sketch (subject to product sign-off):**

1. **Product + design pass** answering Sections A and B; produce Figma for whichever options win on each affected page and on Final Review.
2. **Custom-rule card pages (if Option A1 wins):** add an `Add custom <method>` button alongside the card stack on each of the four pages. Reuse the page's `*EditFields` component inside a `customPending`-style modal (same dismiss-drops / confirm-persists semantics as `CoreValuesSelectScreen`). Persist into the matching `*MethodDetailsById` slice and selected-id list.
3. **Final Review (if Option B1 wins):** wire `category.onAddClick` per category in [`FinalReviewScreen.tsx`](../../app/(app)/create/screens/review/FinalReviewScreen.tsx) → open `FinalReviewChipEditModal` seeded empty for the matching `groupKey`, with a `customPending` mode that drops the new entry on dismiss and persists on Save (parity with the current chip-edit flow).
4. **Final Review (if Option B3 wins, interim):** pass `hideCategoryAddButton` to the Final Review `<RuleCard>` so the no-op `+` is removed.
5. **i18n:** add copy for the new buttons, modal headers, validation, and confirmation/discard prompts under `messages/en/create/customRule/*.json` and `messages/en/create/reviewAndComplete/finalReview.json`.
6. **Tests:** Vitest component tests covering dismiss-drops vs confirm-persists for each new modal (mirror the new `CoreValuesSelectScreen.test.tsx` `custom chip — confirmed vs dismissed` pair).

**Out of scope:**

- Server-side persistence changes — adding a chip already flows through existing `*MethodDetailsById` / `coreValueDetailsByChipId` snapshots.
- Reworking the inline `add` link's `compactDescriptionLinkLabel` semantics until product decides whether it still belongs.
- Bulk-add UX (paste many chips at once).

**Acceptance criteria:**

- [ ] Product brief answering Section A and Section B, linked from the Linear issue.
- [ ] Figma covering whichever options product picks for the four card-style pages and Final Review.
- [ ] If Option B3 (interim) ships first: the Final Review `+` is no longer rendered (no dead controls).
- [ ] Once Option A1 / B1 are picked: implementation tickets file under this one with `customPending` parity and tests, no regressions to the existing chip-edit flow.

**Files (reference):** [`app/(app)/create/screens/card/CommunicationMethodsScreen.tsx`](../../app/(app)/create/screens/card/CommunicationMethodsScreen.tsx), [`MembershipMethodsScreen.tsx`](../../app/(app)/create/screens/card/MembershipMethodsScreen.tsx), [`ConflictManagementScreen.tsx`](../../app/(app)/create/screens/card/ConflictManagementScreen.tsx), [`right-rail/DecisionApproachesScreen.tsx`](../../app/(app)/create/screens/right-rail/DecisionApproachesScreen.tsx), [`select/CoreValuesSelectScreen.tsx`](../../app/(app)/create/screens/select/CoreValuesSelectScreen.tsx), [`review/FinalReviewScreen.tsx`](../../app/(app)/create/screens/review/FinalReviewScreen.tsx), [`components/FinalReviewChipEditModal.tsx`](../../app/(app)/create/components/FinalReviewChipEditModal.tsx), [`components/methodEditFields/`](../../app/(app)/create/components/methodEditFields/), [`components/cards/RuleCard/RuleCard.view.tsx`](../../app/components/cards/RuleCard/RuleCard.view.tsx).

**Linear:** [CR-91](https://linear.app/community-rule/issue/CR-91/productdesign-add-button-behavior-on-custom-rule-pages-and-final) (**Backlog**). Sibling product/design ticket to **CR-90** (same "copy promises a feature, UI doesn't deliver" pattern). **Parallel** to the CR-72 → CR-83 chain; not on the critical path.

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

**Files:** [app/api/web-vitals/route.ts](app/api/web-vitals/route.ts), [app/(admin)/monitor/page.tsx](app/(admin)/monitor/page.tsx), optionally `prisma/schema.prisma` **only if** option C.

**Repo check (2026-04):** Route still **writes files under `.next/web-vitals`** — **CR-80** remains applicable.

---

## Ticket 10 — Public rule detail (optional product scope)

**Depends on:** Ticket 6.

**Goal:** Shareable link for a published rule.

**Note:** Complements **Ticket 15** profile cards: users can open a **public** detail URL from a rule listed on their dashboard; the profile page does **not** replace this ticket.

**Implementation:**

1. Add `GET /api/rules/[id]/route.ts` returning `{ rule }` or 404 (public read; no secrets).
2. Add `app/(marketing)/rules/[id]/page.tsx` (or under `create` if private) rendering `document` JSON with existing document components.
3. Consider soft-delete flag later; out of scope unless product requires hide.

**Repo check (2026-04):** Only [`app/api/rules/route.ts`](app/api/rules/route.ts) exists (list + POST); **no** `app/api/rules/[id]/` handler yet — **CR-81** still open.

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

## Ticket 12 — Staging / production admin handoff (Cloudron at MEDLab)

**Depends on:** Tickets 1–8 complete enough to deploy a vertical slice.

**Server / admin:** **This is the handoff ticket.** Scope is **narrowed** vs. the original "full operator runbook" framing: the deliverable is the **admin-handoff sheet** — exactly what access, env vars, and platform decisions to ask MEDLab's Cloudron admin for. The full deploy runbook (build / push / install / migrate / smoke / rollback) is **split out into a follow-up ticket** so CR-83 isn't blocked on access we don't have yet.

**Goal:** Single short doc the admin can read end-to-end and respond to in one round-trip: required access, Cloudron-injected vs. manually-set env vars, platform settings to confirm (`httpPort`, `healthCheckPath`, addons, memory, backups), and the open product decisions only admin can answer (subdomains, sender address, registry choice, cutover overlap, retention).

**Platform context:** Target is **Cloudron at MEDLab** (same host as the legacy [`CommunityRule/CommunityRuleBackend`](https://git.medlab.host/CommunityRule/CommunityRuleBackend), which is Express + MySQL with a 30-min `run.sh` watchdog). New app is a properly packaged Cloudron app (Docker image + `CloudronManifest.json`), uses the **postgresql + sendmail + localstorage** addons, and replaces the legacy service entirely — **no data migration**. Cloudron's container supervisor replaces the old watchdog.

**Implementation (shipped):**

1. [`docs/guides/ops-backend-deploy.md`](ops-backend-deploy.md) — admin handoff sheet (~1 page):
   - **§2 Access checklist** (Cloudron admin login, registry creds, DNS, `cloudron` CLI, log access, read of legacy app config).
   - **§3 Env vars** split into Cloudron auto-injected (`CLOUDRON_POSTGRESQL_URL`, `CLOUDRON_MAIL_SMTP_*`) vs. manually-set (`SESSION_SECRET`, `SMTP_FROM`, `NEXT_PUBLIC_ENABLE_BACKEND_SYNC`).
   - **§4 Platform settings** (`httpPort: 3000`, `healthCheckPath: /api/health`, memory, backups, TLS).
   - **§5 Decisions** (subdomains, sender, registry, cutover, retention).
   - **§7 Old vs new deltas** (addons, watchdog, OTP→magic link, sender, API surface — all reasons not to reuse legacy infra).
   - **§8 Follow-up tickets** (the six tickets below).
2. Cross-links: [`docs/guides/backend-roadmap.md`](backend-roadmap.md) §11 (environments — names Cloudron at MEDLab) and §8 (migrations policy — never rewrite applied migrations).

**Acceptance criteria:**

- [x] Admin can grant the right access + answer the open decisions in one pass without further back-and-forth.
- [x] Doc is ~1 page and explicitly lists what is **not** in scope so admin doesn't expect a full deploy walkthrough.
- [x] Six follow-up tickets enumerated and linked (see below).

**Files:** [`docs/guides/ops-backend-deploy.md`](ops-backend-deploy.md), [`docs/guides/backend-roadmap.md`](backend-roadmap.md), [`docs/README.md`](../README.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

**Status:** [CR-83](https://linear.app/community-rule/issue/CR-83/backend-stagingproduction-runbook-admin-handoff-docsops-backend) **Done** (admin handoff scope). Deployment-pipeline implementation tracked in the follow-up tickets below.

### Follow-up tickets filed under CR-83

All six are titled `[Backend] …`, assigned to Vinod, in the **community-rule** team, **Backlog** state. IDs filled in once filed via Linear MCP.

| # | Linear | Title | Depends on |
| - | ------ | ----- | ---------- |
| 1 | [CR-96](https://linear.app/community-rule/issue/CR-96/backend-bridge-cloudron-env-vars-to-canonical-names) | `[Backend] Bridge CLOUDRON_* env vars to canonical names` | none — can ship now |
| 2 | [CR-97](https://linear.app/community-rule/issue/CR-97/backend-container-image-registry-choose-build-push) | `[Backend] Container image registry: choose, build, push` | registry decision (handoff §5) |
| 3 | [CR-98](https://linear.app/community-rule/issue/CR-98/backend-cloudron-staging-install-smoke) | `[Backend] Cloudron staging install + smoke` | CR-96 + CR-97 + Cloudron CLI access + staging DNS |
| 4 | [CR-99](https://linear.app/community-rule/issue/CR-99/backend-cloudron-production-install-dns-cutover) | `[Backend] Cloudron production install + DNS cutover` | CR-98 green for the agreed overlap window |
| 5 | [CR-100](https://linear.app/community-rule/issue/CR-100/backend-steady-state-operator-runbook) | `[Backend] Steady-state operator runbook` | CR-98 (write what we actually did) |
| 6 | [CR-101](https://linear.app/community-rule/issue/CR-101/backend-decommission-legacy-expressmysql-backend) | `[Backend] Decommission legacy Express/MySQL backend` | CR-99 + sign-off window |

**Per-ticket detail:**

1. **Bridge `CLOUDRON_*` env vars to canonical names.** Cloudron injects `CLOUDRON_POSTGRESQL_URL` and `CLOUDRON_MAIL_SMTP_SERVER/PORT/USERNAME/PASSWORD`; the app reads `DATABASE_URL` / `SMTP_URL`. Recommended approach: read both names in [`lib/server/env.ts`](../../lib/server/env.ts) and assemble `SMTP_URL` from the four parts in [`lib/server/mail.ts`](../../lib/server/mail.ts) when only the Cloudron names are present. Alternative: a `start.sh` shim in the image. Acceptance: with only `CLOUDRON_*` set, app connects to DB and sends mail; with only canonical names set (current behavior), unchanged; unit tests cover both.
2. **Container image registry: choose, build, push.** Acceptance: `docker pull <registry>/communityrule:<tag>` works from a Cloudron-reachable network. CI builds and pushes on merge to `main` (stretch).
3. **Cloudron staging install + smoke.** Acceptance: `curl https://<staging>/api/health` returns `{"ok":true,"database":"connected"}`; magic-link request → click link → `GET /api/auth/session` returns a user; publishing a rule succeeds.
4. **Cloudron production install + DNS cutover.** Acceptance: production subdomain resolves to the new app; old subdomain still works during overlap; sign-in + publish succeed against production; backups confirmed.
5. **Steady-state operator runbook.** Lives at `docs/guides/ops-runbook.md` (sibling to the handoff). Covers deploy a new version, rollback, restore drill cadence, multi-instance limitations from [`backend-roadmap.md`](backend-roadmap.md) §5/§7. Acceptance: a fresh reader can deploy + roll back using only this doc.
6. **Decommission legacy Express/MySQL backend.** Acceptance: old Cloudron app stopped + uninstalled; old MySQL addon backed up once and removed; legacy Gitea repo README updated to point at this app. Priority: Low.

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

- [x] At least auth + draft + rules routes return the agreed shape for new code paths.
- [x] Errors in logs include request id when available.

**Files:** [`lib/server/responses.ts`](lib/server/responses.ts), [`lib/server/requestId.ts`](lib/server/requestId.ts), [`lib/server/apiRoute.ts`](lib/server/apiRoute.ts); migrated `app/api/auth/**/route.ts`, `app/api/drafts/me/route.ts`, `app/api/rules/route.ts`, `app/api/rules/[id]/route.ts`; tests in `tests/unit/{responses,requestId,apiRoute,draftsMeRoute,rulesByIdRoute}.test.ts`.

**Linear:** [CR-84](https://linear.app/community-rule/issue/CR-84/backend-api-error-contract-request-id-logging) **Done** (**CR-73** Done — was ready to pick up).

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

**Linear:** [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy) **Done** — multi-device policy; lazy expired-row cleanup on every sign-in (per-user prune via `@@index([userId])` + ~5% global sweep); no rotation in v1; cleanup failures logged but never fail sign-in. ADR comment block lives at the top of [lib/server/session.ts](../../lib/server/session.ts); no Prisma migration needed.

---

## Ticket 15 — Profile dashboard + account (Figma profile)

**Depends on:** Ticket 3 (auth), **Ticket 4** (session in UI), **Ticket 6** (**CR-77** publish — **Done** — so real published rules exist for “my rules”). Soft optional: Tickets 7–8 for “create from template” CTA parity.

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

**Linear:** [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile) (**Backlog**). **Publish prerequisite:** **CR-77** **Done** — not blocked on wiring. **Related:** [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional) (public rule detail for deep links from profile cards). **Not** part of the sequential **CR-72 → CR-83** chain—parallel after session, similar to CR-84/CR-85. **Also on CR-86:** draft list + resume + hydration alignment (moved from CR-89).

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
|    12 | 12     | Ops admin handoff (Cloudron) **Done** |
|    13 | 13     | API errors + request-id logging   |
|    14 | 14     | Session lifecycle + cleanup       |
|    15 | 15     | Profile + account (Figma profile) |
|    16 | 16     | Template matrix (facets; no xlsx) |
|    17 | 17     | Canon create-flow (custom path)     |
|    18 | 18     | Stakeholder invites (confirm-stakeholders) |
|    19 | 19     | `Add` button behavior (custom-rule pages + Final Review) |

**Follow-up (no doc ticket #):** **[CR-93](https://linear.app/community-rule/issue/CR-93/product-rank-template-cards-by-community-facets-reuse-get-apitemplates)** — marketing template grids ranked by user facets (API-ready; tests deferred with that issue).

Tickets **10–11** can be deferred without blocking the core “auth + drafts + publish + templates” vertical slice. **Ticket 6 / CR-77** (publish) is **Done**. **Ticket 16** / **CR-88** (facet data + APIs + wizard method ranking) shipped **after 7–8**; **CR-93** tracks **marketing** template grids ranked by user facets (API-ready). **Ticket 17** / **CR-89** (**[Done](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)**) canonizes the **custom** wizard in [`docs/create-flow.md`](create-flow.md) (progress bar, `[screenId]` routing). **Draft resume / hydration** follow-ups: **CR-86**. **Tickets 13–14** are parallel (**CR-84** / **CR-85** — both **Done**). **Ticket 15 / CR-86** is **parallel** (publish prerequisite met); implementation backlog. **Ticket 18** (**[CR-90](https://linear.app/community-rule/issue/CR-90/productbackend-invite-stakeholders-email-from-confirm-stakeholders)**) adds real **email-based stakeholder invites** to the `confirm-stakeholders` step — currently ships as a label-only chip list despite copy promising invites; **parallel** to the main chain, awaits design + product brief before implementation. **Ticket 19** (**[CR-91](https://linear.app/community-rule/issue/CR-91/productdesign-add-button-behavior-on-custom-rule-pages-and-final)**) is a **product/design** clarification ticket: the `Add` affordance is inconsistent across custom-rule pages (full custom-chip flow only on `core-values`; an `add` link that just expands the card stack on the four card-style pages) and the Final Review screen renders a `+` button per category that today is a no-op; needs a brief + Figma before any implementation lands.

---

## Linear (Community-rule team)

**Main chain (historical):** **CR-72 → CR-83** was the original **strict sequence**; **repo + Linear status today:** **CR-72–CR-79**, **CR-83**, **CR-84**, **CR-85**, **CR-88**, **CR-89** are **Done**; **CR-77** (publish) **Done**; **CR-80–CR-82** remain **Backlog** (web vitals, public rule detail, CI migrate smoke). **CR-83** (admin handoff) shipped as a narrow handoff sheet; the actual Cloudron deployment pipeline is split into the **`[Backend]` follow-up tickets** filed under it (env-var bridging → image registry → staging → production cutover → operator runbook → legacy decommission). **Parallel (still open):** **CR-86** / Ticket 15 (**Backlog** — publish **not** a blocker); **CR-93** (**Backlog**); **CR-90** / Ticket 18 (stakeholder invites); **CR-91** / Ticket 19 (`Add` button behavior).

| Doc ticket | Linear                                                                                                                      | Title (short)                           |
| ---------: | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
|          1 | [CR-72](https://linear.app/community-rule/issue/CR-72/backend-align-docsbackend-roadmapmd-with-current-codebase)            | Align backend-roadmap                   |
|          2 | [CR-73](https://linear.app/community-rule/issue/CR-73/backend-formalize-createflowstate-validate-draftpublish-api-payloads) | CreateFlowState + API validation        |
|          3 | [CR-74](https://linear.app/community-rule/issue/CR-74/backend-magic-link-sign-in-ui-apis-ticket-3-cr-75-done)               | Magic-link sign-in UI (Ticket 3; Done)  |
|          4 | [CR-75](https://linear.app/community-rule/issue/CR-75/backend-create-flow-session-ui-sign-out-ticket-4-done)                | Create flow session UI (Ticket 4; Done) |
|          5 | [CR-76](https://linear.app/community-rule/issue/CR-76/backend-harden-server-draft-sync-save-and-exit-post-login-transfer)   | Draft sync hardening (PUT UX / errors)  |
|          6 | [CR-77](https://linear.app/community-rule/issue/CR-77/backend-wire-publish-rule-from-create-flow-post-apirules)             | Publish wiring **Done**                 |
|          7 | [CR-78](https://linear.app/community-rule/issue/CR-78/backend-prisma-seed-ruletemplate-document)                            | Template seed **Done**                  |
|          8 | [CR-79](https://linear.app/community-rule/issue/CR-79/backend-load-rule-templates-from-get-apitemplates-in-ui)              | Templates in UI                         |
|          9 | [CR-80](https://linear.app/community-rule/issue/CR-80/backend-persist-web-vitals-outside-next-db-or-external-rum)           | Web vitals (prefer external)            |
|         10 | [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional)              | Public rule detail (optional)           |
|         11 | [CR-82](https://linear.app/community-rule/issue/CR-82/backend-ci-postgres-migration-smoke-optional)                         | CI migrate smoke (optional)             |
|         12 | [CR-83](https://linear.app/community-rule/issue/CR-83/backend-stagingproduction-runbook-admin-handoff-docsops-backend)      | Ops admin handoff (Cloudron) **Done**   |
|       12.1 | [CR-96](https://linear.app/community-rule/issue/CR-96/backend-bridge-cloudron-env-vars-to-canonical-names)                 | `[Backend] Bridge CLOUDRON_* env vars to canonical names` |
|       12.2 | [CR-97](https://linear.app/community-rule/issue/CR-97/backend-container-image-registry-choose-build-push)                  | `[Backend] Container image registry: choose, build, push` |
|       12.3 | [CR-98](https://linear.app/community-rule/issue/CR-98/backend-cloudron-staging-install-smoke)                              | `[Backend] Cloudron staging install + smoke`           |
|       12.4 | [CR-99](https://linear.app/community-rule/issue/CR-99/backend-cloudron-production-install-dns-cutover)                     | `[Backend] Cloudron production install + DNS cutover`  |
|       12.5 | [CR-100](https://linear.app/community-rule/issue/CR-100/backend-steady-state-operator-runbook)                             | `[Backend] Steady-state operator runbook`              |
|       12.6 | [CR-101](https://linear.app/community-rule/issue/CR-101/backend-decommission-legacy-expressmysql-backend)                  | `[Backend] Decommission legacy Express/MySQL backend`  |
|         13 | [CR-84](https://linear.app/community-rule/issue/CR-84/backend-api-error-contract-request-id-logging)                        | API errors + request-id logging         |
|         14 | [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy)         | Session lifecycle + cleanup **Done**    |
|         15 | [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)                      | Profile + account (Figma 22143:900069)  |
|         16 | [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-facet-data-seed-and-apis-no)         | Template matrix (facets; no xlsx)        |
|         17 | [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)   | Canon create-flow (custom wizard + docs) **Done** |
|          — | [CR-93](https://linear.app/community-rule/issue/CR-93/product-rank-template-cards-by-community-facets-reuse-get-apitemplates) | Template grid + facet ranking (product)   |
|         18 | [CR-90](https://linear.app/community-rule/issue/CR-90/productbackend-invite-stakeholders-email-from-confirm-stakeholders)    | Stakeholder invites (confirm-stakeholders) |
|         19 | [CR-91](https://linear.app/community-rule/issue/CR-91/productdesign-add-button-behavior-on-custom-rule-pages-and-final)      | `Add` button behavior (custom-rule + Final Review) |

---

## Linear sync notes (CR-74 / CR-75)

**[CR-74](https://linear.app/community-rule/issue/CR-74/backend-magic-link-sign-in-ui-apis-ticket-3-cr-75-done)** and **[CR-75](https://linear.app/community-rule/issue/CR-75/backend-create-flow-session-ui-sign-out-ticket-4-done)** are kept in sync with **Ticket 3** / **Ticket 4** above (magic link, `AuthModalProvider`, anonymous draft + transfer, etc.). **Residual:** staging/prod `Host` / magic-link URL verification (per-environment).

To refresh other issues from this doc, use Linear MCP `save_issue` or paste the matching **Ticket N** section into the issue body.
