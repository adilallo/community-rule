import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { dbUnavailable } from "../../../../lib/server/responses";
import { getSessionUser } from "../../../../lib/server/session";
import { apiRoute } from "../../../../lib/server/apiRoute";

export const GET = apiRoute("auth.session", async () => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email },
  });
});
