import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { dbUnavailable } from "../../../../lib/server/responses";
import { getSessionUser } from "../../../../lib/server/session";
import { putDraftBodySchema } from "../../../../lib/server/validation/createFlowSchemas";
import { readLimitedJson } from "../../../../lib/server/validation/requestBody";
import { jsonFromZodError } from "../../../../lib/server/validation/zodHttp";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const draft = await prisma.ruleDraft.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({
    draft: draft
      ? { payload: draft.payload, updatedAt: draft.updatedAt }
      : null,
  });
}

export async function PUT(request: NextRequest) {
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

  const validated = putDraftBodySchema.safeParse(parsedBody.value);
  if (!validated.success) {
    return jsonFromZodError(validated.error);
  }

  const { payload } = validated.data;

  const jsonPayload = payload as Prisma.InputJsonValue;

  const draft = await prisma.ruleDraft.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      payload: jsonPayload,
    },
    update: {
      payload: jsonPayload,
    },
  });

  return NextResponse.json({
    draft: { payload: draft.payload, updatedAt: draft.updatedAt },
  });
}

export async function DELETE() {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Idempotent: missing draft is a no-op so callers can fire-and-forget after
  // publish / exit without worrying about prior state.
  await prisma.ruleDraft.deleteMany({ where: { userId: user.id } });

  return NextResponse.json({ ok: true });
}
