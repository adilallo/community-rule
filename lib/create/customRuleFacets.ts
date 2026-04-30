/**
 * Single source of truth for custom-rule facet dimensions: URL steps, template
 * category keys, footer confirm bindings, API method sections, and related
 * state keys (Linear CR-92 §1 — `CUSTOM_RULE_FACETS`).
 *
 * Callers: `applyTemplatePrefill`, `customRuleConfirmFooterSteps`,
 * `stripCustomRuleSelectionFields`, `buildFinalReviewCategories`,
 * `facetGroupToCreateFlowStep`, `methodFacetsSchemas` (`SECTION_IDS`),
 * `publishedDocumentToCreateFlowState` (selection keys), pin lists, etc.
 */

import type { CreateFlowState, CreateFlowStep } from "../../app/(app)/create/types";
import type footerMessages from "../../messages/en/create/footer.json";
import communicationMessages from "../../messages/en/create/customRule/communication.json";
import conflictManagementMessages from "../../messages/en/create/customRule/conflictManagement.json";
import decisionApproachesMessages from "../../messages/en/create/customRule/decisionApproaches.json";
import membershipMessages from "../../messages/en/create/customRule/membership.json";

type FooterMessageKey = keyof typeof footerMessages;

type MethodPreset = { id: string; label: string };

/**
 * Known facet groups that template sections map to. Matches the five modals on
 * the custom-rule create flow (`m.create.customRule.*`).
 */
export type TemplateFacetGroupKey =
  | "coreValues"
  | "communication"
  | "membership"
  | "decisionApproaches"
  | "conflictManagement";

function readMethodsArray(source: unknown): MethodPreset[] {
  if (!source || typeof source !== "object") return [];
  const methods = (source as { methods?: unknown }).methods;
  if (!Array.isArray(methods)) return [];
  const out: MethodPreset[] = [];
  for (const raw of methods) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    if (typeof o.id === "string" && typeof o.label === "string") {
      out.push({ id: o.id, label: o.label });
    }
  }
  return out;
}

const METHOD_MESSAGES: Record<
  Exclude<TemplateFacetGroupKey, "coreValues">,
  unknown
> = {
  communication: communicationMessages,
  membership: membershipMessages,
  decisionApproaches: decisionApproachesMessages,
  conflictManagement: conflictManagementMessages,
};

/** API + recommendation `section` param ids (CR-88); excludes core values. */
export const METHOD_FACET_API_SECTION_IDS = [
  "communication",
  "membership",
  "decisionApproaches",
  "conflictManagement",
] as const;

export type MethodFacetApiSectionId = (typeof METHOD_FACET_API_SECTION_IDS)[number];

export type CustomRuleFacetKind = "coreValues" | "method";

export type CustomRuleFacetRow = {
  readonly facetGroupKey: TemplateFacetGroupKey;
  readonly kind: CustomRuleFacetKind;
  readonly createFlowStep: CreateFlowStep;
  /**
   * Normalised template `categoryName` keys (see `applyTemplatePrefill` /
   * `templateCategoryToGroupKey`) — which headers map to this facet.
   */
  readonly templateCategoryNormalizedKeys: readonly string[];
  /** Footer primary on confirm steps; `null` if this row is not in that table. */
  readonly footerMessageKey: FooterMessageKey | null;
  readonly selectionIds: (state: CreateFlowState) => readonly string[];
  /** Primary selection array on `CreateFlowState` (hydrate + published checks). */
  readonly selectedIdsStateKey: keyof CreateFlowState;
  /**
   * Per-chip edit overrides map (`FinalReviewChipEditPatch` target) keyed by
   * chip/preset id, e.g. `communicationMethodDetailsById`.
   */
  readonly detailOverridesStateKey: keyof CreateFlowState;
  /** Keys removed by `stripCustomRuleSelectionFields` for this facet. */
  readonly stripSelectionKeys: readonly (keyof CreateFlowState)[];
  /** `GET /api/create-flow/methods?section=` — only for `kind === "method"`. */
  readonly apiMethodSectionId: MethodFacetApiSectionId | null;
};

const coreValuesRow = {
  facetGroupKey: "coreValues",
  kind: "coreValues",
  createFlowStep: "core-values",
  templateCategoryNormalizedKeys: ["values", "corevalues"] as const,
  footerMessageKey: "confirmCoreValues",
  selectionIds: (s: CreateFlowState) => s.selectedCoreValueIds ?? [],
  selectedIdsStateKey: "selectedCoreValueIds",
  detailOverridesStateKey: "coreValueDetailsByChipId",
  stripSelectionKeys: [
    "selectedCoreValueIds",
    "coreValuesChipsSnapshot",
    "coreValueDetailsByChipId",
  ] as const,
  apiMethodSectionId: null,
} satisfies CustomRuleFacetRow;

const communicationRow = {
  facetGroupKey: "communication",
  kind: "method",
  createFlowStep: "communication-methods",
  templateCategoryNormalizedKeys: ["communication", "communications"] as const,
  footerMessageKey: "confirmCommunication",
  selectionIds: (s: CreateFlowState) => s.selectedCommunicationMethodIds ?? [],
  selectedIdsStateKey: "selectedCommunicationMethodIds",
  detailOverridesStateKey: "communicationMethodDetailsById",
  stripSelectionKeys: ["selectedCommunicationMethodIds"] as const,
  apiMethodSectionId: "communication",
} satisfies CustomRuleFacetRow;

