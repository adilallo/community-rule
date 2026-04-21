import type { CreateFlowState } from "../../app/(app)/create/types";
import type { FinalReviewChipEditPatch } from "../../app/(app)/create/components/FinalReviewChipEditModal";

/**
 * Translate a {@link FinalReviewChipEditPatch} into the `Partial<CreateFlowState>`
 * patch that {@link CreateFlowState}'s update merger should write back. Each
 * group key targets its own `*DetailsById` (or `coreValueDetailsByChipId`)
 * record; the patch always merges the new value onto the existing record so
 * other chips' overrides are preserved.
 *
 * The `switch` is exhaustive because {@link FinalReviewChipEditPatch} is a
 * discriminated union — adding a new facet group in the modal forces a new
 * `case` here at compile time, which is the whole reason this lives outside
 * `FinalReviewScreen` (the screen used to host an identical 5-case switch).
 *
 * Exported as a pure function so it's unit-testable without React.
 */
export function applyFinalReviewChipEditPatch(
  state: CreateFlowState,
  patch: FinalReviewChipEditPatch,
): Partial<CreateFlowState> {
  switch (patch.groupKey) {
    case "coreValues":
      return {
        coreValueDetailsByChipId: {
          ...(state.coreValueDetailsByChipId ?? {}),
          [patch.overrideKey]: patch.value,
        },
      };
    case "communication":
      return {
        communicationMethodDetailsById: {
          ...(state.communicationMethodDetailsById ?? {}),
          [patch.overrideKey]: patch.value,
        },
      };
    case "membership":
      return {
        membershipMethodDetailsById: {
          ...(state.membershipMethodDetailsById ?? {}),
          [patch.overrideKey]: patch.value,
        },
      };
    case "decisionApproaches":
      return {
        decisionApproachDetailsById: {
          ...(state.decisionApproachDetailsById ?? {}),
          [patch.overrideKey]: patch.value,
        },
      };
    case "conflictManagement":
      return {
        conflictManagementDetailsById: {
          ...(state.conflictManagementDetailsById ?? {}),
          [patch.overrideKey]: patch.value,
        },
      };
  }
}
