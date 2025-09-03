#!/bin/bash

# Script to seed visual regression snapshots using Playwright Docker container
# This ensures the snapshots are generated in the same environment as CI

set -e

echo "🚀 Seeding visual regression snapshots using Playwright Docker container..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not available in PATH"
    exit 1
fi

# Run the Playwright container and generate snapshots
docker run --rm -it \
  -v "$(pwd):/work" \
  -w /work \
  mcr.microsoft.com/playwright:v1.54.2-jammy \
  bash -c "
    echo '📦 Installing dependencies...'
    npm ci
    
    echo '🎭 Installing Playwright browsers...'
    npx playwright install --with-deps
    
    echo '🔨 Building application...'
    npm run build
    
    echo '🌐 Starting preview server...'
    npm run preview &
    sleep 10
    
    echo '📸 Generating snapshots...'
    PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts --project=chromium
    
    echo '✅ Snapshots generated successfully!'
  "

echo "🎉 Snapshot seeding completed!"
echo "📁 Check the generated snapshots in: tests/e2e/visual-regression.spec.ts-snapshots/"
echo "💡 Don't forget to commit the snapshot files to your repository"
