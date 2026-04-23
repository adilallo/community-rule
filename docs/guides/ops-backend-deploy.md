# Backend deploy — admin handoff

This is the list of access, environment variables, and platform decisions
needed to deploy CommunityRule (the new Next.js + Postgres app in this
repo) onto MEDLab's Cloudron. Hand it to the Cloudron admin; once they
confirm what is checked below, the actual deploy happens in the
follow-up tickets listed in §8.

## 1. Context

- This app **replaces** the old Express + MySQL backend at
  [`CommunityRule/CommunityRuleBackend`](https://git.medlab.host/CommunityRule/CommunityRuleBackend).
- It is packaged as a real Cloudron app (Docker image +
  `CloudronManifest.json`). No `/app/data` drop-in. No `run.sh`
  watchdog — Cloudron's container supervisor handles restarts.
- **Greenfield Postgres.** No data migration from the old MySQL addon.
  Old auth (4-digit OTP in `email_otp`) is replaced by hashed
  magic-link tokens; old API and `rules` / `version_history` tables do
  not map to anything in the new app.

## 2. Access I need

Check off as granted:

- [ ] **Cloudron admin login** for the MEDLab instance, or "deploy
  app" capability scoped to one app slot.
- [ ] **Container registry credentials** — read/write to wherever
  images get pushed (Docker Hub, GHCR, MEDLab self-hosted registry —
  admin's choice; see §6).
- [ ] **DNS** — ability to add/edit a subdomain record pointing at the
  Cloudron host, or confirmation that admin will add the records I
  specify.
- [ ] **`cloudron` CLI access** from my workstation (token-based; no
  SSH needed for normal ops).
- [ ] **Cloudron app log access** — web UI is fine; SSH only if web
  logs aren't enough.
- [ ] **Read access to the existing legacy app's Cloudron config** so
  I can confirm domain / cert / SMTP setup before cutover.

## 3. Environment variables

### Cloudron auto-injects (admin: confirm the addons are enabled)

- `CLOUDRON_POSTGRESQL_URL` — from the **postgresql** addon. The app
  reads `DATABASE_URL`; bridging is a small in-app code change (see
  §8 ticket 1).
- `CLOUDRON_MAIL_SMTP_SERVER` / `_PORT` / `_USERNAME` / `_PASSWORD` —
  from the **sendmail** addon. The app reads `SMTP_URL`; bridged the
  same way.

### I set manually via `cloudron configure --app <id> --set-env`

- `SESSION_SECRET` — long random (`openssl rand -hex 32`). Required,
  ≥ 16 chars. Rotating it logs everyone out.
- `SMTP_FROM` — visible "From:" address on sign-in emails. Cloudron
  does **not** inject this. Recommend `hello@communityrule.info` (same
  as the old service) unless admin wants a new address.
- `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` — turns on Postgres draft
  persistence for signed-in users. Recommended for production.

## 4. Platform settings to confirm

- Container `httpPort`: **3000** (matches [`Dockerfile`](../../Dockerfile)
  `ENV PORT=3000`).
- Health-check path: **`/api/health`**
  ([`app/api/health/route.ts`](../../app/api/health/route.ts) returns
  `200 {"ok":true,"database":"connected"}` when healthy, `503`
  otherwise).
- Memory limit: start at **512 MB**; raise if Next.js standalone OOMs
  under load.
- Backups: confirm Cloudron's daily snapshot is on for both this app
  and its postgresql addon.
- TLS, DNS, SPF/DKIM: handled by Cloudron for the chosen subdomain —
  confirm.

## 5. Decisions I need from admin

1. **Subdomains** for staging and production. Default proposal:
   `staging-app.communityrule.info` + `app.communityrule.info`.
2. **Sender address** — reuse legacy `hello@communityrule.info`, or
   pick a new one?
3. **Container registry** — MEDLab self-hosted, Docker Hub (under
   what org), or GHCR?
4. **Cutover overlap** — how many days should the old service keep
   running in parallel before we uninstall it?
5. **Backup retention** beyond Cloudron defaults? (If "defaults are
   fine," say so.)

## 6. What is intentionally NOT in this doc

So admin doesn't expect more than this scope:

- The deploy runbook itself (build / push / install / migrate / smoke
  / rollback) — written **after** access in §2 is granted; see §8
  ticket 5.
- Code changes to bridge `CLOUDRON_*` env vars to `DATABASE_URL` /
  `SMTP_URL` — I do those locally and ship the image with bridging
  built in; see §8 ticket 1.
- Decommissioning the legacy Express/MySQL service — does not happen
  until the new app is green in production; see §8 ticket 6.

## 7. Old vs new backend deltas

So nothing surprises admin or users at cutover:

- Old addons: **MySQL + sendmail**. New addons: **postgresql +
  sendmail + localstorage**. Different DB addon entirely; do not
  reuse the old one.
- Old service ran from `/app/data/public/communityRuleBackend` with a
  30-min `lsof`-based `run.sh` watchdog — not a packaged Cloudron
  app. New app is a proper Cloudron app; Cloudron supervises it.
- Old auth = plaintext 4-digit OTP. New auth = magic **link** in
  email. If users report "I'm not getting a code," remind them to
  look for a link.
- Old code hardcoded `from: 'hello@communityrule.info'` in
  [`controllers/emailController.js`](https://git.medlab.host/CommunityRule/CommunityRuleBackend/raw/branch/master/controllers/emailController.js)
  because Cloudron does not inject a `MAIL_FROM`. New app reads
  `SMTP_FROM` — see §3.
- Old API surface (`/api/send_otp`, `/api/publish_rule`, etc.) and
  schema (`rules` + `version_history` tables, soft-delete via
  `deleted` column) **do not overlap**. No data migration.

## 8. Follow-up tickets

All filed in Linear, titled `[Backend] …`, assigned to me, in the
**Community-rule** team, **Backlog** state.

1. [**CR-96**](https://linear.app/community-rule/issue/CR-96/backend-bridge-cloudron-env-vars-to-canonical-names)
   — `[Backend] Bridge CLOUDRON_* env vars to canonical names`. No
   admin dependency; can land now.
2. [**CR-97**](https://linear.app/community-rule/issue/CR-97/backend-container-image-registry-choose-build-push)
   — `[Backend] Container image registry: choose, build, push`.
   Depends on registry decision (§5).
3. [**CR-98**](https://linear.app/community-rule/issue/CR-98/backend-cloudron-staging-install-smoke)
   — `[Backend] Cloudron staging install + smoke`. Blocked by CR-96
   + CR-97; needs Cloudron CLI access + staging DNS.
4. [**CR-99**](https://linear.app/community-rule/issue/CR-99/backend-cloudron-production-install-dns-cutover)
   — `[Backend] Cloudron production install + DNS cutover`. Blocked
   by CR-98 green for the agreed overlap window.
5. [**CR-100**](https://linear.app/community-rule/issue/CR-100/backend-steady-state-operator-runbook)
   — `[Backend] Steady-state operator runbook`. Blocked by CR-98
   (we write it after we've actually done it).
6. [**CR-101**](https://linear.app/community-rule/issue/CR-101/backend-decommission-legacy-expressmysql-backend)
   — `[Backend] Decommission legacy Express/MySQL backend`. Blocked
   by CR-99 + sign-off window. Priority: Low.

## 9. Related docs

- [`docs/guides/backend-roadmap.md`](backend-roadmap.md) §11
  (environments) and §8 (Prisma migrations policy).
- [`docs/guides/backend-linear-tickets.md`](backend-linear-tickets.md)
  Ticket 12 / CR-83 — this doc satisfies it.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — local dev setup
  (Postgres, magic-link, draft sync).
