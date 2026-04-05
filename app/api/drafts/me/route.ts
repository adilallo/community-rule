import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { dbUnavailable } from "../../../../lib/server/responses";
import { getSessionUser } from "../../../../lib/server/session";

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
    draft: draft ? { payload: draft.payload, updatedAt: draft.updatedAt } : null,
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("payload" in body)) {
    return NextResponse.json({ error: "payload required" }, { status: 400 });
  }

  const payload = (body as { payload: unknown }).payload;
  if (payload === undefined || typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { error: "payload must be a JSON object" },
      { status: 400 },
    );
  }

  const draft = await prisma.ruleDraft.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      payload: payload as object,
    },
    update: {
      payload: payload as object,
    },
  });

  return NextResponse.json({
    draft: { payload: draft.payload, updatedAt: draft.updatedAt },
  });
}
