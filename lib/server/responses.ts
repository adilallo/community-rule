import { NextResponse } from "next/server";

/**
 * Canonical API error contract for `app/api/**`.
 *
 * Response body shape: `{ error: { code, message }, details? }`.
 *
 * Codes are kept intentionally small. Add a new code only when an existing
 * one cannot describe the failure; route handlers should not invent codes
 * inline (use `errorJson(code, …)` here so the union stays the source of
 * truth).
 */
export type ApiErrorCode =
  | "db_unavailable"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation_error"
  | "invalid_json"
  | "payload_too_large"
  | "rate_limited"
  | "server_misconfigured"
  | "mail_failed"
  | "internal_error";

export interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string };
  details?: unknown;
}

interface ErrorOpts {
  details?: unknown;
  headers?: HeadersInit;
}

export function errorJson(
  code: ApiErrorCode,
  message: string,
  status: number,
  opts: ErrorOpts = {},
): NextResponse {
  const body: ApiErrorBody = { error: { code, message } };
  if (opts.details !== undefined) {
    body.details = opts.details;
  }
  return NextResponse.json(body, { status, headers: opts.headers });
}

export function dbUnavailable(): NextResponse {
  return errorJson(
    "db_unavailable",
    "Database is not configured (DATABASE_URL).",
    503,
  );
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return errorJson("unauthorized", message, 401);
}

export function notFound(message = "Not found"): NextResponse {
  return errorJson("not_found", message, 404);
}

export function forbidden(message = "Forbidden"): NextResponse {
  return errorJson("forbidden", message, 403);
}

export function rateLimited(retryAfterMs: number): NextResponse {
  const retryAfterSec = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return errorJson("rate_limited", "Too many requests", 429, {
    details: { retryAfterMs },
    headers: { "retry-after": String(retryAfterSec) },
  });
}

export function serverMisconfigured(
  message = "Server misconfiguration",
): NextResponse {
  return errorJson("server_misconfigured", message, 500);
}

export function internalError(
  message = "Internal server error",
): NextResponse {
  return errorJson("internal_error", message, 500);
}
