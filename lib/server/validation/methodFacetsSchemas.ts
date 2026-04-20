import { z } from "zod";

/**
 * Zod schemas for the recommendation matrix (CR-88).
 *
 * Source of truth at runtime is `data/create/customRule/<section>.json` plus
 * `data/create/customRule/_facetGroups.json`. These schemas validate those
 * files at seed time and in the parity test (`tests/unit/methodFacets.test.ts`).
 * They are also reused by the API request shapes for `/api/templates` and
 * `/api/create-flow/methods` so a single set of canonical ids drives both
 * the on-disk JSON and the query-string contract.
 *
 * See `docs/guides/template-recommendation-matrix.md` §2 (canonical 19
 * facet values), §6 (JSON shape), §7 (`MethodFacet` schema), §9 (API).
 */

export const SECTION_IDS = [
  "communication",
  "membership",
  "decisionApproaches",
  "conflictManagement",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
export const sectionIdSchema = z.enum(SECTION_IDS);

export const FACET_GROUP_IDS = [
  "size",
  "orgType",
  "scale",
  "maturity",
] as const;
export type FacetGroupId = (typeof FACET_GROUP_IDS)[number];
export const facetGroupIdSchema = z.enum(FACET_GROUP_IDS);

export const SIZE_VALUE_IDS = [
  "oneMember",
  "twoToFive",
  "sixToTwelve",
  "thirteenToOneHundred",
  "oneHundredToOneHundredK",
] as const;
export const ORG_TYPE_VALUE_IDS = [
  "dao",
  "forProfit",
  "nonprofit",
  "openSource",
  "mutualAid",
  "workersCoop",
] as const;
export const SCALE_VALUE_IDS = [
  "global",
  "national",
  "regional",
  "local",
] as const;
export const MATURITY_VALUE_IDS = [
  "earlyStage",
  "growthStage",
  "established",
  "enterprise",
] as const;

export type SizeValueId = (typeof SIZE_VALUE_IDS)[number];
export type OrgTypeValueId = (typeof ORG_TYPE_VALUE_IDS)[number];
export type ScaleValueId = (typeof SCALE_VALUE_IDS)[number];
export type MaturityValueId = (typeof MATURITY_VALUE_IDS)[number];

export const FACET_VALUE_IDS_BY_GROUP: Record<
  FacetGroupId,
  readonly string[]
> = {
  size: SIZE_VALUE_IDS,
  orgType: ORG_TYPE_VALUE_IDS,
  scale: SCALE_VALUE_IDS,
  maturity: MATURITY_VALUE_IDS,
};

const sizeValueIdSchema = z.enum(SIZE_VALUE_IDS);
const orgTypeValueIdSchema = z.enum(ORG_TYPE_VALUE_IDS);
const scaleValueIdSchema = z.enum(SCALE_VALUE_IDS);
const maturityValueIdSchema = z.enum(MATURITY_VALUE_IDS);

/**
 * Per-cell shape: bare boolean, or an object with optional `weight`.
 * The object form is reserved for a future weighted-rank pass (v1 ignores
 * `weight`; see §9.1 "Notes").
 */
const facetMatchSchema = z.union([
  z.boolean(),
  z
    .object({
      match: z.boolean(),
      weight: z.number().finite().optional(),
    })
    .strict(),
]);
export type FacetMatch = z.infer<typeof facetMatchSchema>;

/**
 * Builds a Zod object schema for a facet group where every canonical value id
 * is optional. Omitted keys default to `false` (see §6 "Bulk shorthand").
 */
function partialGroupSchema<Values extends readonly [string, ...string[]]>(
  values: Values,
) {
  const enumSchema = z.enum(values);
  return z.record(enumSchema, facetMatchSchema);
}

const sizeFacetsSchema = partialGroupSchema(SIZE_VALUE_IDS);
const orgTypeFacetsSchema = partialGroupSchema(ORG_TYPE_VALUE_IDS);
const scaleFacetsSchema = partialGroupSchema(SCALE_VALUE_IDS);
const maturityFacetsSchema = partialGroupSchema(MATURITY_VALUE_IDS);

/**
 * Per-method facet entry. All four groups are optional; an omitted group
 * defaults to "all false" at seed time (see `flattenSectionFacets` in
 * `prisma/seed/methodFacets.ts`).
 */
export const methodFacetsSchema = z
  .object({
    size: sizeFacetsSchema.optional(),
    orgType: orgTypeFacetsSchema.optional(),
    scale: scaleFacetsSchema.optional(),
    maturity: maturityFacetsSchema.optional(),
  })
  .strict();
export type MethodFacets = z.infer<typeof methodFacetsSchema>;

/**
 * Whole-section file shape: object keyed by method slug
 * (`messages/en/create/customRule/<section>.json#/methods[].id`).
 */
export const sectionFacetsSchema = z.record(z.string(), methodFacetsSchema);
export type SectionFacetsFile = z.infer<typeof sectionFacetsSchema>;

/**
 * `_facetGroups.json` shape: positional chip id ↔ canonical facet value id
 * mapping (see §2). Validated alongside the section files so chip drift in a
 * messages file fails CI loudly.
 */
const facetGroupValueEntrySchema = z
  .object({
    chipId: z.string().min(1),
  })
  .strict();

const facetGroupBlockSchema = z
  .object({
    source: z.string().min(1),
    values: z.record(z.string(), facetGroupValueEntrySchema),
  })
  .strict();

export const facetGroupsFileSchema = z
  .object({
    size: facetGroupBlockSchema,
    orgType: facetGroupBlockSchema,
    scale: facetGroupBlockSchema,
    maturity: facetGroupBlockSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    for (const group of FACET_GROUP_IDS) {
      const expected = new Set(FACET_VALUE_IDS_BY_GROUP[group]);
      const actual = new Set(Object.keys(data[group].values));
      for (const v of expected) {
        if (!actual.has(v)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [group, "values"],
            message: `Missing canonical value ${v}`,
          });
        }
      }
      for (const v of actual) {
        if (!expected.has(v)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [group, "values", v],
            message: `Unknown facet value ${v} for group ${group}`,
          });
        }
      }
    }
  });
