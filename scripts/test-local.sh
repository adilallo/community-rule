#!/bin/bash

# Local testing script - run before committing/merging
# Usage: ./scripts/test-local.sh

echo "🧪 Running local tests before commit..."
echo ""

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
npm run visual:test || exit 1

echo ""
echo "⚡ Performance tests (Lighthouse CI)..."
npm run performance:budget || exit 1

echo ""
echo "✅ All tests passed! Safe to commit/merge."
