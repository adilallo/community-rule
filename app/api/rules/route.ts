import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/server/db";
import { isDatabaseConfigured } from "../../../lib/server/env";
import { dbUnavailable } from "../../../lib/server/responses";
import { getSessionUser } from "../../../lib/server/session";

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { title, summary, document } = body as {
    title?: unknown;
    summary?: unknown;
    document?: unknown;
  };

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  if (document === undefined || typeof document !== "object" || document === null) {
    return NextResponse.json(
      { error: "document must be a JSON object" },
      { status: 400 },
    );
  }

  const rule = await prisma.publishedRule.create({
    data: {
      userId: user.id,
      title: title.trim(),
      summary:
        typeof summary === "string" && summary.trim().length > 0
          ? summary.trim()
          : null,
      document: document as object,
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
