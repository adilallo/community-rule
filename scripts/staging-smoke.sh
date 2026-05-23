#!/bin/sh
# Staging / production smoke. Verifies CR-98 acceptance criteria (curl-able checks).
# See docs/guides/ops-backend-deploy.md §10.
#
# Usage:
#   ./scripts/staging-smoke.sh
#   ./scripts/staging-smoke.sh communityrule.info
#   EMAIL=you@example.com ./scripts/staging-smoke.sh staging.communityrule.info
#
# Manual follow-up (not automated here): click magic link in inbox, publish a rule,
# optional upload with UPLOAD_ROOT set.

set -eu

HOST="${1:-staging.communityrule.info}"
BASE="https://${HOST}"
FAIL=0

pass() {
  printf 'PASS  %s\n' "$1"
}

fail() {
  printf 'FAIL  %s\n' "$1"
  FAIL=1
}

check_http() {
  name="$1"
  url="$2"
  expected_status="$3"

  status="$(curl -sS -o /tmp/staging-smoke-body.$$ -w '%{http_code}' "$url" || echo '000')"
  if [ "$status" = "$expected_status" ]; then
    pass "$name (HTTP $status)"
  else
    fail "$name (expected HTTP $expected_status, got $status)"
    if [ -f "/tmp/staging-smoke-body.$$" ]; then
      head -c 500 "/tmp/staging-smoke-body.$$" 1>&2 || true
      printf '\n' 1>&2
    fi
  fi
}

check_json_contains() {
  name="$1"
  pattern="$2"
  if grep -Fq "$pattern" "/tmp/staging-smoke-body.$$" 2>/dev/null; then
    pass "$name"
  else
    fail "$name (body missing pattern: $pattern)"
    head -c 500 "/tmp/staging-smoke-body.$$" 1>&2 || true
    printf '\n' 1>&2
  fi
}

printf 'Smoke target: %s\n\n' "$BASE"

check_http "GET /api/health" "$BASE/api/health" "200"
check_json_contains 'health ok + database connected' '"ok":true' 
check_json_contains 'health database connected' '"database":"connected"'

check_http "GET /api/templates" "$BASE/api/templates" "200"
check_json_contains 'templates response shape' '"templates":['
check_json_contains 'templates seeded (non-empty)' '"slug":'

check_http "GET /api/rules" "$BASE/api/rules" "200"
check_json_contains 'rules list shape' '"rules":['

if [ -n "${EMAIL:-}" ]; then
  status="$(curl -sS -o /tmp/staging-smoke-body.$$ -w '%{http_code}' \
    -X POST "$BASE/api/auth/magic-link/request" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$EMAIL\"}" || echo '000')"
  if [ "$status" = "200" ]; then
    check_json_contains 'magic-link request ok' '"ok":true'
    pass "POST /api/auth/magic-link/request (HTTP 200)"
    printf '      Check inbox for %s — link host must be %s\n' "$EMAIL" "$HOST"
  else
    fail "POST /api/auth/magic-link/request (expected HTTP 200, got $status)"
    head -c 500 "/tmp/staging-smoke-body.$$" 1>&2 || true
    printf '\n' 1>&2
  fi
else
  printf 'SKIP  POST /api/auth/magic-link/request (set EMAIL= to run)\n'
fi

rm -f "/tmp/staging-smoke-body.$$"

printf '\n'
if [ "$FAIL" -eq 0 ]; then
  printf 'All automated checks passed.\n'
  printf 'Manual: click magic link, publish a rule, load public detail.\n'
  exit 0
fi

printf 'One or more checks failed.\n'
exit 1
