/**
 * In-memory rate limiter (per server instance). Sufficient for small deploys;
 * replace with Redis or edge limits if you scale horizontally.
 */

const windows = new Map<string, number>();

export function rateLimitKey(
  key: string,
  minIntervalMs: number,
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const last = windows.get(key) ?? 0;
  const elapsed = now - last;
  if (elapsed < minIntervalMs) {
    return { ok: false, retryAfterMs: minIntervalMs - elapsed };
  }
  windows.set(key, now);
  return { ok: true };
}
