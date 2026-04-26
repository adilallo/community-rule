import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import {
  hashSessionToken,
  newSessionToken,
} from "../../../../../lib/server/hash";
import { sendEmailChangeEmail } from "../../../../../lib/server/mail";
import { rateLimitKey } from "../../../../../lib/server/rateLimit";
import { apiRoute } from "../../../../../lib/server/apiRoute";
import { logRouteError } from "../../../../../lib/server/requestId";
import {
  dbUnavailable,
  errorJson,
  rateLimited,
  serverMisconfigured,
  unauthorized,
} from "../../../../../lib/server/responses";
import { getSessionUser } from "../../../../../lib/server/session";
import { readLimitedJson } from "../../../../../lib/server/validation/requestBody";
import { emailChangeRequestBodySchema } from "../../../../../lib/server/validation/userEmailChangeSchemas";
import { jsonFromZodError } from "../../../../../lib/server/validation/zodHttp";

const EMAIL_CHANGE_TTL_MS = 15 * 60 * 1000;
const EMAIL_MIN_INTERVAL_MS = 60 * 1000;
const IP_MIN_INTERVAL_MS = 20 * 1000;
const SCOPE = "user.emailChange.request";

export const POST = apiRoute(SCOPE, async (request: NextRequest, _ctx, { requestId }) => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  const limited = await readLimitedJson(request);
  if (limited.ok === false) {
    return limited.response;
  }

  const parsed = emailChangeRequestBodySchema.safeParse(limited.value);
  if (!parsed.success) {
    return jsonFromZodError(parsed.error);
  }

  const { newEmail } = parsed.data;
  if (newEmail === user.email) {
    return errorJson(
      "validation_error",
      "New email must be different from your current email",
      400,
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rlEmail = rateLimitKey(
    `email-change-email:${newEmail}`,
    EMAIL_MIN_INTERVAL_MS,
  );
  if (rlEmail.ok === false) {
    return rateLimited(rlEmail.retryAfterMs);
  }

  const rlIp = rateLimitKey(`email-change-ip:${ip}`, IP_MIN_INTERVAL_MS);
  if (rlIp.ok === false) {
    return rateLimited(rlIp.retryAfterMs);
  }

  const rlUser = rateLimitKey(
    `email-change-user:${user.id}`,
    EMAIL_MIN_INTERVAL_MS,
  );
  if (rlUser.ok === false) {
    return rateLimited(rlUser.retryAfterMs);
  }

  const existing = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existing && existing.id !== user.id) {
    return errorJson(
      "validation_error",
      "That email is already used by another account",
      400,
      { details: { field: "newEmail" } },
    );
  }

  let pepper: string;
  try {
    pepper = getSessionPepper();
  } catch {
    return serverMisconfigured();
  }

  const token = newSessionToken();
  const tokenHash = hashSessionToken(token, pepper);
  const expiresAt = new Date(Date.now() + EMAIL_CHANGE_TTL_MS);

  await prisma.emailChangeToken.deleteMany({ where: { userId: user.id } });
  await prisma.emailChangeToken.create({
    data: {
      userId: user.id,
      newEmail,
      tokenHash,
      expiresAt,
    },
  });

  const origin = request.nextUrl.origin;
  const verifyUrl = `${origin}/api/user/email-change/verify?token=${encodeURIComponent(token)}`;

  try {
    await sendEmailChangeEmail(newEmail, verifyUrl);
  } catch (err) {
    logRouteError(SCOPE, requestId, err, {
      phase: "sendEmailChangeEmail",
      newEmail,
    });
    await prisma.emailChangeToken.deleteMany({ where: { userId: user.id } });
    return errorJson("mail_failed", "Could not send email", 502);
  }

  return NextResponse.json({ ok: true });
});
