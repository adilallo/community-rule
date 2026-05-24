import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import { hashSessionToken } from "../../../../../lib/server/hash";
import {
  REQUEST_ID_HEADER,
  getOrCreateRequestId,
  logRouteError,
} from "../../../../../lib/server/requestId";
import { dbUnavailable } from "../../../../../lib/server/responses";
import {
  createSessionForUser,
  getSessionUser,
  setSessionCookie,
} from "../../../../../lib/server/session";
import { getPublicOrigin } from "../../../../../lib/server/publicOrigin";

const SCOPE = "invites.ruleStakeholder.verify";

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);

  if (!isDatabaseConfigured()) {
    const res = dbUnavailable();
    res.headers.set(REQUEST_ID_HEADER, requestId);
    return res;
  }

  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token || token.length < 10) {
      return redirectWithRequestId(
        request,
        "/login?error=invalid_link",
        requestId,
      );
    }

    let pepper: string;
    try {
      pepper = getSessionPepper();
    } catch (err) {
      logRouteError(SCOPE, requestId, err, { phase: "getSessionPepper" });
      return redirectWithRequestId(request, "/login?error=server", requestId);
    }

    const tokenHash = hashSessionToken(token, pepper);

    const row = await prisma.ruleStakeholder.findUnique({
      where: { inviteTokenHash: tokenHash },
      select: {
        id: true,
        email: true,
        ruleId: true,
        inviteExpiresAt: true,
      },
    });

    if (
      !row ||
      !row.inviteExpiresAt ||
      row.inviteExpiresAt < new Date()
    ) {
      return redirectWithRequestId(
        request,
        "/login?error=expired_link",
        requestId,
      );
    }

    const existingSession = await getSessionUser();
    if (
      existingSession &&
      existingSession.email.trim().toLowerCase() !== row.email
    ) {
      return redirectWithRequestId(
        request,
        "/login?error=stakeholder_wrong_account",
        requestId,
      );
    }

    const user = await prisma.user.upsert({
      where: { email: row.email },
      create: { email: row.email },
      update: {},
    });

    await prisma.ruleStakeholder.update({
      where: { id: row.id },
      data: {
        userId: user.id,
        acceptedAt: new Date(),
        inviteTokenHash: null,
        inviteExpiresAt: null,
      },
    });

    const { token: sessionToken, expiresAt } = await createSessionForUser(
      user.id,
    );
    await setSessionCookie(sessionToken, expiresAt);

    const dest = `/rules/${encodeURIComponent(row.ruleId)}`;
    return redirectWithRequestId(request, dest, requestId);
  } catch (err) {
    logRouteError(SCOPE, requestId, err);
    return redirectWithRequestId(request, "/login?error=server", requestId);
  }
}

function redirectWithRequestId(
  request: NextRequest,
  path: string,
  requestId: string,
): NextResponse {
  const res = NextResponse.redirect(new URL(path, getPublicOrigin(request)));
  res.headers.set(REQUEST_ID_HEADER, requestId);
  return res;
}
