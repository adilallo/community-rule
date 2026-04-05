import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { dbUnavailable } from "../../../../lib/server/responses";
import { destroySessionFromRequest } from "../../../../lib/server/session";

export async function POST() {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  await destroySessionFromRequest();
  return NextResponse.json({ ok: true });
}
