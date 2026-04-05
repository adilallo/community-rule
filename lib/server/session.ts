import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "./db";
import { getSessionPepper } from "./env";
import { hashSessionToken, newSessionToken } from "./hash";

export const SESSION_COOKIE_NAME = "cr_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  let pepper: string;
  try {
    pepper = getSessionPepper();
  } catch {
    return null;
  }

  const tokenHash = hashSessionToken(token, pepper);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export async function createSessionForUser(
  userId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const pepper = getSessionPepper();
  const token = newSessionToken();
  const tokenHash = hashSessionToken(token, pepper);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function destroySessionFromRequest(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  await clearSessionCookie();
  if (!token) return;

  let pepper: string;
  try {
    pepper = getSessionPepper();
  } catch {
    return;
  }

  const tokenHash = hashSessionToken(token, pepper);
  await prisma.session.deleteMany({ where: { tokenHash } });
}
