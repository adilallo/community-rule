import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import { hashSessionToken } from "../../../../../lib/server/hash";
import {
  createSessionForUser,
  getValidatedSessionTokenHashForUser,
  setSessionCookie,
} from "../../../../../lib/server/session";
import { dbUnavailable } from "../../../../../lib/server/responses";
import {
  REQUEST_ID_HEADER,
  getOrCreateRequestId,
  logRouteError,
} from "../../../../../lib/server/requestId";

const SCOPE = "user.emailChange.verify";

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
        "/profile?error=email_change_invalid",
        requestId,
      );
    }

    let pepper: string;
    try {
      pepper = getSessionPepper();
    } catch (err) {
      logRouteError(SCOPE, requestId, err, { phase: "getSessionPepper" });
      return redirectWithRequestId(
        request,
        "/profile?error=email_change_server",
        requestId,
      );
    }

    const tokenHash = hashSessionToken(token, pepper);
    const row = await prisma.emailChangeToken.findUnique({
      where: { tokenHash },
    });

    if (!row || row.expiresAt < new Date()) {
      return redirectWithRequestId(
        request,
        "/profile?error=email_change_expired",
        requestId,
      );
    }

    const keepSessionTokenHash = await getValidatedSessionTokenHashForUser(
      row.userId,
    );

    try {
      await prisma.$transaction(async (tx) => {
        const claim = await tx.emailChangeToken.findUnique({
          where: { id: row.id },
        });
        if (!claim || claim.expiresAt < new Date()) {
          throw Object.assign(new Error("expired"), { __expired: true });
        }

        const taken = await tx.user.findFirst({
          where: {
            email: claim.newEmail,
            NOT: { id: claim.userId },
          },
        });
        if (taken) {
          await tx.emailChangeToken.delete({ where: { id: claim.id } });
          throw Object.assign(new Error("taken"), { __taken: true });
        }

        await tx.user.update({
          where: { id: claim.userId },
          data: { email: claim.newEmail },
        });
        await tx.emailChangeToken.delete({ where: { id: claim.id } });

        if (keepSessionTokenHash) {
          await tx.session.deleteMany({
            where: {
              userId: claim.userId,
              tokenHash: { not: keepSessionTokenHash },
            },
          });
        } else {
          await tx.session.deleteMany({
            where: { userId: claim.userId },
          });
        }
      });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "__taken" in err &&
        (err as { __taken?: boolean }).__taken
      ) {
        return redirectWithRequestId(
          request,
          "/profile?error=email_change_taken",
          requestId,
        );
      }
      if (
        err &&
        typeof err === "object" &&
        "__expired" in err &&
        (err as { __expired?: boolean }).__expired
      ) {
        return redirectWithRequestId(
          request,
          "/profile?error=email_change_expired",
          requestId,
        );
      }
      logRouteError(SCOPE, requestId, err, { phase: "transaction" });
      return redirectWithRequestId(
        request,
        "/profile?error=email_change_server",
        requestId,
      );
    }

    if (!keepSessionTokenHash) {
      const { token: sessionToken, expiresAt } = await createSessionForUser(
        row.userId,
      );
      await setSessionCookie(sessionToken, expiresAt);
    }

    return redirectWithRequestId(
      request,
      "/profile?email_change=ok",
      requestId,
    );
  } catch (err) {
    logRouteError(SCOPE, requestId, err);
    return redirectWithRequestId(
      request,
      "/profile?error=email_change_server",
      requestId,
    );
  }
}

function redirectWithRequestId(
  request: NextRequest,
  path: string,
  requestId: string,
): NextResponse {
  const res = NextResponse.redirect(new URL(path, request.url));
  res.headers.set(REQUEST_ID_HEADER, requestId);
  return res;
}
