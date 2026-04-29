import { NextRequest, NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { listPublishedRulesForUser } from "../../../../lib/server/publishedRules";
import {
  dbUnavailable,
  internalError,
  unauthorized,
} from "../../../../lib/server/responses";
import { getSessionUser } from "../../../../lib/server/session";
import { apiRoute } from "../../../../lib/server/apiRoute";

export const GET = apiRoute("rules.me.list", async (request: NextRequest) => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const take = Math.min(Number(searchParams.get("limit") ?? "50") || 50, 100);

  const rules = await listPublishedRulesForUser(user.id, take);
  if (rules === null) {
    return internalError("Failed to list rules");
  }

  return NextResponse.json({ rules });
});
