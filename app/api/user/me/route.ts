import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import {
  dbUnavailable,
  internalError,
  unauthorized,
} from "../../../../lib/server/responses";
import {
  clearSessionCookie,
  getSessionUser,
} from "../../../../lib/server/session";
import { apiRoute } from "../../../../lib/server/apiRoute";

/**
 * Delete the signed-in user and associated data.
 *
 * **Policy (CR-86 / Ticket 15):** Prisma `User` deletion cascades `Session` and
 * `RuleDraft`. `PublishedRule` uses `onDelete: SetNull` on `userId`, so published
 * rules remain public with `userId = null` (anonymous/orphan rows) rather than
 * being removed with the account. Change would require a schema migration if
 * product later requires deleting all published rules with the user.
 */
export const DELETE = apiRoute("user.me.delete", async () => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  try {
    await prisma.user.delete({ where: { id: user.id } });
  } catch {
    return internalError("Failed to delete account");
  }

  await clearSessionCookie();

  return NextResponse.json({ ok: true });
});
