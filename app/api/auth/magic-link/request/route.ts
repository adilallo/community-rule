import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import {
  hashSessionToken,
  newSessionToken,
} from "../../../../../lib/server/hash";
import { sendMagicLinkEmail } from "../../../../../lib/server/mail";
import { rateLimitKey } from "../../../../../lib/server/rateLimit";
import {
  dbUnavailable,
  errorJson,
  rateLimited,
  serverMisconfigured,
} from "../../../../../lib/server/responses";
import { logRouteError } from "../../../../../lib/server/requestId";
import { apiRoute } from "../../../../../lib/server/apiRoute";
import { safeInternalPath } from "../../../../../lib/safeInternalPath";
import { getPublicOrigin } from "../../../../../lib/server/publicOrigin";
import { magicLinkRequestBodySchema } from "../../../../../lib/server/validation/createFlowSchemas";
import { jsonFromZodError } from "../../../../../lib/server/validation/zodHttp";

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const EMAIL_MIN_INTERVAL_MS = 60 * 1000;
const IP_MIN_INTERVAL_MS = 20 * 1000;
const SCOPE = "auth.magicLink.request";

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export const POST = apiRoute(SCOPE, async (request: NextRequest, _ctx, { requestId }) => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorJson("invalid_json", "Invalid JSON", 400);
  }

  const parsed = magicLinkRequestBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromZodError(parsed.error);
  }

  const email = normalizeEmail(parsed.data.email);
  if (!email) {
    return errorJson("validation_error", "Valid email required", 400);
  }

  const nextPath = parsed.data.next
    ? safeInternalPath(parsed.data.next)
    : null;
  const draftPayload = parsed.data.draft as Prisma.InputJsonValue | undefined;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rlEmail = rateLimitKey(`magic-email:${email}`, EMAIL_MIN_INTERVAL_MS);
  if (rlEmail.ok === false) {
    return rateLimited(rlEmail.retryAfterMs);
  }

  const rlIp = rateLimitKey(`magic-ip:${ip}`, IP_MIN_INTERVAL_MS);
  if (rlIp.ok === false) {
    return rateLimited(rlIp.retryAfterMs);
  }

  let pepper: string;
  try {
    pepper = getSessionPepper();
  } catch {
    return serverMisconfigured();
  }

  const token = newSessionToken();
  const tokenHash = hashSessionToken(token, pepper);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);

  await prisma.magicLinkToken.deleteMany({ where: { email } });
  await prisma.magicLinkToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
      nextPath: nextPath ?? undefined,
      ...(draftPayload !== undefined ? { draftPayload } : {}),
    },
  });

  const origin = getPublicOrigin(request);
  const verifyUrl = `${origin}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`;

  try {
    await sendMagicLinkEmail(email, verifyUrl);
  } catch (err) {
    logRouteError(SCOPE, requestId, err, { phase: "sendMagicLinkEmail", email });
    await prisma.magicLinkToken.deleteMany({ where: { email } });
    return errorJson("mail_failed", "Could not send email", 502);
  }

  return NextResponse.json({ ok: true });
});
