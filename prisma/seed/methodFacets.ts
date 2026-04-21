import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import {
  FACET_GROUP_IDS,
  FACET_VALUE_IDS_BY_GROUP,
  SECTION_IDS,
  type SectionId,
  facetGroupsFileSchema,
  resolveFacetMatch,
  sectionFacetsSchema,
} from "../../lib/server/validation/methodFacetsSchemas";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DATA_DIR = path.join(REPO_ROOT, "data", "create", "customRule");

/**
 * Reads + Zod-validates `data/create/customRule/<section>.json`.
 * Throws on schema failures so the seed aborts before any DB write.
 */
async function loadSectionFacets(section: SectionId) {
  const file = path.join(DATA_DIR, `${section}.json`);
  const raw = await readFile(file, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const result = sectionFacetsSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Invalid facet file ${file}: ${JSON.stringify(result.error.flatten(), null, 2)}`,
    );
  }
  return result.data;
}

async function loadFacetGroups() {
  const file = path.join(DATA_DIR, "_facetGroups.json");
  const raw = await readFile(file, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const result = facetGroupsFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Invalid facet groups file ${file}: ${JSON.stringify(result.error.flatten(), null, 2)}`,
    );
  }
  return result.data;
}

type MethodFacetRow = {
  section: string;
  slug: string;
  group: string;
  value: string;
  matches: boolean;
  weight: number | null;
};

/**
 * Flattens `{ size: { oneMember: true, ... }, orgType: { ... } }` per slug
 * into one row per `(section, slug, group, value)`. Omitted groups/values
 * default to `false` so the table density is constant.
 */
function flattenSectionFacets(
  section: SectionId,
  facets: Awaited<ReturnType<typeof loadSectionFacets>>,
): MethodFacetRow[] {
  const rows: MethodFacetRow[] = [];
  for (const [slug, perMethod] of Object.entries(facets)) {
    for (const group of FACET_GROUP_IDS) {
      const groupValues = perMethod[group];
      for (const value of FACET_VALUE_IDS_BY_GROUP[group]) {
        const cell = groupValues?.[value as keyof typeof groupValues];
        const { match, weight } = resolveFacetMatch(cell);
        rows.push({
          section,
          slug,
          group,
          value,
          matches: match,
          weight,
        });
      }
    }
  }
  return rows;
}

/**
 * Validates and re-seeds the `MethodFacet` table from the JSON files.
 * Per-section atomic swap so the table is never partially populated.
 *
 * `_facetGroups.json` is validated for schema correctness but not stored —
 * its only runtime purpose is the chip-id ↔ canonical-id lookup, which is
 * read directly from the JSON by the wizard ranker.
 */
export async function seedMethodFacets(prisma: PrismaClient): Promise<{
  rowsBySection: Record<SectionId, number>;
}> {
  await loadFacetGroups();

  const rowsBySection: Record<SectionId, number> = {
    communication: 0,
    membership: 0,
    decisionApproaches: 0,
    conflictManagement: 0,
  };

  for (const section of SECTION_IDS) {
    const facets = await loadSectionFacets(section);
    const rows = flattenSectionFacets(section, facets);
    rowsBySection[section] = rows.length;
    await prisma.$transaction([
      prisma.methodFacet.deleteMany({ where: { section } }),
      prisma.methodFacet.createMany({ data: rows }),
    ]);
  }

  return { rowsBySection };
}
