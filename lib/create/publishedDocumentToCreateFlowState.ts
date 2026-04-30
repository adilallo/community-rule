import type {
  CreateFlowMethodCardFacetSection,
  CreateFlowState,
} from "../../app/(app)/create/types";
import type { PublishedMethodSelections } from "./buildPublishPayload";
import type { StoredLastPublishedRule } from "./lastPublishedRule";

const PUBLISHED_SELECTION_FIELD_KEYS: readonly (keyof CreateFlowState)[] = [
  "selectedCoreValueIds",
  "selectedCommunicationMethodIds",
  "selectedMembershipMethodIds",
  "selectedDecisionApproachIds",
  "selectedConflictManagementIds",
] as const;

/**
 * True when `patch` (from {@link createFlowStateFromPublishedRule}) expects
 * non-empty facet selections but `state` still has none for that facet.
 *
 * Used so `/create/edit-rule` hydration is not skipped after TopNav **Edit**
 * pre-clears `sections` (which made `sections?.length === 0` look like a
 * finished hydrate even though method ids were never merged).
 */
export function isPublishedRuleSelectionMissing(
  state: CreateFlowState,
  patch: Partial<CreateFlowState>,
): boolean {
  for (const k of PUBLISHED_SELECTION_FIELD_KEYS) {
    const desired = patch[k];
    if (!Array.isArray(desired) || desired.length === 0) continue;
    const actualRaw = state[k];
    const actual = Array.isArray(actualRaw) ? actualRaw : [];
    if (actual.length === 0) return true;
  }
  return false;
}

/**
 * Pin flags for method-card facets: compact CardStack slots surface selections
 * first only when `methodSectionsPinCommitted[facet]` is true (see
 * `useMethodCardDeckOrdering`). Normal wizard flow sets that on facet **Confirm**.
 * Hydration paths that seed `selected*` method ids without a confirm (edit-published,
 * template customize) merge this alongside those ids so pinning matches UX after Confirm.
 *
 * Caller should spread onto existing `methodSectionsPinCommitted` so unrelated facets stay
 * as-is (`{ ...prior, ...this }`).
 */
export function methodSectionsPinsForHydratedSelections(
  patch: Partial<CreateFlowState>,
): Partial<Record<CreateFlowMethodCardFacetSection, boolean>> {
  const out: Partial<Record<CreateFlowMethodCardFacetSection, boolean>> = {};
  if ((patch.selectedCommunicationMethodIds?.length ?? 0) > 0) {
    out.communication = true;
  }
  if ((patch.selectedMembershipMethodIds?.length ?? 0) > 0) {
    out.membership = true;
  }
  if ((patch.selectedDecisionApproachIds?.length ?? 0) > 0) {
    out.decisionApproaches = true;
  }
  if ((patch.selectedConflictManagementIds?.length ?? 0) > 0) {
    out.conflictManagement = true;
  }
  return out;
}

/** @see {@link methodSectionsPinsForHydratedSelections} — published-rule hydrate naming. */
export function methodSectionsPinsFromPublishedHydratePatch(
  patch: Partial<CreateFlowState>,
): Partial<Record<CreateFlowMethodCardFacetSection, boolean>> {
  return methodSectionsPinsForHydratedSelections(patch);
}

/**
 * Rehydrate create-flow fields from a stored published rule so `/create/edit-rule`
 * can render final-review editors after refresh or when branching from completed.
 */
export function createFlowStateFromPublishedRule(
  rule: StoredLastPublishedRule,
): Partial<CreateFlowState> {
  const doc = rule.document;
  const out: Partial<CreateFlowState> = {
    title: rule.title,
    editingPublishedRuleId: rule.id,
  };
  const sum = typeof rule.summary === "string" ? rule.summary.trim() : "";
  if (sum.length > 0) {
    out.communityContext = sum;
    out.summary = sum;
  }

  const coreValues = doc.coreValues;
  if (Array.isArray(coreValues) && coreValues.length > 0) {
    const selectedCoreValueIds: string[] = [];
    const coreValuesChipsSnapshot: NonNullable<
      CreateFlowState["coreValuesChipsSnapshot"]
    > = [];
    const coreValueDetailsByChipId: NonNullable<
      CreateFlowState["coreValueDetailsByChipId"]
    > = {};

    for (const row of coreValues) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const chipIdRaw = typeof o.chipId === "string" ? o.chipId.trim() : "";
      const label = typeof o.label === "string" ? o.label.trim() : "";
      if (!label) continue;
      const chipId =
        chipIdRaw.length > 0 ? chipIdRaw : `hydrated-${label.toLowerCase()}`;
      selectedCoreValueIds.push(chipId);
      coreValuesChipsSnapshot.push({
        id: chipId,
        label,
        state: "selected",
      });
      coreValueDetailsByChipId[chipId] = {
        meaning: typeof o.meaning === "string" ? o.meaning : "",
        signals: typeof o.signals === "string" ? o.signals : "",
      };
    }
    out.selectedCoreValueIds = selectedCoreValueIds;
    out.coreValuesChipsSnapshot = coreValuesChipsSnapshot;
    out.coreValueDetailsByChipId = coreValueDetailsByChipId;
  }

  const msRaw = doc.methodSelections;
  if (!msRaw || typeof msRaw !== "object" || Array.isArray(msRaw)) {
    out.sections = [];
    return out;
  }
  const ms = msRaw as PublishedMethodSelections;

  if (Array.isArray(ms.communication) && ms.communication.length > 0) {
    out.selectedCommunicationMethodIds = ms.communication.map((x) => x.id);
    out.communicationMethodDetailsById = Object.fromEntries(
      ms.communication.map((x) => [x.id, x.sections]),
    );
  }
  if (Array.isArray(ms.membership) && ms.membership.length > 0) {
    out.selectedMembershipMethodIds = ms.membership.map((x) => x.id);
    out.membershipMethodDetailsById = Object.fromEntries(
      ms.membership.map((x) => [x.id, x.sections]),
    );
  }
  if (
    Array.isArray(ms.decisionApproaches) &&
    ms.decisionApproaches.length > 0
  ) {
    out.selectedDecisionApproachIds = ms.decisionApproaches.map((x) => x.id);
    out.decisionApproachDetailsById = Object.fromEntries(
      ms.decisionApproaches.map((x) => [x.id, x.sections]),
    );
  }
  if (
    Array.isArray(ms.conflictManagement) &&
    ms.conflictManagement.length > 0
  ) {
    out.selectedConflictManagementIds = ms.conflictManagement.map(
      (x) => x.id,
    );
    out.conflictManagementDetailsById = Object.fromEntries(
      ms.conflictManagement.map((x) => [x.id, x.sections]),
    );
  }

  /** Drop template `sections` so final-review uses `methodSelections` / selected ids (edit path). */
  out.sections = [];
  return out;
}
