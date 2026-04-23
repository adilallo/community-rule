import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { dbUnavailable, notFound } from "../../../../lib/server/responses";
import { getPublicPublishedRuleById } from "../../../../lib/server/publishedRules";
import { apiRoute } from "../../../../lib/server/apiRoute";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = apiRoute<RouteContext>(
  "rules.byId",
  async (_request, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const { id } = await context.params;

    const rule = await getPublicPublishedRuleById(id);
    if (!rule) {
      return notFound();
    }

    return NextResponse.json({ rule });
  },
);
