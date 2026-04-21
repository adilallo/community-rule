import type footerMessages from "../../../../messages/en/create/footer.json";
import type { CreateFlowStep } from "../types";

type FooterMessages = typeof footerMessages;

/**
 * Per-step label override for the default "next-step" primary footer
 * button (the catch-all branch in `CreateFlowLayoutClient`'s footer that
 * fires `goToNextStep` for steps without a bespoke footer). Steps absent
 * from this map fall back to `footer.next`.
 *
 * `final-review` is handled separately by the caller because its label
 * also depends on the in-flight publish flag (`finalizeButtonPublishing`
 * vs `finalizeCommunityRule`).
 */
const DEFAULT_FOOTER_LABEL_BY_STEP: ReadonlyMap<
  CreateFlowStep,
  keyof FooterMessages
> = new Map<CreateFlowStep, keyof FooterMessages>([
  ["confirm-stakeholders", "confirmStakeholders"],
  ["community-context", "confirmDescription"],
  ["community-structure", "confirmDetails"],
  ["community-size", "confirmMembers"],
]);

/**
 * Resolve the localized label for the default "next-step" footer button.
 * Returns the per-step override when one is registered, otherwise
 * `footer.next`. Caller still owns the `final-review` special case.
 */
export function getDefaultFooterLabel(
  step: CreateFlowStep | null | undefined,
  footer: FooterMessages,
): string {
  if (step == null) return footer.next;
  const key = DEFAULT_FOOTER_LABEL_BY_STEP.get(step);
  return key != null ? footer[key] : footer.next;
}
