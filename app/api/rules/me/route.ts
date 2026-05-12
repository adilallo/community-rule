import { NextRequest, NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { listProfileRulesForUser } from "../../../../lib/server/publishedRules";
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

  const rules = await listProfileRulesForUser(user.id, take);
  if (rules === null) {
    return internalError("Failed to list rules");
  }

  return NextResponse.json({
    rules: rules.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      role: r.role,
    })),
  });
});
