# Backend work — linear tickets

Copy each block into Linear (or your tracker) as a separate issue, **in order**. Earlier tickets are prerequisites for later ones.

**Foundation already in the repo (no ticket needed unless you are onboarding a greenfield clone):** Prisma schema ([prisma/schema.prisma](prisma/schema.prisma)), migrations, `lib/server/*`, Route Handlers under `app/api/*`, [docker-compose.yml](docker-compose.yml), [Dockerfile](Dockerfile), [CONTRIBUTING.md](CONTRIBUTING.md), [`.env.example`](.env.example), [lib/create/api.ts](lib/create/api.ts), create-flow draft **PUT** via `useCreateFlowExit` / `PostLoginDraftTransfer` when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC`.

### Review sync (relevant feedback only)

A backend review was merged into **[docs/backend-roadmap.md](backend-roadmap.md)** after checking the repo. **Incorporated:** custom session lifecycle follow-ups (not a mandate to adopt Auth.js/Lucia), **passwordless email (magic-link request)** rate limits in-memory until multi-instance + shared store, `RuleDraft` already has `updatedAt` (no migration to add it), **prefer external web vitals** over product Postgres by default, API error shape + request-id observability targets, **authorization v1** aligned with `app/api/rules`, Prisma **never edit applied migrations**, **profile / my rules / account** scope from Figma profile (`22143:900069`) as **Ticket 15** (change email deferred). **Excluded:** requiring NextAuth/Lucia; “add `updatedAt` on drafts”; hard ban on DB for vitals (softened to default external). **Parallel Linear issues:** **CR-84** (API errors — **unblocked** now that **CR-73** is Done), **CR-85** (session lifecycle — **unblocked** now that **CR-75** is Done)—see **Linear** table at the end of this doc.

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

**Context:** [lib/create/api.ts](lib/create/api.ts) already wraps `POST /api/rules`. UI on the `final-review` / `completed` steps (see [app/(app)/create/screens/CreateFlowScreenView.tsx](app/(app)/create/screens/CreateFlowScreenView.tsx) and `app/(app)/create/screens/`) must call it with `{ title, summary?, document }` derived from `CreateFlowState`.

**Implementation:**

1. Map `useCreateFlow().state` → `title` / `summary` / `document` (document likely mirrors [CommunityRuleDocument](app/components/sections/CommunityRuleDocument/) shape or raw JSON).
2. Call `publishRule` on explicit user action (“Publish” / “Finalize”) or on transition to `completed` (product decision—prefer explicit button to avoid double-submit).
3. Handle **401**: redirect or modal to sign-in (Ticket 3).
4. Success: navigate to `completed` with rule id in query or state; optional confetti per design.

**Acceptance criteria:**

- [ ] Published row appears in Postgres (`PublishedRule`) and `GET /api/rules` lists it.
- [ ] User sees clear success/failure.

**Files:** relevant `app/(app)/create/*/page.tsx`, [lib/create/api.ts](lib/create/api.ts) if request shape changes, types from Ticket 2.

---

## Ticket 7 — Seed `RuleTemplate` data and document how to re-run

**Depends on:** none (API exists at [app/api/templates/route.ts](app/api/templates/route.ts)).

**Goal:** Curated templates exist in DB for recommendations (v1 = static curated list, no ML).

**Not in v1 (this ticket):** **Spreadsheet-authored matrices**, multi-axis **facet filtering**, or **ranked** recommendations from user answers — that is **Ticket 16 / [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion)** after the flat list ships.

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

**Context:** [RuleStack.view.tsx](app/components/sections/RuleStack/RuleStack.view.tsx) and create entry surfaces reference future template work. Wizard URLs are static segments under `app/(app)/create/`; see [`docs/create-flow.md`](create-flow.md) and **Ticket 17** for the canonical custom flow.

**Implementation:**

1. Add a small client or server data fetch to `GET /api/templates` (RSC `fetch` with cache tags, or client `useEffect` with loading skeleton—match existing data-fetch patterns in the app).
2. Map API rows to existing card components; keep i18n for chrome strings (“See all templates”).
3. Empty state: if API returns `[]`, fall back to static copy or hide section per design.

**Acceptance criteria:**

- [ ] Changing a template row in Prisma Studio reflects after refresh (or revalidate).
- [ ] No layout shift regression on LCP-critical pages (use skeletons).

**Files:** [app/components/sections/RuleStack/](app/components/sections/RuleStack/), create-flow entry routes under [app/(app)/create/](app/(app)/create/), possibly new `lib/templates/fetchTemplates.ts`.

**Follow-up:** **Ticket 16** — dynamic recommendations from authoring spreadsheets and create-flow answers.

---

## Ticket 16 — Template recommendation matrix + spreadsheet ingestion

**Depends on:** Tickets 7–8 (templates exist in DB and UI can fetch them). Can overlap **Ticket 6** (create flow) for wizard steps that POST answers.

**Goal:** Support **dynamic** template selection driven by **authoring spreadsheets** (e.g. Excel / Google Sheets exported to `.xlsx`): each **row** is a template variant with long-form copy (title, description, principles, steps, objections); **columns** encode **matching dimensions** (group size bands, organization type, location, maturity, etc.) with symbols or weights (✓/✗, 0–1 scores). The create flow (or home) should **narrow or rank** options from **user-supplied facets** or a short questionnaire.

**Context:** The current [`RuleTemplate`](prisma/schema.prisma) model is a **flat** list (`slug`, `title`, `category`, `description`, `body` JSON). It does **not** model dimension columns, matrix versioning, or import from sheets. Example product shape: a “Decision-making” workbook → many governance patterns, each row tied to applicability across org context.

**Implementation (phased — product can stop after any phase):**

1. **Authoring contract:** Document required columns / sheet tabs (per domain: decision-making, meetings, etc.), validation rules, and how ✓/✗ or numeric cells map to API filters or scores.
2. **Storage:** Either extend `RuleTemplate` / `body` with a structured `recommendationMatrix` blob **or** add normalized tables (`TemplateDimension`, `TemplateFacetValue`, `TemplateApplicability`) — pick based on query needs and reporting.
3. **Import:** Script or internal admin path: `.xlsx` → parse (e.g. `xlsx` / SheetJS) → validate → upsert DB rows or generate seed JSON checked into repo. **Default:** batch job on export, **not** live Sheets API in prod unless explicitly required.
4. **API:** Extend `GET /api/templates` with optional query params (`?facet.orgType=nonprofit&facet.size=6-12`) **or** add `POST /api/templates/recommend` with a JSON body of answers; return ranked `templates` + optional `scores` / `reasons` for UI.
5. **UI:** Create-flow step(s) collect facets; call API; prefill `CreateFlowState` or document JSON from chosen row’s `body`.

**Acceptance criteria:**

- [ ] Importing an updated workbook (or running the importer) changes recommendations without hand-editing Prisma rows in Studio.
- [ ] API behavior is documented (params or POST body) and covered by tests for at least one reference matrix.
- [ ] Invalid / partial facet combinations degrade gracefully (empty list vs fallback featured templates).

**Files (expected):** `prisma/schema.prisma`, `lib/templates/*` or `scripts/import-templates-xlsx.ts`, `app/api/templates/*`, create-flow pages, tests.

**Linear:** [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion) (**Backlog**). **Parallel** to much of the core chain; **blocked** only by having **CR-78**/**CR-79** far enough along that a template list exists (or stub rows).

