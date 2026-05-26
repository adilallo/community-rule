# CommunityRule relaunch

A short high-level summary of what's being built, what it replaces, and how the cutover will work.

## What gets replaced

The existing `CommunityRule` Cloudron app currently hosts three things in one container:

- The static marketing site.
- The Express + MySQL backend (rule drafting, publishing, OTP sign-in).
- A Flask chatbot.

All three retire together when the new app goes live. The chatbot is **not** being migrated or replaced in this stage.

## What the new app is

- A Next.js application with a Postgres database, packaged as a Cloudron app (Docker image + `CloudronManifest.json`).
- Uses Cloudron's **postgresql + sendmail + localstorage** addons.
- Cloudron's built-in container supervisor keeps it running.
- Sign-in changes from 4-digit email **codes** to email **links** ("magic link" authentication). Users click a link in their inbox instead of typing a code.
- One visible process, one port (3000), one health check (`/api/health`), ~512 MiB memory the same footprint as the existing app.

## What does NOT carry over

- **No user accounts.** New sign-ins start fresh.
- **No published rules from the old database.** Pre-cutover rules are exported to a read-only Gitea archive (`CommunityRule/legacy-rules-archive` on `git.medlab.host`); they are not imported into the new app. See [`docs/guides/ops-backend-deploy.md`](guides/ops-backend-deploy.md) §6.1.
- **No chatbot.**

## How the cutover will work

Side-by-side, the legacy app keeps running untouched
until the new one is verified.

1. **Staging phase.** New app installed at
   `staging.communityrule.info` (auto-provisioned by Cloudron). Legacy app at the apex is not touched. Quiet testing within MEDLab/stakeholders.
2. **Cutover phase.** When staging is green and we're ready, schedule a low-traffic window. During the window (roughly 5–15 minutes of apex downtime):
   - Take a final backup of the legacy app (Cloudron one-click).
   - Export the legacy `rules` + `version_history` tables to the Gitea archive (see ops-backend-deploy §6.1).
   - Uninstall the legacy app at the apex `communityrule.info`.
   - Move the new app to the apex.
   - Smoke-test, confirm backups are on, done.
3. **Post-cutover.** Legacy backup retained ≥ 90 days as a safety net. Legacy source repos get README pointers to the new app and are archived.

Rollback plan during the window: restore the legacy backup to a scratch Cloudron slot and point DNS back. Realistic only if we discover something genuinely broken in the first few minutes.

## Rough timeline

Roughly this order:

1. ~~**Code prep** — Cloudron-native env vars (CR-96).~~ **Done.**
2. ~~**Build and push the app image** to Gitea registry (CR-97).~~ **Done**
   (`git.medlab.host/communityrule/community-rule:0.1.0`).
3. **Install at staging** subdomain, smoke test, soft launch (CR-98).
4. **Apex cutover window** — the brief downtime above.
5. **Uninstall legacy**, archive legacy repos.
6. ~~**Write the steady-state runbook** based on what actually worked
   ([`ops-runbook.md`](guides/ops-runbook.md), CR-100).~~ **Done.**

Staging should be ready to deploy in 1-2 weeks, and we can go from there.