export type FacetGroupsFile = z.infer<typeof facetGroupsFileSchema>;

/**
 * Resolve a `FacetMatch` value to its boolean (the shape can be either a bare
 * boolean or `{ match, weight? }`). Used by both the seed flattener and the
 * scoring helpers.
 */
export function resolveFacetMatch(
  v: FacetMatch | undefined,
): { match: boolean; weight: number | null } {
  if (v === undefined) return { match: false, weight: null };
  if (typeof v === "boolean") return { match: v, weight: null };
  return { match: v.match, weight: v.weight ?? null };
}

// ---------------------------------------------------------------------------
// API request shapes (used by /api/templates and /api/create-flow/methods)
// ---------------------------------------------------------------------------

/**
 * Generic facet-id-array shape, scoped per group. URLSearchParams produces
 * either a single string or repeated values; both flatten to `string[]`.
 */
export const requestedFacetsSchema = z
  .object({
    size: z.array(sizeValueIdSchema).max(SIZE_VALUE_IDS.length).optional(),
    orgType: z
      .array(orgTypeValueIdSchema)
      .max(ORG_TYPE_VALUE_IDS.length)
      .optional(),
    scale: z.array(scaleValueIdSchema).max(SCALE_VALUE_IDS.length).optional(),
    maturity: z
      .array(maturityValueIdSchema)
      .max(MATURITY_VALUE_IDS.length)
      .optional(),
  })
  .strict();
export type RequestedFacets = z.infer<typeof requestedFacetsSchema>;

/** Flattened `(group, value)` tuple for scoring. */
export type RequestedFacetPair = { group: FacetGroupId; value: string };

export function flattenRequestedFacets(
  facets: RequestedFacets,
): RequestedFacetPair[] {
  const out: RequestedFacetPair[] = [];
  for (const group of FACET_GROUP_IDS) {
    const values = facets[group];
    if (!values) continue;
    for (const value of values) {
      out.push({ group, value });
    }
  }
  return out;
}

/**
 * Parse `?facet.size=oneMember&facet.orgType=dao&facet.orgType=nonprofit` into
 * a typed `RequestedFacets`. Unknown groups and unknown values are dropped
 * silently — the API "never errors on partial facets" (§9.3).
 */
export function parseRequestedFacetsFromSearchParams(
  search: URLSearchParams,
): RequestedFacets {
  const collected: Record<FacetGroupId, Set<string>> = {
    size: new Set(),
    orgType: new Set(),
    scale: new Set(),
    maturity: new Set(),
  };
  for (const [rawKey, rawVal] of search.entries()) {
    if (!rawKey.startsWith("facet.")) continue;
    const group = rawKey.slice("facet.".length) as FacetGroupId;
    if (!FACET_GROUP_IDS.includes(group)) continue;
    const allowed = new Set(FACET_VALUE_IDS_BY_GROUP[group]);
    if (allowed.has(rawVal)) {
      collected[group].add(rawVal);
    }
  }
  const out: RequestedFacets = {};
  for (const group of FACET_GROUP_IDS) {
    if (collected[group].size > 0) {
      out[group] = Array.from(collected[group]) as never;
    }
  }
  return out;
}