---

## Ticket 17 — Canon custom create-rule wizard (routes, resume, progress) + docs

**Depends on:** none for documentation; soft optional **CR-73**, **CR-76**, **CR-77** for payload/resume/publish alignment.

**Goal:** Establish the **official custom** create-rule flow (ordered steps, URLs, persistence, entry points, **Figma three-stage framing**) in repo docs and close gaps between that spec and the implementation (routing clutter, progress UI, step source of truth, resume vs URL).

**Context:** Step order lives in [`app/(app)/create/utils/flowSteps.ts`](app/(app)/create/utils/flowSteps.ts). Wizard screens render from [`app/(app)/create/[screenId]/page.tsx`](app/(app)/create/[screenId]/page.tsx) plus [`CREATE_FLOW_SCREEN_REGISTRY`](app/(app)/create/utils/createFlowScreenRegistry.ts) (Figma node + layout family per slug). [`docs/create-flow.md`](create-flow.md) is the **canonical** URL/persistence summary: **Create Community** (eight semantic steps ending at `review`) → **Create Custom CommunityRule** → **Review and complete**. **Full create-from-template** will likely use **additional route(s)** when product defines it; **`/create/review-template/[slug]`** remains auxiliary preview only. **Template → `final-review` prefill** (skipping straight to publish) is **out of scope** here (future ticket). The **Customize** button on `/create/review-template/[slug]` now prefills customize selections and routes to `core-values` (or `informational` when Community is empty) via [`buildTemplateCustomizePrefill`](../../lib/create/applyTemplatePrefill.ts). **Use without changes** writes `template.body.sections` into `state.sections` and routes to `confirm-stakeholders`, so the user exits through the normal `final-review → handleFinalize → publishRule` pipeline and inherits its 401 sign-in gate. When either button is clicked **before** the community stage is done, the handler still applies its side effects eagerly and pins a `pendingTemplateAction: { slug, mode }` on `CreateFlowState`; [`CommunityReviewScreen`](app/(app)/create/screens/review/CommunityReviewScreen.tsx) consumes the pin on mount and `router.replace`s past itself to the right downstream step (`core-values` for customize, `confirm-stakeholders` for useWithoutChanges), so users never see the community-review page after expressing template intent at the template-review step.

