# Steady-state operator runbook

Day-to-day deploy, rollback, and recovery for CommunityRule on MEDLab
Cloudron. Assumes staging or production is already installed and smoke-tested.

> **First-time install, apex cutover, and legacy decommission** live in
> [`ops-backend-deploy.md`](ops-backend-deploy.md). Use this doc once an
> environment is already running.

## 1. Quick reference

| Item | Value |
| ---- | ----- |
| Cloudron dashboard | `https://my.medlab.host` |
| Cloudron CLI login | `cloudron login my.medlab.host` |
| Staging app | `staging.communityrule.info` |
| Production app | `communityrule.info` (after apex cutover) |
| Container image | `git.medlab.host/communityrule/community-rule:<tag>` |
| Health check | `GET /api/health` → `200 {"ok":true,"database":"connected"}` |
| Manifest version | [`CloudronManifest.json`](../../CloudronManifest.json) `version` field (must increase for each release) |
| Current manifest | `0.1.8` at time of writing — always read the file before deploying |

Replace `<app>` below with the Cloudron location (`staging.communityrule.info`
or `communityrule.info`).

## 2. Prerequisites (one-time per operator)

1. **Cloudron access** — admin login on `my.medlab.host` and a CLI API token
   (*Profile → API Tokens* on the dashboard). Save the token in 1Password.
2. **Cloudron CLI** — logged in:
   ```bash
   cloudron login my.medlab.host
   ```
3. **Docker + buildx** — Docker Desktop or equivalent with `docker buildx`.
4. **Gitea registry auth** — personal access token on `git.medlab.host` with
   `read:package` + `write:package`; then:
   ```bash
   docker login git.medlab.host
   ```
