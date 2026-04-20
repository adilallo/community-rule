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
 * Final-review edit modal details per group, merged onto preset defaults at
 * publish time. Shapes mirror the custom-rule add-method modals.
 */
const communicationMethodDetailEntrySchema = z.object({
  corePrinciple: z.string().max(8000),
  logisticsAdmin: z.string().max(8000),
  codeOfConduct: z.string().max(8000),
});

const membershipMethodDetailEntrySchema = z.object({
  eligibility: z.string().max(8000),
  joiningProcess: z.string().max(8000),
  expectations: z.string().max(8000),
});

const decisionApproachDetailEntrySchema = z.object({
  corePrinciple: z.string().max(8000),
  applicableScope: z.array(z.string().max(2000)).max(50),
  selectedApplicableScope: z.array(z.string().max(2000)).max(50),
  stepByStepInstructions: z.string().max(8000),
  consensusLevel: z.number().int().min(0).max(100),
  objectionsDeadlocks: z.string().max(8000),
});

const conflictManagementDetailEntrySchema = z.object({
  corePrinciple: z.string().max(8000),
  applicableScope: z.array(z.string().max(2000)).max(50),
  selectedApplicableScope: z.array(z.string().max(2000)).max(50),
  processProtocol: z.string().max(8000),
  restorationFallbacks: z.string().max(8000),
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
    communicationMethodDetailsById: z
      .record(communicationMethodDetailEntrySchema)
      .optional(),
    membershipMethodDetailsById: z
      .record(membershipMethodDetailEntrySchema)
      .optional(),
    decisionApproachDetailsById: z
      .record(decisionApproachDetailEntrySchema)
      .optional(),
    conflictManagementDetailsById: z
      .record(conflictManagementDetailEntrySchema)
      .optional(),
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