**Implementation:**

1. Keep [`docs/create-flow.md`](create-flow.md) in sync with product/Figma (stage ↔ step mapping, future template routes).
2. ~~Remove legacy [`app/(app)/create/[step]/page.tsx`](app/(app)/create/[step]/page.tsx)~~ — replaced by [`app/(app)/create/[screenId]/page.tsx`](app/(app)/create/[screenId]/page.tsx) with real screens; unknown slugs `notFound()`.
3. Unify **step source of truth**: URL via [`useCreateFlowNavigation`](app/(app)/create/hooks/useCreateFlowNavigation.ts) vs unused [`CreateFlowContext`](app/(app)/create/context/CreateFlowContext.tsx) `currentStep` — pick one model; align [`useCreateFlowExit`](app/(app)/create/hooks/useCreateFlowExit.ts) / draft payload if needed.
4. **Resume:** After [`SignedInDraftHydration`](app/(app)/create/SignedInDraftHydration.tsx), decide redirect to `/create/${state.currentStep}` vs stay on current URL; test or document.
5. Wire [`CreateFlowFooter`](app/components/utility/CreateFlowFooter/) `ProportionBar` to step progress from `FLOW_STEP_ORDER` (and `review-template` / `completed` exceptions per design); optional **two-level progress** (stage + step within stage) when design specifies.
6. When Figma hands off, surface **stage labels** in create shell (top nav, footer, or step chrome) using the mapping in `create-flow.md`.

**Acceptance criteria:**

- [ ] [`docs/create-flow.md`](create-flow.md) matches shipped behavior or lists known gaps, including **Figma three-stage** mapping and **future template route** note.
- [ ] No misleading dynamic step placeholder for valid wizard URLs.
- [ ] Footer progress reflects step index **or** doc/issue records a deliberate deferral with design sign-off.
- [ ] Hydration + `currentStep` behavior is verified (redirect vs stay).
- [ ] Template **Customize** prefill is documented (maps template body to `selected*Ids` + `coreValuesChipsSnapshot`, routes to `core-values` when Community has data else `informational`); full template-customize-from-mid-wizard entry beyond `core-values` stays deferred.

**Files:** [`docs/create-flow.md`](create-flow.md), [`app/(app)/create/`](app/(app)/create/), [`app/components/utility/CreateFlowFooter/`](app/components/utility/CreateFlowFooter/), optionally [`docs/backend-roadmap.md`](backend-roadmap.md) §12 cross-links.

**Linear:** [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo) (**Backlog**). **Parallel** to templates (7–8) and publish (6); not part of **CR-72 → CR-83**.

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

