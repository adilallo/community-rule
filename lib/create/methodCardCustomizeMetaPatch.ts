import type { CreateFlowState } from "../../app/(app)/create/types";
import type { MethodCardHeaderDraft } from "./methodCardCustomizeSession";

/**
 * Merges edited customize header strings into persisted method-card meta.
 */
export function methodCardMetaWithCustomizeHeader(
  existing: CreateFlowState["customMethodCardMetaById"],
  pendingCardId: string,
  header: MethodCardHeaderDraft,
): NonNullable<CreateFlowState["customMethodCardMetaById"]> {
  return {
    ...(existing ?? {}),
    [pendingCardId]: {
      label: header.title,
      supportText: header.description,
    },
  };
}
