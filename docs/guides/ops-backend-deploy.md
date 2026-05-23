# Backend deploy — admin handoff + cutover plan

This doc captures everything needed to deploy the new CommunityRule
(Next.js + Postgres) onto MEDLab's Cloudron and replace the legacy
LAMP-packaged service at `communityrule.info`. Cloudron admin access
has been granted, CR-96 (Cloudron-native env vars) and CR-97 (container
registry + first image push) are done; the remaining gate is
[CR-98](https://linear.app/community-rule/issue/CR-98/backend-cloudron-staging-install-smoke)
(staging install + smoke — §10).

> **For a plain-language summary to hand to MEDLab's Cloudron admin,
> see [`../relaunch-brief.md`](../relaunch-brief.md).** This doc is the
> technical version.

## 1. Context

- This app **fully replaces** the existing `communityrule.info`
  service — both the marketing site and the backend API.
- The existing service is a single Cloudron **LAMP** app
  (`lamp.cloudronapp.php74@5.1.2`, installed at the
  `communityrule.info` apex, 512 MiB) that hosts three things stuffed
  into one container under `/app/data/public/`:
  1. The static **marketing site** (HTML / CSS / images).
  2. The **Express/MySQL backend** at
     [`CommunityRule/CommunityRuleBackend`](https://git.medlab.host/CommunityRule/CommunityRuleBackend),
     kept alive by a 30-min `lsof`-based `run.sh` watchdog on port
     3000. MySQL is the LAMP package's bundled MySQL, persisted
     inside `/app/data` (not a Cloudron addon).
  3. A **Flask chatbot** at
     [`CommunityRule/CommunityRuleChatBot`](https://git.medlab.host/CommunityRule/CommunityRuleChatBot)
     on port 5000, also watchdog-supervised; currently crash-looping
     with `ModuleNotFoundError: No module named 'flask'` and last
     touched in May 2024. **Not migrated.** Dies with the LAMP
     container at decommission.
- The new app is a **properly packaged Cloudron app** (Docker image +
  `CloudronManifest.json`, postgresql + sendmail + localstorage
  addons). Cloudron's container supervisor replaces the watchdog.
- **Greenfield Postgres.** No data migration from the LAMP container's
  internal MySQL. Old auth (4-digit OTP in `email_otp`) is replaced
  by hashed magic-link tokens. Old API and `rules` /
  `version_history` tables do not map to anything in the new app.

## 2. Access — granted

Cloudron admin login on `cloud.medlab.host` granted. From the
dashboard the deployer can self-serve:

- [x] **Cloudron admin login** (full admin on the MEDLab instance).
- [x] **DNS for `communityrule.info`** — domain is managed inside
      Cloudron, so new subdomains and TLS certs are one-click.
- [x] **App log access** — Cloudron web log viewer.
- [x] **Read of legacy app config** — visible in admin UI.
- [ ] **`cloudron` CLI token** — generate at *Profile → API Tokens*
      before first install. Save in 1Password.

## 3. Environment variables

### Cloudron auto-injects (provisioned by addons declared in `CloudronManifest.json`)

Cloudron addons are not "enabled" platform-wide; they are requested
per-app in the manifest and provisioned at install time.

- `CLOUDRON_POSTGRESQL_URL` — from the **postgresql** addon. The app
  reads this name directly (Prisma + [`lib/server/env.ts`](../../lib/server/env.ts)).
- `CLOUDRON_MAIL_SMTP_SERVER` / `_PORT` / `_USERNAME` / `_PASSWORD` —
  from the **sendmail** addon. The platform Mail server is configured
  for `communityrule.info` with **Amazon SES relay** + "allow custom
  from address" on, so `SMTP_FROM` of our choice will deliver. The app
  assembles a Nodemailer transport URL from these four vars in
  [`lib/server/env.ts`](../../lib/server/env.ts).

### I set manually via `cloudron configure --app <id> --set-env`

- `SESSION_SECRET` — long random (`openssl rand -hex 32`). Required,
  ≥ 16 chars. Rotating it logs everyone out.
- `SMTP_FROM` — visible "From:" address on sign-in emails. Cloudron
  does not inject this. Use `hello@communityrule.info` (continuity
  with the legacy service; SES relay accepts it).
- `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` — turns on Postgres draft
  persistence for signed-in users. Required in production.
- `UPLOAD_ROOT` — absolute path to a writable directory on the Cloudron
  **localstorage** mount for `POST /api/uploads` (community photo +
  custom-method attachments). Use **`/app/data/uploads`** on Cloudron
  (`start.sh` chowns `/app/data` for the `node` user). When unset, upload
  routes return `server_misconfigured`. See [CONTRIBUTING.md](../../CONTRIBUTING.md)
  API table.

## 4. Platform settings

- Container `httpPort`: **3000** (matches [`Dockerfile`](../../Dockerfile)
  `ENV PORT=3000`).
- Health-check path: **`/api/health`**
  ([`app/api/health/route.ts`](../../app/api/health/route.ts) returns
  `200 {"ok":true,"database":"connected"}` when healthy, `503`
  otherwise).
- Memory limit: **768 MiB** in
  [`CloudronManifest.json`](../../CloudronManifest.json) (`memoryLimit:
  805306368`). The legacy LAMP app ran at 512 MiB; raise further only if
  Next.js standalone OOMs under load.
- Backups: Cloudron's automatic backups are already on for the host
  (legacy app shows weekly snapshots ~451 MB each). Same default
  applies to new apps.
- TLS / DNS / SPF / DKIM: handled by Cloudron for any subdomain of
  `communityrule.info`.

## 5. Cutover plan (side-by-side, never in-place)

The legacy app is at the apex `communityrule.info` and is still
serving real traffic. Best practice is **side-by-side cutover** — new
app gets validated at a fresh subdomain before any swap touches the
apex.

### Phases

1. **Staging install** — from a checkout whose
   [`CloudronManifest.json`](../../CloudronManifest.json) matches the pushed
   image tag, run `cloudron install --location staging.communityrule.info`.
   Cloudron reads `dockerimage` from the manifest (no `--image` flag). Set
   manual env vars from §3. `prisma migrate deploy` runs automatically in
   [`scripts/start.sh`](../../scripts/start.sh) on container start. Smoke per
   [CR-98](https://linear.app/community-rule/issue/CR-98/backend-cloudron-staging-install-smoke)
   (§12).
2. **Soft launch / acceptance** — share the staging URL with a small
   group, exercise sign-in + publish + draft sync end-to-end. Hold
   here until confident.
3. **Apex cutover at a scheduled low-traffic window** — this is the
   only step with brief downtime (~5–15 min). Sequence:
   1. Take one final manual backup of the legacy LAMP app (Cloudron
      *Backups* tab → *Backup now*).
   2. `cloudron uninstall` the legacy app at `communityrule.info`.
   3. `cloudron configure --location communityrule.info` to move the
      validated staging install to the apex (or `cloudron install`
      fresh at apex if cleaner).
   4. Re-run `prisma migrate deploy`, re-set production env vars if
      not preserved by the move, smoke again.
4. **Decommission** — see [CR-101](https://linear.app/community-rule/issue/CR-101/backend-decommission-legacy-expressmysql-backend).
   Hold the final LAMP backup ≥ 90 days for safety.

### Why not in-place?

Uninstalling the legacy app and installing the new one at apex
without a staging step means the live site is down for the entire
duration of the first install — and the first install is exactly when
all the env-var / addon / port surprises happen. Side-by-side keeps
those surprises out of view.

## 6. Decisions — status

Product decisions (closed):

1. **Final URL — `communityrule.info` apex.** New app fully replaces
   the legacy site, including the marketing surface. Brief cutover
   downtime (~5–15 min) is accepted.
2. **Legacy `rules` data — not migrated.** No data moves into the new
   app's Postgres. A pre-cutover **read-only export** of the
   `rules` + `version_history` MySQL tables is under consideration;
   approach depends on the actual row count, which we'll pull as
   part of the CR-99 pre-cutover backup. Tracked in
   [CR-102](https://linear.app/community-rule/issue/CR-102/backend-decide-fate-of-legacy-rules-table-read-only-export).

Infra decision closed:

3. **Container registry — Gitea Container Registry on `git.medlab.host`.**
   Same host as Cloudron (`193.46.198.90`). The
   [`CommunityRule/community-rule`](https://git.medlab.host/CommunityRule/community-rule)
   repo must be **public** so the container package inherits public visibility
   (Gitea does not expose per-package visibility toggles — visibility follows
   the owning repo). Public pull sidesteps the [same-host docker-login
   "socket hangup"
   bug](https://forum.cloudron.io/topic/14572/private-docker-registry-in-cloudron),
   so Cloudron pulls without credentials. Push auth from operator laptops uses
   a Gitea personal access token (`read:package` + `write:package`). Canonical
   image ref: `git.medlab.host/communityrule/community-rule:<tag>`. Images are
   built **`linux/amd64` only** (Cloudron host is x86_64). Operator build/push
   workflow lives in [§9](#9-build-and-push-image-workflow). First verified
   image: `…:0.1.0` (digest
   `sha256:e652f9f4bfa4154412cc9d8b63d55c94a128e8935579d101b5ab8977e2080e52`).
   Tracked in [CR-97](https://linear.app/community-rule/issue/CR-97/backend-container-image-registry-choose-build-push)
   (**Done**). Fallback if same-host pull ever breaks: install the **Cloudron
   Container Registry** app and re-tag against its hostname; no other changes
   required.

## 7. Old vs new deltas

So nothing surprises anyone at cutover:

- Legacy is a **LAMP package** with bundled MySQL inside the
  container. New app uses the Cloudron **postgresql + sendmail +
  localstorage** addons — entirely different storage, no shared
  state.
- Legacy stuffs three apps (marketing + Node backend + Python
  chatbot) into one container with a `run.sh` watchdog. New app is
  one Next.js process, supervised by Cloudron natively.
- Old auth = plaintext 4-digit OTP. New auth = hashed magic **link**
  in email. If users report "I'm not getting a code," remind them to
  look for a link instead.
- Old code hardcoded `from: 'hello@communityrule.info'` in
  [`controllers/emailController.js`](https://git.medlab.host/CommunityRule/CommunityRuleBackend/raw/branch/master/controllers/emailController.js)
  because Cloudron does not inject a `MAIL_FROM`. New app reads
  `SMTP_FROM` — see §3.
- Old API surface (`/api/send_otp`, `/api/publish_rule`, etc.) and
  schema (`rules` + `version_history` tables, soft-delete via
  `deleted` column) **do not overlap** with the new app. No data
  migration.
- The Flask chatbot at
  [`CommunityRule/CommunityRuleChatBot`](https://git.medlab.host/CommunityRule/CommunityRuleChatBot)
  is currently crash-looping inside the LAMP container and is **not
  being migrated** — confirmed with admin. It dies when the LAMP
  container is uninstalled in [CR-101](https://linear.app/community-rule/issue/CR-101/backend-decommission-legacy-expressmysql-backend).

## 8. Follow-up tickets

All filed in Linear, titled `[Backend] …`, assigned to me, in the
**Community-rule** team, **Backlog** state.

1. [**CR-96**](https://linear.app/community-rule/issue/CR-96/backend-bridge-cloudron-env-vars-to-canonical-names)
   — `[Backend] Cloudron-native env vars` (**Done** — app reads
   `CLOUDRON_POSTGRESQL_URL` and `CLOUDRON_MAIL_SMTP_*` only).
2. [**CR-97**](https://linear.app/community-rule/issue/CR-97/backend-container-image-registry-choose-build-push)
   — `[Backend] Container image registry: choose, build, push` (**Done**).
   Registry decided (§6.3); packaging + build/push workflow shipped (§9).
   First image pushed and verified via anonymous `docker pull` (§9).
3. [**CR-98**](https://linear.app/community-rule/issue/CR-98/backend-cloudron-staging-install-smoke)
   — `[Backend] Cloudron staging install + smoke` at
   `staging.communityrule.info`. **Next** — checklist in §10. Requires
   Cloudron CLI token (§2) only; CR-96 and CR-97 are done.
4. [**CR-99**](https://linear.app/community-rule/issue/CR-99/backend-cloudron-production-install-apex-cutover)
   — `[Backend] Cloudron production install + apex cutover`.
   Side-by-side cutover at scheduled low-traffic window per §5.
   Blocked by CR-98 green + CR-102 resolved.
5. [**CR-100**](https://linear.app/community-rule/issue/CR-100/backend-steady-state-operator-runbook)
   — `[Backend] Steady-state operator runbook`. Blocked by CR-98
   (write what we actually did).
6. [**CR-101**](https://linear.app/community-rule/issue/CR-101/backend-decommission-legacy-communityrule-lamp-app)
   — `[Backend] Decommission legacy CommunityRule LAMP app`.
   Uninstall the entire LAMP slot (marketing + Express backend +
   chatbot in one go); preserve final backup ≥ 90 days. Blocked by
   CR-99 + sign-off window. Priority: Low.
7. [**CR-102**](https://linear.app/community-rule/issue/CR-102/backend-decide-fate-of-legacy-rules-table-read-only-export)
   — `[Backend] Decide fate of legacy rules table (read-only export?)`.
   Count rows + decide whether to publish a static archive before
   CR-99 uninstalls the legacy MySQL. Priority: Low.

## 9. Build and push image workflow

The repo is packaged as a Cloudron app via
[`CloudronManifest.json`](../../CloudronManifest.json),
[`Dockerfile`](../../Dockerfile),
[`scripts/start.sh`](../../scripts/start.sh), and
[`scripts/docker-release.sh`](../../scripts/docker-release.sh). The
manifest declares `httpPort 3000`, `healthCheckPath /api/health`,
`memoryLimit 768 MiB`, `minBoxVersion 9.0.0`, and the
`postgresql + sendmail + localstorage` addons. The Dockerfile reuses
the base image's `node` user (uid 1000), installs `gosu` for the
privilege drop, and symlinks `.next/cache → /tmp/next-cache` so
Next.js ISR works on Cloudron's read-only rootfs. `start.sh` runs as
root to chown `/app/data` (localstorage mount), then drops to
`node:node`, applies `prisma migrate deploy`, and execs the Next.js
standalone server.

### One-time setup (per operator)

1. **Generate a Gitea PAT.** In Gitea web UI: avatar → Settings →
   Applications → Manage Access Tokens → Generate New Token. Check
   `read:package` and `write:package`. Save in 1Password.
2. **`docker login git.medlab.host`** with your Gitea username and the
   PAT as password. Expect `Login Succeeded`.
3. Confirm you have package-write rights on the `CommunityRule` org
   (you do if you can push commits to the repo).

### Per-release workflow

1. **Bump the manifest version.** Edit
   [`CloudronManifest.json`](../../CloudronManifest.json):
   - increment `version` (e.g. `0.1.0` → `0.1.1`) — Cloudron requires
     it to **increase** for `cloudron update --image` to be accepted;
   - update `dockerimage` to the tag you're about to push (default tag
     is the git short SHA).
2. **Run the release script** from the repo root:

   ```bash
   ./scripts/docker-release.sh
   # or, equivalently:
   npm run docker:release
   ```

   Override the tag with `TAG=v0.1.1 ./scripts/docker-release.sh` for
   semver releases. The script prints the exact `dockerimage` line to
   paste back into the manifest.
3. **First push only:** confirm the
   [`CommunityRule/community-rule`](https://git.medlab.host/CommunityRule/community-rule)
   repo is **Public** (Settings → General). Gitea inherits container-package
   visibility from the repo — there is no per-package visibility toggle. Org
   owners are not required if you have repo-admin rights on this repo.
4. **Verify the pull works without credentials** (simulates Cloudron's
   anonymous pull):

   ```bash
   docker logout git.medlab.host
   # Image is linux/amd64 only. On Apple Silicon, add --platform:
   docker pull --platform linux/amd64 git.medlab.host/communityrule/community-rule:<tag>
   ```

   A bare `docker pull` on arm64 Macs fails with "no matching manifest for
   linux/arm64" — that is expected and does **not** indicate an auth problem.
   Cloudron (x86_64) pulls the amd64 manifest without `--platform`.

5. **Commit the manifest change** alongside any code changes that
   shipped in this build, so the manifest and image stay in lockstep.

### Install / update on Cloudron

From the repo dir on the operator's machine, with `cloudron` CLI
logged in to `cloud.medlab.host`:

```bash
# First install (staging):
cloudron install --location staging.communityrule.info

# Subsequent updates:
cloudron update --app <app-id>
```

`cloudron install` reads `dockerimage` from
[`CloudronManifest.json`](../../CloudronManifest.json); no `--image`
flag needed.

### CI — deferred (stretch goal)

CR-97 acceptance lists a stretch goal of building and pushing on merge
to `main` via Gitea Actions. Deferred: no hosted runners are available
today, and the manual workflow above is acceptable for v1 staging and
production. Revisit when runners return or when release cadence
justifies the runner cost.

## 10. Staging install + smoke (CR-98)

**Goal:** Install the pushed image at `staging.communityrule.info`, configure
production env vars, and verify the vertical slice before apex cutover
([CR-99](https://linear.app/community-rule/issue/CR-99/backend-cloudron-production-install-apex-cutover)).

**Prerequisites (all satisfied unless noted):**

- [x] **CR-96** — app reads `CLOUDRON_POSTGRESQL_URL` and
      `CLOUDRON_MAIL_SMTP_*` only ([`lib/server/env.ts`](../../lib/server/env.ts),
      [`prisma/schema.prisma`](../../prisma/schema.prisma)). No `DATABASE_URL` /
      `SMTP_URL` shim.
- [x] **CR-97** — image pushed to
      `git.medlab.host/communityrule/community-rule:0.1.0` (or current tag in
      manifest); repo is **public**; anonymous amd64 pull verified (§9).
- [ ] **Cloudron CLI token** — generate at *Profile → API Tokens* on
      `cloud.medlab.host`; save in 1Password (§2).
- [x] **Cloudron admin login** on `cloud.medlab.host` (§2).
- [x] **DNS** — `communityrule.info` managed in Cloudron; staging subdomain
      will be provisioned at install time.

**Install steps:**

1. **Checkout** a commit whose [`CloudronManifest.json`](../../CloudronManifest.json)
   `version`, `dockerimage`, and `memoryLimit` match the image you intend to
   run (currently `0.1.0` →
   `git.medlab.host/communityrule/community-rule:0.1.0`).
2. **Log in to Cloudron CLI:**
   ```bash
   cloudron login cloud.medlab.host
   ```
3. **Install** from the repo root (manifest is read automatically):
   ```bash
   cloudron install --location staging.communityrule.info
   ```
   Cloudron provisions **postgresql**, **sendmail**, and **localstorage**
   addons from the manifest, pulls the image (no registry credentials needed),
   and starts the container. `scripts/start.sh` chowns `/app/data`, runs
   `prisma migrate deploy`, then execs the Next.js server.
4. **Set manual env vars** (Cloudron does not inject these):
   ```bash
   cloudron configure --app <app-id> --set-env \
     SESSION_SECRET="$(openssl rand -hex 32)" \
     SMTP_FROM="Community Rule <hello@communityrule.info>" \
     NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true \
     UPLOAD_ROOT=/app/data/uploads
   ```
   Rotating `SESSION_SECRET` logs everyone out. `SMTP_FROM` must be an address
   SES accepts on `communityrule.info` (platform mail addon is SES-relayed with
   custom-from allowed — §3).
5. **Confirm the app is running** in the Cloudron dashboard (Logs tab). Look
   for a clean `prisma migrate deploy` and Next.js listening on port 3000.

**Smoke checklist (acceptance):**

- [ ] **Health:** `curl -sS https://staging.communityrule.info/api/health`
      returns `200` with `{"ok":true,"database":"connected"}`.
- [ ] **Magic link:** request sign-in from the UI → email arrives at a real
      inbox → click link → land signed in →
      `GET /api/auth/session` returns a user. Confirm the link host matches
      `staging.communityrule.info` (reverse proxy / `Host` alignment).
- [ ] **Publish:** complete create flow → publish a rule → public rule detail
      loads.
- [ ] **Draft sync (optional):** signed-in Save & Exit persists to Postgres;
      resume works after re-login.
- [ ] **Upload (optional):** with `UPLOAD_ROOT` set, attach a community photo
      in create flow and confirm it renders after publish.

**If something fails:**

| Symptom | Likely cause | Check |
| ------- | ------------ | ----- |
| Image pull error on install | Repo still private, or wrong tag in manifest | §6.3; `docker pull --platform linux/amd64 …` from laptop |
| Health `503` / `database: disconnected` | Postgres addon not provisioned or URL missing | Cloudron app → Environment; expect `CLOUDRON_POSTGRESQL_URL` |
| Magic link not sent | Mail addon or `SMTP_FROM` | Cloudron mail logs; `CLOUDRON_MAIL_SMTP_*` vars |
| Upload `server_misconfigured` | `UPLOAD_ROOT` unset | Set to `/app/data/uploads` (§3) |
| Container crash on start | Migration failure | App logs around `prisma migrate deploy` |

**Done when:** all smoke checklist items pass. Then proceed to soft-launch
(§5 phase 2) and, when ready, [CR-99](https://linear.app/community-rule/issue/CR-99/backend-cloudron-production-install-apex-cutover)
apex cutover.

## 11. Rate limiting (single-instance deploys)

The app uses an **in-memory** rate limiter in [`lib/server/rateLimit.ts`](../../lib/server/rateLimit.ts) (magic-link requests, organizer inquiry, etc.). This is sufficient for the current **single Cloudron container** per environment.

**Before horizontal scale-out** (multiple app instances behind a load balancer), replace or back the limiter with a shared store (e.g. Redis) so per-IP / per-user windows apply across instances. Until then, document expected limits in the steady-state runbook ([CR-100](https://linear.app/community-rule/issue/CR-100/backend-steady-state-operator-runbook)).

## 12. Related docs

- [`docs/guides/backend-roadmap.md`](backend-roadmap.md) §11
  (environments) and §8 (Prisma migrations policy).
- [`docs/guides/backend-linear-tickets.md`](backend-linear-tickets.md)
  Ticket 12 / CR-83 — this doc satisfies it.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — local dev setup
  (Postgres, magic-link, draft sync).
