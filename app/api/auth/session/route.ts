import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { dbUnavailable } from "../../../../lib/server/responses";
import { getSessionUser } from "../../../../lib/server/session";

export async function GET() {
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
}
