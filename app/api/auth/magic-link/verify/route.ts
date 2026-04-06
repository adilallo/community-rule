import { NextRequest, NextResponse } from "next/server";
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
import { safeInternalPath } from "../../../../../lib/safeInternalPath";

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const token = request.nextUrl.searchParams.get("token");
  if (!token || token.length < 10) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_link", request.url),
    );
  }

  let pepper: string;
  try {
    pepper = getSessionPepper();
  } catch {
    return NextResponse.redirect(new URL("/login?error=server", request.url));
  }

  const tokenHash = hashSessionToken(token, pepper);

  const row = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
  });

  if (!row || row.expiresAt < new Date()) {
    return NextResponse.redirect(
      new URL("/login?error=expired_link", request.url),
    );
  }

  await prisma.magicLinkToken.delete({ where: { id: row.id } });

  const user = await prisma.user.upsert({
    where: { email: row.email },
    create: { email: row.email },
    update: {},
  });

  const { token: sessionToken, expiresAt } = await createSessionForUser(
    user.id,
  );
  await setSessionCookie(sessionToken, expiresAt);

  const dest = safeInternalPath(row.nextPath);
  return NextResponse.redirect(new URL(dest, request.url));
}
