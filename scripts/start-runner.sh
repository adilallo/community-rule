#!/bin/bash

echo "🚀 Starting Gitea Actions Runner..."

# Ensure Node.js is available in PATH
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

# Verify Node.js is accessible
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js not found in PATH!"
    echo "Current PATH: $PATH"
    exit 1
fi

echo "✅ Node.js found: $(which node) - $(node -v)"

# Check if runner is already running
if pgrep -f "act_runner daemon" > /dev/null; then
    echo "⚠️  Runner is already running!"
    echo "To stop it, run: ./scripts/stop-runner.sh"
    exit 1
fi

# Start the runner in the background with proper PATH
PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH" ./act_runner daemon --config config/gitea-runner.yaml &
RUNNER_PID=$!

# Save PID to file for easy stopping
echo $RUNNER_PID > .runner.pid

echo "✅ Runner started with PID: $RUNNER_PID"
echo "📝 Logs will be written to: runner.log"
echo ""
echo "To stop the runner, run: ./scripts/stop-runner.sh"
echo "To check status, run: ./scripts/status-runner.sh"
