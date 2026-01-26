#!/bin/bash

echo "🛑 Stopping Gitea Actions Runner..."

# Check if PID file exists
if [ -f .runner.pid ]; then
    RUNNER_PID=$(cat .runner.pid)
    
    # Check if process is still running
    if ps -p $RUNNER_PID > /dev/null; then
        echo "🔄 Stopping runner with PID: $RUNNER_PID"
        kill $RUNNER_PID
        
        # Wait a moment for graceful shutdown
        sleep 2
        
        # Force kill if still running
        if ps -p $RUNNER_PID > /dev/null; then
            echo "⚡ Force stopping runner..."
            kill -9 $RUNNER_PID
        fi
        
        echo "✅ Runner stopped successfully"
    else
        echo "⚠️  Runner process not found (PID: $RUNNER_PID)"
    fi
    
    # Clean up PID file
    rm -f .runner.pid
else
    echo "🔍 No PID file found, checking for any running runners..."
    pkill -f "act_runner daemon"
    echo "✅ Any running runners have been stopped"
fi
