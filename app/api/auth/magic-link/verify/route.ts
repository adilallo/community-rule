import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import { hashSessionToken } from "../../../../../lib/server/hash";
import {
  createSessionForUser,
  setSessionCookie,
} from "../../../../../lib/server/session";
import { dbUnavailable } from "../../../../../lib/server/responses";
import {
  REQUEST_ID_HEADER,
  getOrCreateRequestId,
  logRouteError,
} from "../../../../../lib/server/requestId";
import { safeInternalPath } from "../../../../../lib/safeInternalPath";
import { getPublicOrigin } from "../../../../../lib/server/publicOrigin";

const SCOPE = "auth.magicLink.verify";

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

    const row = await prisma.magicLinkToken.findUnique({
      where: { tokenHash },
    });

    if (!row || row.expiresAt < new Date()) {
      return redirectWithRequestId(
        request,
        "/login?error=expired_link",
        requestId,
      );
    }

    await prisma.magicLinkToken.delete({ where: { id: row.id } });

    const user = await prisma.user.upsert({
      where: { email: row.email },
      create: { email: row.email },
      update: {},
    });

    if (row.draftPayload != null) {
      await prisma.ruleDraft.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          payload: row.draftPayload as Prisma.InputJsonValue,
        },
        update: {
          payload: row.draftPayload as Prisma.InputJsonValue,
        },
      });
    }

    const { token: sessionToken, expiresAt } = await createSessionForUser(
      user.id,
    );
    await setSessionCookie(sessionToken, expiresAt);

    const dest = safeInternalPath(row.nextPath);
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
