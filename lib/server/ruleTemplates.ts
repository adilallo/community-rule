import type { RuleTemplateDto } from "../create/fetchTemplates";
import { prisma } from "./db";
import { isDatabaseConfigured } from "./env";

/**
 * Curated templates for public list UIs (same query as GET /api/templates).
 * Returns [] when the database is not configured or on query failure.
 */
export async function listRuleTemplatesFromDb(): Promise<RuleTemplateDto[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    return await prisma.ruleTemplate.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        description: true,
        body: true,
        sortOrder: true,
        featured: true,
      },
    });
  } catch {
    return [];
  }
}
