#!/bin/bash

echo "🔍 Verifying Gitea Runner Status"
echo "================================="
echo ""

# Check if runner is registered
if [ ! -f .runner ]; then
    echo "❌ Runner not registered - .runner file not found"
    echo "   Run: ./scripts/register-runner.sh <token>"
    exit 1
fi

echo "✅ Runner registration file exists"
RUNNER_ID=$(cat .runner | grep -o '"id": [0-9]*' | cut -d' ' -f2)
echo "   Runner ID: $RUNNER_ID"
echo ""

# Check if runner is running
if pgrep -f "act_runner daemon" > /dev/null; then
    RUNNER_PID=$(pgrep -f "act_runner daemon")
    echo "✅ Runner process is running (PID: $RUNNER_PID)"
else
    echo "⚠️  Runner process is NOT running"
    echo "   Start it with: ./scripts/start-runner.sh"
    exit 1
fi

echo ""
echo "📝 Recent logs (checking for polling activity):"
if [ -f runner.log ]; then
    echo "---"
    tail -20 runner.log | grep -E "(polling|fetch|task|job|online|error|Error)" || tail -10 runner.log
    echo "---"
    echo ""
    echo "Look for messages like:"
    echo "  - 'fetching task' or 'polling' (good - runner is active)"
    echo "  - 'error' or 'Error' (bad - check the full log)"
else
    echo "⚠️  No log file found"
fi

echo ""
echo "🔗 Check runner status in Gitea:"
echo "   https://git.medlab.host/CommunityRule/community-rule/settings/actions/runners"
echo ""
echo "The runner should show as 'Idle' (online) if it's working correctly."
