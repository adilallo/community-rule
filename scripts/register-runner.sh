#!/bin/bash

# Script to register Gitea runner
# Usage: ./scripts/register-runner.sh <registration_token>

if [ -z "$1" ]; then
    echo "❌ Error: Registration token required"
    echo ""
    echo "To get a registration token:"
    echo "1. Go to: https://git.medlab.host/CommunityRule/community-rule/settings/actions/runners"
    echo "2. Click 'New Runner' or find the registration token"
    echo "3. Run: ./scripts/register-runner.sh YOUR_TOKEN"
    exit 1
fi

TOKEN=$1
INSTANCE="https://git.medlab.host"
NAME="community-rule-runner-mac"
LABELS="self-hosted,macos-latest"

echo "🚀 Registering runner..."
echo "Instance: $INSTANCE"
echo "Name: $NAME"
echo "Labels: $LABELS"
echo ""

./act_runner register \
    --instance "$INSTANCE" \
    --token "$TOKEN" \
    --name "$NAME" \
    --labels "$LABELS" \
    --no-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Runner registered successfully!"
    echo "You can now start it with: ./scripts/start-runner.sh"
else
    echo ""
    echo "❌ Registration failed. Please check the token and try again."
    exit 1
fi
