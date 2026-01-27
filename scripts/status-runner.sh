#!/bin/bash

echo "📊 Gitea Actions Runner Status"
echo "=============================="

# Check if runner is running
if pgrep -f "act_runner daemon" > /dev/null; then
    RUNNER_PID=$(pgrep -f "act_runner daemon")
    echo "✅ Runner is RUNNING (PID: $RUNNER_PID)"
    echo ""
    echo "📝 Recent logs:"
    if [ -f runner.log ]; then
        tail -5 runner.log
    else
        echo "No log file found"
    fi
    echo ""
    echo "To stop the runner: ./scripts/stop-runner.sh"
else
    echo "❌ Runner is NOT RUNNING"
    echo ""
    echo "To start the runner: ./scripts/start-runner.sh"
fi

echo ""
echo "🔗 Gitea Actions URL:"
echo "https://git.medlab.host/CommunityRule/community-rule/actions"