const membershipRow = {
  facetGroupKey: "membership",
  kind: "method",
  createFlowStep: "membership-methods",
  templateCategoryNormalizedKeys: ["membership", "memberships"] as const,
  footerMessageKey: "confirmMembership",
  selectionIds: (s: CreateFlowState) => s.selectedMembershipMethodIds ?? [],
  selectedIdsStateKey: "selectedMembershipMethodIds",
  detailOverridesStateKey: "membershipMethodDetailsById",
  stripSelectionKeys: ["selectedMembershipMethodIds"] as const,
  apiMethodSectionId: "membership",
} satisfies CustomRuleFacetRow;

const decisionRow = {
  facetGroupKey: "decisionApproaches",
  kind: "method",
  createFlowStep: "decision-approaches",
  templateCategoryNormalizedKeys: [
    "decisionmaking",
    "decisionapproaches",
    "decisions",
  ] as const,
  footerMessageKey: "confirmDecisionApproaches",
  selectionIds: (s: CreateFlowState) => s.selectedDecisionApproachIds ?? [],
  selectedIdsStateKey: "selectedDecisionApproachIds",
  detailOverridesStateKey: "decisionApproachDetailsById",
  stripSelectionKeys: ["selectedDecisionApproachIds"] as const,
  apiMethodSectionId: "decisionApproaches",
} satisfies CustomRuleFacetRow;

const conflictRow = {
  facetGroupKey: "conflictManagement",
  kind: "method",
  createFlowStep: "conflict-management",
  templateCategoryNormalizedKeys: [
    "conflictmanagement",
    "conflict",
    "conflictresolution",
  ] as const,
  footerMessageKey: "confirmConflictManagement",
  selectionIds: (s: CreateFlowState) => s.selectedConflictManagementIds ?? [],
  selectedIdsStateKey: "selectedConflictManagementIds",
  detailOverridesStateKey: "conflictManagementDetailsById",
  stripSelectionKeys: ["selectedConflictManagementIds"] as const,
  apiMethodSectionId: "conflictManagement",
} satisfies CustomRuleFacetRow;

/**
 * Ordered facet rows: core values first, then the four method groups (matches
 * footer confirm order and typical wizard progression).
 */
export const CUSTOM_RULE_FACETS: readonly CustomRuleFacetRow[] = [
  coreValuesRow,
  communicationRow,
  membershipRow,
  decisionRow,
  conflictRow,
] as const;

export const CUSTOM_RULE_FACET_BY_GROUP: ReadonlyMap<
  TemplateFacetGroupKey,
  CustomRuleFacetRow
> = new Map(CUSTOM_RULE_FACETS.map((r) => [r.facetGroupKey, r]));

/** Keys cleared by {@link stripCustomRuleSelectionFields} (plus pin map). */
export const STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS: readonly (keyof CreateFlowState)[] =
  [
    ...CUSTOM_RULE_FACETS.flatMap((r) => [...r.stripSelectionKeys]),
    "methodSectionsPinCommitted",
  ];

/** `selected*` keys used when merging published rule selections into draft. */
export const PUBLISHED_CUSTOM_RULE_SELECTION_KEYS: readonly (keyof CreateFlowState)[] =
  CUSTOM_RULE_FACETS.map((r) => r.selectedIdsStateKey);

export function readMethodPresetsForFacetGroup(
  groupKey: TemplateFacetGroupKey,
): readonly MethodPreset[] {
  if (groupKey === "coreValues") return [];
  return readMethodsArray(METHOD_MESSAGES[groupKey]);
}

export function assignTemplateMethodSlugsToPrefill(
  prefill: Partial<CreateFlowState>,
  normalizedCategoryKey: string,
  slugs: string[],
): boolean {
  for (const row of CUSTOM_RULE_FACETS) {
    if (row.kind !== "method") continue;
    if (!row.templateCategoryNormalizedKeys.includes(normalizedCategoryKey)) {
      continue;
    }
    const k = row.selectedIdsStateKey;
    (prefill as Record<string, unknown>)[k] = slugs;
    return true;
  }
  return false;
}

export function createFlowStepForCustomRuleFacetGroup(
  groupKey: TemplateFacetGroupKey,
): CreateFlowStep {
  const row = CUSTOM_RULE_FACET_BY_GROUP.get(groupKey);
  if (!row) {
    throw new Error(`customRuleFacets: unknown group ${groupKey}`);
  }
  return row.createFlowStep;
}

export function templateCategoryToFacetGroupKey(
  categoryName: string,
): TemplateFacetGroupKey | null {
  const key = categoryName.toLowerCase().replace(/[^a-z]+/g, "");
  for (const row of CUSTOM_RULE_FACETS) {
    if (row.templateCategoryNormalizedKeys.includes(key)) {
      return row.facetGroupKey;
    }
  }
  return null;
}
