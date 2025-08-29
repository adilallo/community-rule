#!/bin/bash

echo "🚀 Starting Gitea Actions Runner..."

# Check if runner is already running
if pgrep -f "act_runner daemon" > /dev/null; then
    echo "⚠️  Runner is already running!"
    echo "To stop it, run: ./stop-runner.sh"
    exit 1
fi

# Start the runner in the background
./act_runner daemon --config config.yaml &
RUNNER_PID=$!

# Save PID to file for easy stopping
echo $RUNNER_PID > .runner.pid

echo "✅ Runner started with PID: $RUNNER_PID"
echo "📝 Logs will be written to: runner.log"
echo ""
echo "To stop the runner, run: ./stop-runner.sh"
echo "To check status, run: ./status-runner.sh"
