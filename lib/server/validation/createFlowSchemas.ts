import { z } from "zod";
import { FLOW_STEP_ORDER } from "../../../app/create/utils/flowSteps";
import { assertPlainJsonValue, DEFAULT_PLAIN_JSON_LIMITS } from "./plainJson";

const flowStepTuple = FLOW_STEP_ORDER as unknown as [string, ...string[]];

const createFlowStepSchema = z.enum(flowStepTuple);

/**
 * Published rule `document` column: arbitrary JSON object with safety bounds.
 */
export const publishedRuleDocumentSchema = z
  .record(z.string(), z.unknown())
  .superRefine((doc, ctx) => {
    const err = assertPlainJsonValue(doc, 0, DEFAULT_PLAIN_JSON_LIMITS);
    if (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: err,
      });
    }
  });

/**
 * Create-flow draft payload: known optional fields plus passthrough for future steps.
 * Full tree must satisfy {@link assertPlainJsonValue}.
 */
export const createFlowStateSchema = z
  .object({
    title: z.string().max(500).optional(),
    summary: z.string().max(8000).optional(),
    currentStep: createFlowStepSchema.optional(),
    sections: z.array(z.unknown()).optional(),
    stakeholders: z.array(z.unknown()).optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    const err = assertPlainJsonValue(data, 0, DEFAULT_PLAIN_JSON_LIMITS);
    if (err) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: err });
    }
  });

export const publishRuleBodySchema = z.object({
  title: z
    .string()
    .max(500)
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, { message: "title required" }),
  summary: z
    .union([z.string().max(8000), z.null()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null) {
        return null;
      }
      const t = val.trim();
      return t.length > 0 ? t : null;
    }),
  document: publishedRuleDocumentSchema,
});

export type PublishRuleBody = z.infer<typeof publishRuleBodySchema>;

export const putDraftBodySchema = z.object({
  payload: createFlowStateSchema,
});
export type CreateFlowStateValidated = z.infer<typeof createFlowStateSchema>;
