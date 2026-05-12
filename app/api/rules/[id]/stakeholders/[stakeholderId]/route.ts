import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../../../lib/server/env";
import { apiRoute } from "../../../../../../lib/server/apiRoute";
import {
  dbUnavailable,
  forbidden,
  notFound,
  unauthorized,
} from "../../../../../../lib/server/responses";
import { getSessionUser } from "../../../../../../lib/server/session";

type RouteContext = { params: Promise<{ id: string; stakeholderId: string }> };

export const DELETE = apiRoute<RouteContext>(
  "rules.stakeholders.delete",
  async (_request: NextRequest, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id: ruleId, stakeholderId } = await context.params;

    const row = await prisma.ruleStakeholder.findFirst({
      where: { id: stakeholderId, ruleId },
      select: {
        id: true,
        rule: { select: { userId: true } },
      },
    });

    if (!row) {
      return notFound();
    }
    if (row.rule.userId !== user.id) {
      return forbidden();
    }

    await prisma.ruleStakeholder.delete({ where: { id: row.id } });

    return NextResponse.json({ ok: true });
  },
);
