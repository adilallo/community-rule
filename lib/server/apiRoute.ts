import type { NextRequest, NextResponse } from "next/server";
import { internalError } from "./responses";
import {
  getOrCreateRequestId,
  logRouteError,
  withRequestId,
} from "./requestId";

export interface ApiRouteMeta {
  requestId: string;
}

export type ApiHandler<Ctx> = (
  request: NextRequest,
  ctx: Ctx,
  meta: ApiRouteMeta,
) => Promise<NextResponse> | NextResponse;

/**
 * Minimal wrapper around a Route Handler that:
 *
 *  - generates or forwards an `x-request-id`,
 *  - attaches that id to every response (success and error),
 *  - catches uncaught throws, logs them with the id via `lib/logger`, and
 *    returns the canonical 500 `internal_error` body.
 *
 * Pass a `scope` like `"auth.magicLink.request"` so logs are filterable per
 * route. Handlers that don't need request-id correlation can skip the
 * wrapper.
 */
export function apiRoute<Ctx = undefined>(
  scope: string,
  handler: ApiHandler<Ctx>,
): (request: NextRequest, ctx: Ctx) => Promise<NextResponse> {
  return async (request, ctx) => {
    const requestId = getOrCreateRequestId(request);
    try {
      const res = await handler(request, ctx, { requestId });
      return withRequestId(res, requestId);
    } catch (err) {
      logRouteError(scope, requestId, err);
      return withRequestId(internalError(), requestId);
    }
  };
}
