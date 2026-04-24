#!/usr/bin/env bash
# Ephemeral Postgres on host 5433, prisma migrate deploy, verify, teardown.
set -euo pipefail

PG_HOST_PORT="${PG_HOST_PORT:-5433}"
POSTGRES_USER="${POSTGRES_USER:-communityrule}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-communityrule}"
POSTGRES_DB="${POSTGRES_DB:-communityrule}"
CONTAINER_NAME="${CONTAINER_NAME:-migrate-smoke-pg}"
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${PG_HOST_PORT}/${POSTGRES_DB}"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

echo "→ Starting throwaway Postgres on 127.0.0.1:${PG_HOST_PORT} (container: ${CONTAINER_NAME})"
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run -d --name "$CONTAINER_NAME" \
  -e "POSTGRES_USER=$POSTGRES_USER" \
  -e "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" \
  -e "POSTGRES_DB=$POSTGRES_DB" \
  -p "${PG_HOST_PORT}:5432" \
  postgres:16-alpine

echo "→ Waiting for Postgres..."
for i in {1..30}; do
  if docker exec "$CONTAINER_NAME" pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
    echo "→ Postgres ready after ${i}s"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Postgres did not become ready in 30s" >&2
    docker logs "$CONTAINER_NAME" || true
    exit 1
  fi
  sleep 1
done

echo "→ prisma migrate deploy"
npm run db:deploy

echo "→ Verifying connection (SELECT 1)"
echo "SELECT 1;" | npx --no-install prisma db execute --stdin --url "$DATABASE_URL"

echo "→ migrate smoke OK"
