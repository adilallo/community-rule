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
- **No published rules from the old database.** We'll count the existing `rules` table before cutover and decide whether to publish a read-only archive (CSV/JSON) somewhere for anyone looking for their old work.
- **No chatbot.**

## How the cutover will work

Side-by-side, the legacy app keeps running untouched
until the new one is verified.

1. **Staging phase.** New app installed at
   `staging.communityrule.info` (auto-provisioned by Cloudron). Legacy app at the apex is not touched. Quiet testing within MEDLab/stakeholders.
2. **Cutover phase.** When staging is green and we're ready, schedule a low-traffic window. During the window (roughly 5–15 minutes of apex downtime):
   - Take a final backup of the legacy app (Cloudron one-click).
   - Pull a copy of the legacy `rules` table if we decided to publish an archive.
   - Uninstall the legacy app at the apex `communityrule.info`.
   - Move the new app to the apex.
   - Smoke-test, confirm backups are on, done.
3. **Post-cutover.** Legacy backup retained ≥ 90 days as a safety net. Legacy source repos get README pointers to the new app and are archived.

Rollback plan during the window: restore the legacy backup to a scratch Cloudron slot and point DNS back. Realistic only if we discover something genuinely broken in the first few minutes.

## Rough timeline

Roughly this order:

1. **Code prep** — small local change so the app reads Cloudron's injected `CLOUDRON_*` env vars natively. No infra impact.
2. **Build and push the app image** to a container registry.
3. **Install at staging** subdomain, smoke test, soft launch.
4. **Apex cutover window** — the brief downtime above.
5. **Uninstall legacy**, archive legacy repos.
6. **Write the steady-state runbook** based on what actually worked.

Staging should be ready to deploy in 1-2 weeks, and we can go from there.
