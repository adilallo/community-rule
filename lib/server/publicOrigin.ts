import type { NextRequest } from "next/server";

/**
 * Resolve the public origin of the request, preferring proxy-forwarded headers.
 *
 * Next.js standalone behind Cloudron's reverse proxy sees `Host: 0.0.0.0:3000`
 * (the bind address from `ENV HOSTNAME` in the Dockerfile), so
 * `request.nextUrl.origin` returns an internal address unsuitable for
 * outbound URLs (magic-link emails, stakeholder invites, etc.).
 *
 * Trusts `X-Forwarded-Host` + `X-Forwarded-Proto` when present. Falls back
 * to `request.nextUrl.origin` for local dev where no proxy is in front.
 */
export function getPublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const proto = forwardedProto?.split(",")[0]?.trim() || "https";
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) return `${proto}://${host}`;
  }

  return request.nextUrl.origin;
}
