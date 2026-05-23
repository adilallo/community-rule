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
# --ignore-scripts: skips the project `postinstall` (`npm rebuild lightningcss
# && prisma generate`). The Prisma schema is not yet present in this stage;
# the builder stage runs `prisma generate` after `COPY . .`.
RUN npm ci --no-audit --fund=false --ignore-scripts

FROM base AS builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
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

# Prisma CLI is in devDependencies and is not included in the Next.js
# standalone output. Copy it explicitly so start.sh can run migrations.
COPY --from=builder --chown=node:node /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=node:node /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

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
