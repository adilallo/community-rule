import { z } from "zod";
import {
  MATURITY_VALUE_IDS,
  ORG_TYPE_VALUE_IDS,
  SCALE_VALUE_IDS,
  SIZE_VALUE_IDS,
} from "./methodFacetsSchemas";

const sizeValueIdSchema = z.enum(SIZE_VALUE_IDS);
const orgTypeValueIdSchema = z.enum(ORG_TYPE_VALUE_IDS);
const scaleValueIdSchema = z.enum(SCALE_VALUE_IDS);
const maturityValueIdSchema = z.enum(MATURITY_VALUE_IDS);

/**
 * Per-template row for Template Composition-2 (spreadsheet cols G–Y). Each
 * array lists canonical facet `value` ids that are a fit (✓) for that
 * community dimension.
 */
export const templateFacetRowSchema = z
  .object({
    size: z.array(sizeValueIdSchema),
    orgType: z.array(orgTypeValueIdSchema),
    scale: z.array(scaleValueIdSchema),
    maturity: z.array(maturityValueIdSchema),
  })
  .strict();

export const templateFacetFileSchema = z.record(
  z.string().min(1),
  templateFacetRowSchema,
);

export type TemplateFacetFile = z.infer<typeof templateFacetFileSchema>;