5. **Repo checkout** — clone
   [`CommunityRule/community-rule`](https://git.medlab.host/CommunityRule/community-rule)
   and work from a clean commit that matches the release you intend to ship.

Images are **`linux/amd64` only** (Cloudron host is x86_64). On Apple
Silicon, the release script still builds amd64 via buildx; a bare
`docker pull` without `--platform linux/amd64` failing on arm64 is expected.

## 3. Deploy a new version

Typical release flow: bump manifest → build/push image → `cloudron update`
→ smoke.

### 3.1 Build and push

1. Check out the commit to release (`main` or a release branch).
2. **Bump** [`CloudronManifest.json`](../../CloudronManifest.json) `version`
   (e.g. `0.1.8` → `0.1.9`). Cloudron requires the manifest version to
   **increase** for `cloudron update --image` to be accepted.
3. From the repo root, build and push (tag should match the manifest version
   for sanity):

   ```bash
   TAG=0.1.9 ./scripts/docker-release.sh
   # equivalent:
   TAG=0.1.9 npm run docker:release
   ```

   Omit `TAG=` to push `git rev-parse --short HEAD` instead — only do that
   for ad-hoc staging experiments; production releases should use semver tags
   aligned with the manifest.

4. **Verify anonymous pull** (simulates Cloudron):
   ```bash
   docker logout git.medlab.host
   docker pull --platform linux/amd64 \
     git.medlab.host/communityrule/community-rule:0.1.9
   ```

5. **Commit the manifest bump** in git alongside the code that shipped in
   this build.

Registry details and one-time Gitea setup: [`ops-backend-deploy.md` §9](ops-backend-deploy.md#9-build-and-push-image-workflow).

### 3.2 Update Cloudron

```bash
cloudron update --app staging.communityrule.info \
  --image git.medlab.host/communityrule/community-rule:0.1.9
```

Use `communityrule.info` for production. Cloudron pulls the image (no registry
credentials on the host), restarts the container, and runs
[`scripts/start.sh`](../../scripts/start.sh), which:

1. `chown`s `/app/data` (localstorage mount),
2. runs **`prisma migrate deploy`**,
3. execs the Next.js standalone server.

Watch the app **Logs** tab in the Cloudron dashboard for a clean migration and
`Listening on port 3000`.

### 3.3 Migrations

**Normal case:** migrations apply automatically on container start — no
separate step.

**Manual re-run** (only if debugging a failed deploy or verifying before
traffic):

```bash
cloudron exec --app staging.communityrule.info -- npm run db:deploy
```

(`npm run db:deploy` → `prisma migrate deploy`.)

**Policy:** never run `prisma migrate reset` against staging or production.
Never edit migration files already applied to a shared database. Fix schema
drift by adding a **new** migration locally (`prisma migrate dev`) and
deploying a new image. See [`backend-roadmap.md` §8](backend-roadmap.md#8-prisma-migrations-policy).

### 3.4 Seed data (not every deploy)

Template + facet seed (`MethodFacet` rows for create-flow “Recommended” tags)
is **not** applied at boot. Run once per environment after first install, or
when recommendations return all-zero scores:

```bash
cloudron exec --app staging.communityrule.info -- \
  node prisma/seed.bundle.cjs
```

Re-running is safe (idempotent upserts). JSON lives at `/app/seed-data/` in
the image — not under `/app/data` (Cloudron localstorage overwrites that
mount).

### 3.5 Smoke after deploy

**Automated** (from your laptop, repo root):

```bash
./scripts/staging-smoke.sh staging.communityrule.info
# production:
./scripts/staging-smoke.sh communityrule.info

# optional — exercises magic-link request (check inbox manually):
EMAIL=you@example.com ./scripts/staging-smoke.sh staging.communityrule.info
```

**Manual** (still required for full acceptance):

- Click a magic link → signed in → `GET /api/auth/session` returns a user.
- Publish a rule end-to-end → public detail page loads.
- Optional: Save & Exit draft sync; upload with `UPLOAD_ROOT` set.

Full checklist and failure table: [`ops-backend-deploy.md` §10](ops-backend-deploy.md).

## 4. Roll back (code-only)

To revert application code without touching the database:

```bash
cloudron update --app staging.communityrule.info \
  --image git.medlab.host/communityrule/community-rule:<previous-tag>
```

Pick a tag you know was healthy (previous manifest version or git tag recorded
at last good deploy).

**Database implications:**

- Rolling back the **image** does **not** undo migrations already applied.
- If the bad release added a migration, rolling back to an older image may
  leave the DB schema **ahead** of what that code expects — usually safe if
  the migration was additive (new nullable columns, new tables).
- If the bad release broke because of a **destructive or incompatible**
  migration, do **not** reset production. Restore from a Cloudron backup
  (§5) or fix forward with a corrective migration.

**Never** `prisma migrate reset` on staging or production.

## 5. Restore drill (quarterly)

Verify Cloudron backups are restorable without touching the live app.

**Cadence:** at least once per quarter, or after any backup-policy change.

**Steps:**

1. In the Cloudron dashboard, pick a recent automatic backup of
   `<app>` (*Backups* tab).
2. **Restore to a scratch location** — e.g.
   `restore-drill-YYYYMMDD.communityrule.info` — not over the live app.
3. After restore completes, confirm the container starts and migrations are
   current:
   ```bash
   curl -sS "https://restore-drill-YYYYMMDD.communityrule.info/api/health"
   ```
   Expect `200` with `"database":"connected"`.
4. Optional: `cloudron exec --app restore-drill-YYYYMMDD.communityrule.info -- npm run db:deploy`
   if logs show pending migrations on an older snapshot.
5. Run `./scripts/staging-smoke.sh restore-drill-YYYYMMDD.communityrule.info`.
6. **Uninstall** the scratch app when done.

Record the drill date and outcome in your ops notes. Cloudron retains
automatic backups per platform defaults; confirm retention in the dashboard.

## 6. Single-instance limitations

The current Cloudron deploy runs **one container per environment**. Do not
scale to multiple app instances without addressing these per-process limits:

### 6.1 In-memory rate limiter

[`lib/server/rateLimit.ts`](../../lib/server/rateLimit.ts) stores windows in
process memory. Limits apply **per container**, not globally across instances.

| Route / action | Key | Min interval |
| -------------- | --- | ------------ |
| Magic-link request | per email | 60 s |
| Magic-link request | per IP | 20 s |
| Email change request | per email / IP / user | 60 s |
| Organizer inquiry | per email / IP | 60 s / 20 s |
| Publish with stakeholder invites | per IP | 60 s |
| Stakeholder add / resend | per IP / invite | 60 s |
| File upload | per user | 5 s |

Before horizontal scale-out, replace with a shared store (e.g. Redis) or edge
rate limits. See [`backend-roadmap.md` §5](backend-roadmap.md#5-session-and-authentication-v1).

### 6.2 Web vitals storage

Production defaults to **`external`** mode: vitals are structured log lines, not
written to Postgres or local files. Setting `WEB_VITALS_STORAGE=local` uses a
**per-process** file store under `.next/web-vitals` — suitable for dev/admin
only, not multi-instance. See [`backend-roadmap.md` §7](backend-roadmap.md#7-api-responses-errors-and-observability).

## 7. Environment variables (steady-state)

Cloudron **auto-injects** addon vars (`CLOUDRON_POSTGRESQL_URL`,
`CLOUDRON_MAIL_SMTP_*`). Operators set these manually once per app; they
persist across image updates unless changed:

| Variable | Purpose |
| -------- | ------- |
| `SESSION_SECRET` | Session cookie signing (≥ 16 chars). Rotating logs everyone out. |
| `SMTP_FROM` | Visible From on sign-in emails (e.g. `Community Rule <hello@communityrule.info>`). |
| `NEXT_PUBLIC_ENABLE_BACKEND_SYNC` | `true` in staging/production — Postgres draft persistence. |
| `UPLOAD_ROOT` | `/app/data/uploads` on Cloudron — required for file uploads. |

Full detail: [`ops-backend-deploy.md` §3](ops-backend-deploy.md#3-environment-variables).

## 8. Troubleshooting

| Symptom | Likely cause | Action |
| ------- | ------------ | ------ |
| Image pull error on update | Private repo, wrong tag, or amd64 manifest missing | Confirm repo is public; verify pull with `--platform linux/amd64` (§3.1) |
| Health `503` / `database: disconnected` | Postgres addon or `CLOUDRON_POSTGRESQL_URL` missing | Cloudron app → Environment |
| Container crash on start | Migration failure | App logs around `prisma migrate deploy`; fix forward with new migration |
| Magic link not sent | Mail addon or `SMTP_FROM` | Cloudron mail logs; `CLOUDRON_MAIL_SMTP_*` vars |
| Upload `server_misconfigured` | `UPLOAD_ROOT` unset | `cloudron env set --app <app> UPLOAD_ROOT=/app/data/uploads` |
| No “Recommended” on method cards | Seed not run | §3.4 — `node prisma/seed.bundle.cjs` |
| Rate limit too aggressive after deploy | Expected per §6.1 | Single instance only; limits reset on container restart |

App logs: Cloudron dashboard → *Logs* tab, or `cloudron logs --app <app> -f`.

## 9. Related docs

- [`ops-backend-deploy.md`](ops-backend-deploy.md) — first install, cutover
  plan, legacy rules archive, build/push deep dive.
- [`backend-roadmap.md`](backend-roadmap.md) — migrations policy (§8),
  rate limiting (§5), environments (§11).
- [`../relaunch-brief.md`](../relaunch-brief.md) — plain-language summary
  for MEDLab admin.
- [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) — local dev setup.
