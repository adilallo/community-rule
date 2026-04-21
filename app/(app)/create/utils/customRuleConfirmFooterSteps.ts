import type { CreateFlowState, CreateFlowStep } from "../types";
import type footerMessages from "../../../../messages/en/create/footer.json";

type FooterMessageKey = keyof typeof footerMessages;

/**
 * Binding for each Custom Rule stage step whose footer primary button
 * gates the user on "has at least one chip selected?". All five screens
 * render the same `<Button …>`; only the disable predicate and the
 * footer message differ — this table is the single source of truth for
 * both, so `CreateFlowLayoutClient` can render one JSX block for the
 * whole group.
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
  [
    {
      step: "core-values",
      footerMessageKey: "confirmCoreValues",
      selectionIds: (s) => s.selectedCoreValueIds ?? [],
    },
    {
      step: "communication-methods",
      footerMessageKey: "confirmCommunication",
      selectionIds: (s) => s.selectedCommunicationMethodIds ?? [],
    },
    {
      step: "membership-methods",
      footerMessageKey: "confirmMembership",
      selectionIds: (s) => s.selectedMembershipMethodIds ?? [],
    },
    {
      step: "decision-approaches",
      footerMessageKey: "confirmDecisionApproaches",
      selectionIds: (s) => s.selectedDecisionApproachIds ?? [],
    },
    {
      step: "conflict-management",
      footerMessageKey: "confirmConflictManagement",
      selectionIds: (s) => s.selectedConflictManagementIds ?? [],
    },
  ] as const;

export const CUSTOM_RULE_CONFIRM_FOOTER_STEP_BY_STEP: ReadonlyMap<
  CreateFlowStep,
  CustomRuleConfirmFooterStep
> = new Map(CUSTOM_RULE_CONFIRM_FOOTER_STEPS.map((e) => [e.step, e]));
