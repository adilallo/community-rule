import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import {
  dbUnavailable,
  forbidden,
  notFound,
  unauthorized,
} from "../../../../lib/server/responses";
import { getPublicPublishedRuleById } from "../../../../lib/server/publishedRules";
import { getSessionUser } from "../../../../lib/server/session";
import { apiRoute } from "../../../../lib/server/apiRoute";
import { publishRuleBodySchema } from "../../../../lib/server/validation/createFlowSchemas";
import { readLimitedJson } from "../../../../lib/server/validation/requestBody";
import { jsonFromZodError } from "../../../../lib/server/validation/zodHttp";

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

    const user = await getSessionUser();
    let viewerIsOwner = false;
    if (user) {
      const ownerRow = await prisma.publishedRule.findUnique({
        where: { id },
        select: { userId: true },
      });
      viewerIsOwner = ownerRow?.userId === user.id;
    }

    return NextResponse.json({ rule, viewerIsOwner });
  },
);

export const PATCH = apiRoute<RouteContext>(
  "rules.byId.patch",
  async (request: NextRequest, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id } = await context.params;

    const row = await prisma.publishedRule.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!row) {
      return notFound();
    }
    if (row.userId !== user.id) {
      return forbidden("You do not have permission to update this rule");
    }

    const parsedBody = await readLimitedJson(request);
    if (parsedBody.ok === false) {
      return parsedBody.response;
    }

    const validated = publishRuleBodySchema.safeParse(parsedBody.value);
    if (!validated.success) {
      return jsonFromZodError(validated.error);
    }

    const { title, summary, document } = validated.data;

    await prisma.publishedRule.update({
      where: { id: row.id },
      data: {
        title,
        summary,
        document: document as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ ok: true });
  },
);

export const DELETE = apiRoute<RouteContext>(
  "rules.byId.delete",
  async (_request, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id } = await context.params;

    const row = await prisma.publishedRule.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!row) {
      return notFound();
    }
    if (row.userId !== user.id) {
      return forbidden("You do not have permission to delete this rule");
    }

    await prisma.publishedRule.delete({ where: { id: row.id } });

    return NextResponse.json({ ok: true });
  },
);
