import type { NextResponse } from "next/server";
import { logger } from "../logger";

export const REQUEST_ID_HEADER = "x-request-id";

const MAX_REQUEST_ID_LENGTH = 128;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9_.-]+$/;

/**
 * Returns the incoming `x-request-id` header (sanitized) when present and
 * well-formed, otherwise generates a fresh UUID. Sanitization rejects
 * oversized values and characters outside `[A-Za-z0-9_.-]` so log lines
 * cannot be poisoned by client-controlled input.
 */
export function getOrCreateRequestId(request: Request): string {
  const raw = request.headers.get(REQUEST_ID_HEADER);
  if (raw) {
    const trimmed = raw.trim();
    if (
      trimmed.length > 0 &&
      trimmed.length <= MAX_REQUEST_ID_LENGTH &&
      REQUEST_ID_PATTERN.test(trimmed)
    ) {
      return trimmed;
    }
  }
  return crypto.randomUUID();
}

/**
 * Attach the request id to a response so callers (and log drains) can
 * correlate logs with the response. Returns the same response for chaining.
 */
export function withRequestId<T extends NextResponse>(
  res: T,
  requestId: string,
): T {
  res.headers.set(REQUEST_ID_HEADER, requestId);
  return res;
}

interface ErrorLogPayload {
  scope: string;
  requestId: string;
  message: string;
  stack?: string;
  [key: string]: unknown;
}

/**
 * Structured error log including the request id. Use from route handlers
 * (and the `apiRoute` wrapper) so support can tie a 5xx back to log lines.
 */
export function logRouteError(
  scope: string,
  requestId: string,
  err: unknown,
  extra?: Record<string, unknown>,
): void {
  const payload: ErrorLogPayload = {
    scope,
    requestId,
    message: err instanceof Error ? err.message : String(err),
    ...(extra ?? {}),
  };
  if (err instanceof Error && err.stack) {
    payload.stack = err.stack;
  }
  logger.error(payload);
}
