#!/bin/bash

# Local testing script - run before committing/merging
# Usage: ./scripts/test-local.sh

set -euo pipefail  # Exit on error, undefined vars, pipe failures

echo "🧪 Running local tests before commit..."
echo ""

# Cleanup function to ensure servers are killed
cleanup() {
  echo ""
  echo "🧹 Cleaning up any running servers..."
  # Kill any Next.js servers on common test ports
  for port in 3000 3010; do
    if lsof -ti:$port >/dev/null 2>&1; then
      echo "  Killing process on port $port..."
      lsof -ti:$port | xargs kill -9 2>/dev/null || true
    fi
  done
  # Kill any processes from PID files if they exist
  for pidfile in .next/runner.pid .next/performance-server.pid; do
    if [ -f "$pidfile" ]; then
      PID=$(cat "$pidfile" 2>/dev/null || echo "")
      if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
        echo "  Killing server PID: $PID (from $pidfile)..."
        kill -9 "$PID" 2>/dev/null || true
      fi
      rm -f "$pidfile"
    fi
  done
}

trap cleanup EXIT INT TERM

echo "🔍 Linting..."
npm run lint || exit 1

echo ""
echo "💅 Prettier check..."
npm exec prettier -- --check "**/*.{js,jsx,ts,tsx,json,css,md}" || exit 1

echo ""
echo "📦 Component tests with coverage..."
npm test || exit 1

echo ""
echo "🎭 E2E tests..."
npm run test:e2e || exit 1

echo ""
echo "🖼️  Visual regression tests..."
# Visual tests use Playwright's webServer config, should auto-start server
npm run visual:test || exit 1

echo ""
echo "⚡ Performance tests (Lighthouse CI)..."
# Performance tests need a server running on port 3010
# Check if server is already running, if not start one
if ! lsof -ti:3010 >/dev/null 2>&1; then
  echo "  Starting server for performance tests..."
  npm run build || exit 1
  PORT=3010 HOST=127.0.0.1 node node_modules/next/dist/bin/next start -p 3010 -H 127.0.0.1 > .next/performance-server.log 2>&1 &
  SERVER_PID=$!
  echo "$SERVER_PID" > .next/performance-server.pid
  echo "  Server started (PID: $SERVER_PID), waiting for readiness..."
  npx wait-on -t 120000 "tcp:127.0.0.1:3010" || { echo "❌ Server failed to start"; kill $SERVER_PID 2>/dev/null || true; exit 1; }
  echo "  ✅ Server ready"
fi

# Run performance tests
npm run performance:budget || EXIT_CODE=$?

# Cleanup performance server if we started it
if [ -f .next/performance-server.pid ]; then
  PID=$(cat .next/performance-server.pid 2>/dev/null || echo "")
  if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    echo "  Stopping performance test server..."
    kill "$PID" 2>/dev/null || true
    sleep 2
    kill -9 "$PID" 2>/dev/null || true
  fi
  rm -f .next/performance-server.pid
fi

if [ -n "${EXIT_CODE:-}" ]; then
  exit $EXIT_CODE
fi

echo ""
echo "✅ All tests passed! Safe to commit/merge."
