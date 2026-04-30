import { describe, expect, it } from "vitest";
import { stripCustomRuleSelectionFields } from "../../lib/create/stripCustomRuleSelectionFields";
import type { CreateFlowState } from "../../app/(app)/create/types";

describe("stripCustomRuleSelectionFields", () => {
  it("removes custom-rule selection facets and preserves community + template sections", () => {
    const prev: CreateFlowState = {
      title: "Garden",
      communityContext: "...",
      selectedCoreValueIds: ["1"],
      coreValuesChipsSnapshot: [{ id: "1", label: "X", state: "selected" }],
      selectedCommunicationMethodIds: ["signal"],
      selectedMembershipMethodIds: ["x"],
      selectedDecisionApproachIds: ["y"],
      selectedConflictManagementIds: ["z"],
      methodSectionsPinCommitted: { communication: true },
      coreValueDetailsByChipId: { "1": { meaning: "", signals: "" } },
      sections: [{ categoryName: "Communication", entries: [] }],
    };
    const out = stripCustomRuleSelectionFields(prev);
    expect(out.title).toBe("Garden");
    expect(out.sections).toEqual(prev.sections);
    expect(out.selectedCoreValueIds).toBeUndefined();
    expect(out.coreValuesChipsSnapshot).toBeUndefined();
    expect(out.selectedCommunicationMethodIds).toBeUndefined();
    expect(out.selectedMembershipMethodIds).toBeUndefined();
    expect(out.selectedDecisionApproachIds).toBeUndefined();
    expect(out.selectedConflictManagementIds).toBeUndefined();
    expect(out.methodSectionsPinCommitted).toBeUndefined();
    expect(out.coreValueDetailsByChipId).toBeUndefined();
  });
});
