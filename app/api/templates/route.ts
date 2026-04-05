import { NextResponse } from "next/server";
import { prisma } from "../../../lib/server/db";
import { isDatabaseConfigured } from "../../../lib/server/env";
import { dbUnavailable } from "../../../lib/server/responses";

/**
 * Curated rule templates for recommendations (seed via Prisma Studio or a script).
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const templates = await prisma.ruleTemplate.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      description: true,
      body: true,
      featured: true,
    },
  });

  return NextResponse.json({ templates });
}
