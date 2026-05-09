import { CUSTOM_RULE_FACETS } from "../../../../lib/create/customRuleFacets";
import type {
  CreateFlowMethodCardFacetSection,
  CreateFlowState,
  CreateFlowStep,
} from "../types";
import type footerMessages from "../../../../messages/en/create/footer.json";

type FooterMessageKey = keyof typeof footerMessages;

/**
 * Binding for each Custom Rule stage step whose footer primary button
 * gates the user on "has at least one chip selected?". All five screens
 * render the same `<Button …>`; only the disable predicate and the
 * footer message differ — rows are derived from {@link CUSTOM_RULE_FACETS}
 * (Linear CR-92) so `CreateFlowLayoutClient` stays aligned with template
 * prefill, strip keys, and API section ids.
 *
 * `selectionIds` returns the currently-selected ids array from flow
 * state for that step (empty array when nothing has been selected or
 * the field hasn't been touched). Returning a fresh array on empty is
 * fine: these are read-only length checks, not memo keys.
 *
 * Note: the Confirm Stakeholders step has its own dedicated label copy
 * and is not gated on a selection count, so it stays out of this table.
 * Template-review and Community Save also have bespoke two-button
 * layouts and are intentionally excluded.
 */
export type CustomRuleConfirmFooterStep = {
  step: Extract<
    CreateFlowStep,
    | "core-values"
    | "communication-methods"
    | "membership-methods"
    | "decision-approaches"
    | "conflict-management"
  >;
  footerMessageKey: FooterMessageKey;
  selectionIds: (state: CreateFlowState) => readonly string[];
};

export const CUSTOM_RULE_CONFIRM_FOOTER_STEPS: readonly CustomRuleConfirmFooterStep[] =
  CUSTOM_RULE_FACETS.filter((r) => r.footerMessageKey != null).map((r) => ({
    step: r.createFlowStep as CustomRuleConfirmFooterStep["step"],
    footerMessageKey: r.footerMessageKey as FooterMessageKey,
    selectionIds: r.selectionIds,
  }));

export const CUSTOM_RULE_CONFIRM_FOOTER_STEP_BY_STEP: ReadonlyMap<
  CreateFlowStep,
  CustomRuleConfirmFooterStep
> = new Map(CUSTOM_RULE_CONFIRM_FOOTER_STEPS.map((e) => [e.step, e]));

/**
 * Map a custom-rule Confirm footer step to the facet-backed method-card section
 * (core values omit — chip MultiSelect uses a different ordering model).
 */
export function methodCardFacetSectionForConfirmStep(
  step: CustomRuleConfirmFooterStep["step"],
): CreateFlowMethodCardFacetSection | undefined {
  const row = CUSTOM_RULE_FACETS.find((r) => r.createFlowStep === step);
  if (row == null || row.kind !== "method" || row.apiMethodSectionId == null) {
    return undefined;
  }
  return row.apiMethodSectionId;
}
