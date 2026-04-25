import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../../lib/server/env";
import {
  dbUnavailable,
  forbidden,
  notFound,
  unauthorized,
} from "../../../../../lib/server/responses";
import { getSessionUser } from "../../../../../lib/server/session";
import { apiRoute } from "../../../../../lib/server/apiRoute";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = apiRoute<RouteContext>(
  "rules.byId.duplicate",
  async (_request, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id } = await context.params;

    const source = await prisma.publishedRule.findUnique({
      where: { id },
    });
    if (!source) {
      return notFound();
    }
    if (source.userId !== user.id) {
      return forbidden("You do not have permission to duplicate this rule");
    }

    const newRule = await prisma.publishedRule.create({
      data: {
        userId: user.id,
        title: `${source.title} (Copy)`,
        summary: source.summary,
        document: source.document,
      },
    });

    return NextResponse.json({
      rule: {
        id: newRule.id,
        title: newRule.title,
        summary: newRule.summary,
        createdAt: newRule.createdAt,
        updatedAt: newRule.updatedAt,
      },
    });
  },
);
