import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/server/db";
import { isDatabaseConfigured } from "../../../lib/server/env";
import { dbUnavailable } from "../../../lib/server/responses";
import { getSessionUser } from "../../../lib/server/session";
import { publishRuleBodySchema } from "../../../lib/server/validation/createFlowSchemas";
import { readLimitedJson } from "../../../lib/server/validation/requestBody";
import { jsonFromZodError } from "../../../lib/server/validation/zodHttp";

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const { searchParams } = new URL(request.url);
  const take = Math.min(Number(searchParams.get("limit") ?? "50") || 50, 100);

  const rules = await prisma.publishedRule.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      title: true,
      summary: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ rules });
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const rule = await prisma.publishedRule.create({
    data: {
      userId: user.id,
      title,
      summary,
      document: document as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({
    rule: {
      id: rule.id,
      title: rule.title,
      summary: rule.summary,
      createdAt: rule.createdAt,
    },
  });
}
