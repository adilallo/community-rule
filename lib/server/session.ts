import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { logger } from "../logger";
import { prisma } from "./db";
import { getSessionPepper } from "./env";
import { hashSessionToken, newSessionToken } from "./hash";

/**
 * Custom session lifecycle (CR-85).
 *
 * Decisions documented here so the implementation below is the canonical
 * source of truth (referenced from `docs/guides/backend-roadmap.md` §4–5).
 *
 * 1. **Policy: multi-device.** A new sign-in (`createSessionForUser`) does
 *    NOT delete the user's other still-valid sessions. Users routinely use
 *    phone + laptop and there is no v1 security argument for forcing a
 *    single active session — pre-publish state lives in `localStorage`
 *    until "Save & Exit", and `/api/auth/logout` only revokes the current
 *    cookie by design.
 * 2. **Rotation: deferred.** No token rotation on privilege-sensitive
 *    actions in v1. Revisit if/when product requires it (ticket calls
 *    this v1.1).
 * 3. **Cleanup: lazy, two-tier, no cron.** Every sign-in prunes the
 *    signing user's own expired rows (cheap — uses `@@index([userId])`).
 *    A small fraction of sign-ins (`SESSION_GLOBAL_PRUNE_PROB`) also runs
 *    a global sweep so rows from users who never return are still bounded
 *    over months. Cleanup is best-effort: a prune failure never fails the
 *    sign-in itself.
 * 4. **Email change (CR-103).** After a verified email update, revoke every
 *    `Session` for that `userId` **except** the current browser's session when
 *    the verify link is opened with a valid `cr_session` cookie for the same
 *    user. If there is no such session (e.g. user opened the link on another
 *    device), all sessions are removed and the verify handler issues a new
 *    session cookie so that device is signed in. Other devices must sign in
 *    again.
 */

export const SESSION_COOKIE_NAME = "cr_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;
const SESSION_GLOBAL_PRUNE_PROB = 0.05;

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

/**
 * When completing email change (CR-103), returns the current request's session
 * `tokenHash` if the cookie maps to a non-expired session for `userId`;
 * otherwise `null` (caller will drop all sessions and create a new one).
 */
export async function getValidatedSessionTokenHashForUser(
  userId: string,
): Promise<string | null> {
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
  });

  if (!session || session.expiresAt < new Date() || session.userId !== userId) {
    return null;
  }

  return tokenHash;
}

/**
 * Delete expired `Session` rows. Scoped to a single user when `userId` is
 * provided (uses the `@@index([userId])` lookup); otherwise sweeps the
 * whole table. Returns the number of rows deleted.
 */
export async function pruneExpiredSessions(
  opts: { userId?: string } = {},
): Promise<number> {
  const where: { expiresAt: { lt: Date }; userId?: string } = {
    expiresAt: { lt: new Date() },
  };
  if (opts.userId) {
    where.userId = opts.userId;
  }
  const { count } = await prisma.session.deleteMany({ where });
  return count;
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

  try {
    await pruneExpiredSessions({ userId });
    if (Math.random() < SESSION_GLOBAL_PRUNE_PROB) {
      await pruneExpiredSessions();
    }
  } catch (err) {
    logger.warn("[session] expired-row cleanup failed", err);
  }

  return { token, expiresAt };
}

export async function setSessionCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
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
