import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../lib/server/env";
import { listRuleTemplatesFromDb } from "../../../lib/server/ruleTemplates";
import { dbUnavailable } from "../../../lib/server/responses";

/**
 * Curated rule templates for recommendations (seed via Prisma Studio or a script).
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const templates = await listRuleTemplatesFromDb();

  return NextResponse.json({ templates });
}
