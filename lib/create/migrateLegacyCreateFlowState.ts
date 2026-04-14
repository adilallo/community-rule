import type { CreateFlowState } from "../../app/create/types";

/**
 * Maps pre-rename draft keys and step ids (`community-reflection` → `community-save`).
 * Safe to run on any parsed draft payload before merging into context.
 */
export function migrateLegacyCreateFlowState(
  raw: Record<string, unknown> | null | undefined,
): CreateFlowState {
  if (!raw || typeof raw !== "object") return {};
  const next: Record<string, unknown> = { ...raw };
  if (typeof next.communityReflection === "string") {
    if (
      next.communitySaveEmail === undefined ||
      next.communitySaveEmail === ""
    ) {
      next.communitySaveEmail = next.communityReflection;
    }
  }
  delete next.communityReflection;
  if (next.currentStep === "community-reflection") {
    next.currentStep = "community-save";
  }
  return next as CreateFlowState;
}
