#!/bin/sh
# Container entrypoint for Cloudron.
# Runs as root so we can chown the runtime volume mount, then drops to the
# node user (uid 1000) for the application process.

set -e

# /app/data is created at runtime by Cloudron's localstorage addon as
# root:root; chown so the node user can write uploads.
# Prisma reads `CLOUDRON_POSTGRESQL_URL` directly via `prisma/schema.prisma`
# (`datasource db { url = env("CLOUDRON_POSTGRESQL_URL") }`), so no DATABASE_URL
# bridging is needed in this script — the app code reads the same var via
# `lib/server/env.ts`.
chown -R node:node /app/data

# Next.js ISR cache lives at /app/.next/cache via a symlink baked into the
# Dockerfile. The target on /tmp is writable on Cloudron's read-only rootfs.
mkdir -p /tmp/next-cache
chown -R node:node /tmp/next-cache

# Drop privileges, apply any pending migrations, then exec the server.
# Inner `exec` ensures SIGTERM from Cloudron reaches node for clean shutdown.
exec gosu node:node sh -c \
  'prisma migrate deploy && prisma db seed && exec node server.js'
