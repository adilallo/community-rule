import { z } from "zod";
import { FLOW_STEP_ORDER } from "../../../app/(app)/create/utils/flowSteps";
import { assertPlainJsonValue, DEFAULT_PLAIN_JSON_LIMITS } from "./plainJson";

const flowStepTuple = FLOW_STEP_ORDER as unknown as [string, ...string[]];

const createFlowStepSchema = z.enum(flowStepTuple);

const communityStructureChipSnapshotRowSchema = z.object({
  id: z.string().max(200),
  label: z.string().max(2000),
  state: z.string().max(32).optional(),
});

const communityStructureChipSnapshotsSchema = z
  .object({
    organizationTypes: z.array(communityStructureChipSnapshotRowSchema).optional(),
    scale: z.array(communityStructureChipSnapshotRowSchema).optional(),
    maturity: z.array(communityStructureChipSnapshotRowSchema).optional(),
  })
  .strict();

const coreValueDetailEntrySchema = z.object({
  meaning: z.string().max(8000),
  signals: z.string().max(8000),
});

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
    communityContext: z.string().max(48).optional(),
    communitySaveEmail: z.string().max(320).optional(),
    selectedCommunitySizeIds: z.array(z.string()).optional(),
    selectedOrganizationTypeIds: z.array(z.string()).optional(),
    selectedScaleIds: z.array(z.string()).optional(),
    selectedMaturityIds: z.array(z.string()).optional(),
    communityStructureChipSnapshots:
      communityStructureChipSnapshotsSchema.optional(),
    selectedCoreValueIds: z.array(z.string()).max(200).optional(),
    coreValuesChipsSnapshot: z
      .array(communityStructureChipSnapshotRowSchema)
      .optional(),
    coreValueDetailsByChipId: z
      .record(coreValueDetailEntrySchema)
      .optional(),
    selectedCommunicationMethodIds: z.array(z.string()).max(200).optional(),
    selectedMembershipMethodIds: z.array(z.string()).max(200).optional(),
    selectedDecisionApproachIds: z.array(z.string()).max(200).optional(),
    selectedConflictManagementIds: z.array(z.string()).max(200).optional(),
    pendingTemplateAction: z
      .object({
        slug: z.string().max(200),
        mode: z.enum(["customize", "useWithoutChanges"]),
      })
      .strict()
      .optional(),
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
