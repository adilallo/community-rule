# Production image: Next.js standalone output + Prisma, packaged for Cloudron.
# Build / push:  ./scripts/docker-release.sh
# Install:       cloudron install    (reads CloudronManifest.json from repo root)
# See docs/guides/ops-backend-deploy.md §9.

FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
# Copy the Prisma schema so the project's `postinstall` (which runs
# `prisma generate`) succeeds during install.
COPY prisma ./prisma
# `npm install` rather than `npm ci`:
#   1. `npm ci` strictly validates the lockfile and refuses when sub-tree
#      resolutions drift (a recurring nuisance because the lockfile is
#      generated on darwin-arm64 by default).
#   2. `npm install` reuses the lockfile when it can but tolerates
#      platform-specific reshuffles for Linux-only optional deps
#      (`lightningcss-linux-*-gnu`, `@tailwindcss/oxide-linux-*-gnu`,
#      `@next/swc-linux-*-gnu`, etc.) that Next.js needs at build time.
RUN npm install --no-audit --fund=false

FROM base AS builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
# openssl: Prisma engines. gosu: privilege drop in start.sh after chown.
RUN apt-get update -y && apt-get install -y openssl gosu && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production

# Reuse the `node` user (uid/gid 1000) shipped in node:20-bookworm-slim.
# Cloudron's localstorage addon mounts /app/data with root:root ownership at
# runtime; start.sh chowns it to node:node before dropping privileges.

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/prisma ./prisma

# Prisma CLI (devDependency) is not in the Next.js standalone trace. Install
# globally in the runner so start.sh can run `prisma migrate deploy` and the
# one-time idempotent `prisma db seed` (upserts by slug).
RUN npm install -g prisma@6.19.3 tsx@4.19.4

# Cloudron's runtime rootfs is read-only except /tmp, /run, /app/data.
# Three marketing routes use ISR (`revalidate`) and write to .next/cache;
# redirect that path to /tmp/next-cache via a baked-in symlink so writes land
# on a writable mount at runtime.
RUN mkdir -p .next && ln -sfn /tmp/next-cache .next/cache

COPY --chown=node:node scripts/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["/start.sh"]
