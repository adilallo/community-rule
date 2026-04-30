import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { FACET_GROUP_IDS } from "../../lib/server/validation/methodFacetsSchemas";
import { templateFacetFileSchema } from "../../lib/server/validation/templateFacetSchema";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATE_FACET_FILE = path.join(
  REPO_ROOT,
  "data",
  "templates",
  "templateFacet.json",
);

type TemplateFacetRow = {
  templateSlug: string;
  group: string;
  value: string;
  matches: boolean;
};

async function loadTemplateFacets() {
  const raw = await readFile(TEMPLATE_FACET_FILE, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const result = templateFacetFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Invalid template facet file ${TEMPLATE_FACET_FILE}: ${JSON.stringify(
        result.error.flatten(),
        null,
        2,
      )}`,
    );
  }
  return result.data;
}

/**
 * One row per `(templateSlug, group, value)` where the matrix lists a fit (✓).
 * Sparse: omitted cells are not stored (unlike `MethodFacet`, which materializes
 * all cells for constant table density).
 */
function flattenTemplateFacets(
  data: Awaited<ReturnType<typeof loadTemplateFacets>>,
): TemplateFacetRow[] {
  const rows: TemplateFacetRow[] = [];
  for (const [templateSlug, row] of Object.entries(data)) {
    for (const group of FACET_GROUP_IDS) {
      for (const value of row[group]) {
        rows.push({ templateSlug, group, value, matches: true });
      }
    }
  }
  return rows;
}

/**
 * Validates and re-seeds the `TemplateFacet` table from
 * `data/templates/templateFacet.json` (Template Composition-2, cols G–Y).
 */
export async function seedTemplateFacets(
  prisma: PrismaClient,
): Promise<{ rowCount: number }> {
  const data = await loadTemplateFacets();
  const rows = flattenTemplateFacets(data);
  await prisma.$transaction([
    prisma.templateFacet.deleteMany(),
    prisma.templateFacet.createMany({ data: rows }),
  ]);
  return { rowCount: rows.length };
}