**Linear:** [CR-84](https://linear.app/community-rule/issue/CR-84/backend-api-error-contract-request-id-logging) (**CR-73** Done — ready to pick up).

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

**Linear:** [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy) (**unblocked** — **CR-75** Done).

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

**Linear:** [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile) (**Backlog**). **Blocked by** **CR-77** (publish) only — **CR-75** Done. **Related:** [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional) (public rule detail for deep links from profile cards). **Not** part of the sequential **CR-72 → CR-83** chain—parallel after publish + session, similar to CR-84/CR-85.

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
|    16 | 16     | Template matrix + xlsx ingestion  |
|    17 | 17     | Canon create-flow (custom path)     |

Tickets **10–11** can be deferred without blocking the core “auth + drafts + publish + templates” vertical slice. **Ticket 16** is also **deferrable** until after **7–8** (flat template list + UI); it adds **spreadsheet-driven** recommendations and facet APIs. **Ticket 17** (**[CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)**) canonizes the **custom** wizard in [`docs/create-flow.md`](create-flow.md) and tracks UX/code alignment (progress bar, resume URL, `[step]` cleanup); **parallel** to publish and templates. **Tickets 13–14** are parallel to that chain (**CR-73** / **CR-75** prerequisites are **Done** — **CR-84** / **CR-85** are unblocked), not sequential after CR-83. **Ticket 15** is also **parallel** (blocked by **publish (CR-77)** once session/auth are shipped); Linear: **CR-86**.

---

## Linear (Community-rule team)

**Main chain:** **CR-72 → CR-83** (each blocks the next). **Parallel:** **CR-84** (**CR-73** Done — ready to pick up), **CR-85** (**CR-75** Done — ready to pick up), **CR-86** / Ticket 15 (blocked by **CR-77** publish only; **CR-75** Done), **CR-88** / Ticket 16 (template matrix + `.xlsx` ingestion — after **CR-78**/**CR-79**), **CR-89** / Ticket 17 (canon create-flow + implementation gaps), not in the CR-72–83 sequence.

| Doc ticket | Linear                                                                                                                      | Title (short)                           |
| ---------: | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
|          1 | [CR-72](https://linear.app/community-rule/issue/CR-72/backend-align-docsbackend-roadmapmd-with-current-codebase)            | Align backend-roadmap                   |
|          2 | [CR-73](https://linear.app/community-rule/issue/CR-73/backend-formalize-createflowstate-validate-draftpublish-api-payloads) | CreateFlowState + API validation        |
|          3 | [CR-74](https://linear.app/community-rule/issue/CR-74/backend-magic-link-sign-in-ui-apis-ticket-3-cr-75-done)               | Magic-link sign-in UI (Ticket 3; Done)  |
|          4 | [CR-75](https://linear.app/community-rule/issue/CR-75/backend-create-flow-session-ui-sign-out-ticket-4-done)                | Create flow session UI (Ticket 4; Done) |
|          5 | [CR-76](https://linear.app/community-rule/issue/CR-76/backend-harden-server-draft-sync-save-and-exit-post-login-transfer)   | Draft sync hardening (PUT UX / errors)  |
|          6 | [CR-77](https://linear.app/community-rule/issue/CR-77/backend-wire-publish-rule-from-create-flow-post-apirules)             | Publish wiring                          |
|          7 | [CR-78](https://linear.app/community-rule/issue/CR-78/backend-prisma-seed-ruletemplate-document)                            | Template seed                           |
|          8 | [CR-79](https://linear.app/community-rule/issue/CR-79/backend-load-rule-templates-from-get-apitemplates-in-ui)              | Templates in UI                         |
|          9 | [CR-80](https://linear.app/community-rule/issue/CR-80/backend-persist-web-vitals-outside-next-db-or-external-rum)           | Web vitals (prefer external)            |
|         10 | [CR-81](https://linear.app/community-rule/issue/CR-81/backend-public-rule-detail-page-get-apirulesid-optional)              | Public rule detail (optional)           |
|         11 | [CR-82](https://linear.app/community-rule/issue/CR-82/backend-ci-postgres-migration-smoke-optional)                         | CI migrate smoke (optional)             |
|         12 | [CR-83](https://linear.app/community-rule/issue/CR-83/backend-stagingproduction-runbook-admin-handoff-docsops-backend)      | Ops runbook / admin handoff             |
|         13 | [CR-84](https://linear.app/community-rule/issue/CR-84/backend-api-error-contract-request-id-logging)                        | API errors + request-id logging         |
|         14 | [CR-85](https://linear.app/community-rule/issue/CR-85/backend-custom-session-lifecycle-cleanup-invalidation-policy)         | Session lifecycle + cleanup             |
|         15 | [CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)                      | Profile + account (Figma 22143:900069)  |
|         16 | [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion)         | Template matrix + xlsx ingestion        |
|         17 | [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)   | Canon create-flow (custom wizard + docs) |

---

## Linear sync notes (CR-74 / CR-75)

**[CR-74](https://linear.app/community-rule/issue/CR-74/backend-magic-link-sign-in-ui-apis-ticket-3-cr-75-done)** and **[CR-75](https://linear.app/community-rule/issue/CR-75/backend-create-flow-session-ui-sign-out-ticket-4-done)** are kept in sync with **Ticket 3** / **Ticket 4** above (magic link, `AuthModalProvider`, anonymous draft + transfer, etc.). **Residual:** staging/prod `Host` / magic-link URL verification (per-environment).

To refresh other issues from this doc, use Linear MCP `save_issue` or paste the matching **Ticket N** section into the issue body.
