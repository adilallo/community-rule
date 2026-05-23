#!/bin/sh
# Build, tag, and push the community-rule image to the Gitea container
# registry on git.medlab.host. See docs/guides/ops-backend-deploy.md §9.
#
# Usage:
#   ./scripts/docker-release.sh              # tag = git short SHA
#   TAG=v0.1.1 ./scripts/docker-release.sh   # explicit tag
#
# Builds for linux/amd64 explicitly so the image runs on the Cloudron host
# (x86_64) even when this script runs on an Apple Silicon laptop (aarch64).
# buildx pushes directly to the registry — no intermediate local image.
#
# Prerequisites:
#   - docker login git.medlab.host  (Gitea PAT with read+write:package)
#   - Push permission to the CommunityRule org's packages
#   - docker buildx (ships with Docker Desktop)

set -e

IMAGE="${IMAGE:-git.medlab.host/communityrule/community-rule}"
TAG="${TAG:-$(git rev-parse --short HEAD)}"
PLATFORM="${PLATFORM:-linux/amd64}"

docker buildx build \
  --platform "$PLATFORM" \
  --tag "$IMAGE:$TAG" \
  --push \
  .

echo
echo "Pushed: $IMAGE:$TAG  ($PLATFORM)"
echo
echo "Next steps:"
echo "  1. Update CloudronManifest.json 'version' (must increase) and"
echo "     'dockerimage' to:"
echo "       \"dockerimage\": \"$IMAGE:$TAG\""
echo "  2. First install:   cloudron install"
echo "     Subsequent:      cloudron update --app <app-id>"
