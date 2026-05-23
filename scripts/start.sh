#!/bin/sh
# Container entrypoint for Cloudron.
# Runs as root so we can chown the runtime volume mount, then drops to the
# node user (uid 1000) for the application process.

set -e

# Bridge Cloudron's env name to Prisma's expected name so `prisma migrate
# deploy` works before CR-96 lands the in-app DATABASE_URL bridging.
export DATABASE_URL="${DATABASE_URL:-$CLOUDRON_POSTGRESQL_URL}"

# /app/data is created at runtime by Cloudron's localstorage addon as
# root:root; chown so the node user can write uploads.
chown -R node:node /app/data

# Next.js ISR cache lives at /app/.next/cache via a symlink baked into the
# Dockerfile. The target on /tmp is writable on Cloudron's read-only rootfs.
mkdir -p /tmp/next-cache
chown -R node:node /tmp/next-cache

# Drop privileges, apply any pending migrations, then exec the server.
# Inner `exec` ensures SIGTERM from Cloudron reaches node for clean shutdown.
exec gosu node:node sh -c \
  './node_modules/.bin/prisma migrate deploy && exec node server.js'
