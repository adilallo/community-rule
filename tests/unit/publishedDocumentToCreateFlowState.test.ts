import { describe, expect, it } from "vitest";
import {
  createFlowStateFromPublishedRule,
  isPublishedRuleSelectionMissing,
  methodSectionsPinsForHydratedSelections,
  methodSectionsPinsFromPublishedHydratePatch,
} from "../../lib/create/publishedDocumentToCreateFlowState";
import type { CreateFlowState } from "../../app/(app)/create/types";

describe("isPublishedRuleSelectionMissing", () => {
  it("is true when published patch has communication ids but state has none", () => {
    const patch = createFlowStateFromPublishedRule({
      id: "r",
      title: "T",
      summary: "",
      document: {
        methodSelections: {
          communication: [
            {
              id: "slack",
              label: "Slack",
              sections: {
                corePrinciple: "",
                logisticsAdmin: "",
                codeOfConduct: "",
              },
            },
          ],
        },
      },
    });
    const state = {
      sections: [],
      title: "T",
      editingPublishedRuleId: "r",
    } as CreateFlowState;
    expect(isPublishedRuleSelectionMissing(state, patch)).toBe(true);
  });

  it("is false when sections are clear and state already has matching facet ids", () => {
    const patch = createFlowStateFromPublishedRule({
      id: "r",
      title: "T",
      summary: "",
      document: {
        methodSelections: {
          communication: [
            {
              id: "slack",
              label: "Slack",
              sections: {
                corePrinciple: "",
                logisticsAdmin: "",
                codeOfConduct: "",
              },
            },
          ],
        },
      },
    });
    const state = {
      sections: [],
      title: "T",
      editingPublishedRuleId: "r",
      selectedCommunicationMethodIds: ["slack"],
    } as CreateFlowState;
    expect(isPublishedRuleSelectionMissing(state, patch)).toBe(false);
  });
});

describe("methodSectionsPinsForHydratedSelections / methodSectionsPinsFromPublishedHydratePatch", () => {
  it("alias matches hydrated-selection helper output", () => {
    const partial: Partial<CreateFlowState> = {
      selectedCommunicationMethodIds: ["a"],
      selectedConflictManagementIds: ["b"],
    };
    expect(methodSectionsPinsFromPublishedHydratePatch(partial)).toEqual(
      methodSectionsPinsForHydratedSelections(partial),
    );
  });
});

describe("methodSectionsPinsFromPublishedHydratePatch", () => {
  it("sets communication when published patch includes communication ids", () => {
    const patch = createFlowStateFromPublishedRule({
      id: "r",
      title: "T",
      summary: "",
      document: {
        methodSelections: {
          communication: [
            {
              id: "slack",
              label: "Slack",
              sections: {
                corePrinciple: "",
                logisticsAdmin: "",
                codeOfConduct: "",
              },
            },
          ],
        },
      },
    });
    expect(methodSectionsPinsFromPublishedHydratePatch(patch)).toEqual({
      communication: true,
    });
  });

  it("sets all four method facets when each has selections on the patch", () => {
    const patch = createFlowStateFromPublishedRule({
      id: "r",
      title: "T",
      summary: "",
      document: {
        methodSelections: {
          communication: [
            {
              id: "slack",
              label: "S",
              sections: {
                corePrinciple: "",
                logisticsAdmin: "",
                codeOfConduct: "",
              },
            },
          ],
          membership: [
            {
              id: "x",
              label: "X",
              sections: {
                eligibility: "",
                joiningProcess: "",
                expectations: "",
              },
            },
          ],
          decisionApproaches: [
            {
              id: "d",
              label: "D",
              sections: {
                corePrinciple: "",
                applicableScope: [],
                selectedApplicableScope: [],
                stepByStepInstructions: "",
                consensusLevel: 0,
                objectionsDeadlocks: "",
              },
            },
          ],
          conflictManagement: [
            {
              id: "c",
              label: "C",
              sections: {
                corePrinciple: "",
                applicableScope: [],
                selectedApplicableScope: [],
                processProtocol: "",
                restorationFallbacks: "",
              },
            },
          ],
        },
      },
    });
    expect(methodSectionsPinsFromPublishedHydratePatch(patch)).toEqual({
      communication: true,
      membership: true,
      decisionApproaches: true,
      conflictManagement: true,
    });
  });

  it("returns {} when patch has no method-card selections", () => {
    expect(methodSectionsPinsFromPublishedHydratePatch({ sections: [] })).toEqual(
      {},
    );
  });
});

describe("createFlowStateFromPublishedRule", () => {
  it("maps coreValues and methodSelections into draft fields", () => {
    const partial = createFlowStateFromPublishedRule({
      id: "rule-1",
      title: "Oak",
      summary: "River cleanup",
      document: {
        coreValues: [
          { chipId: "1", label: "Ecology", meaning: "m", signals: "s" },
        ],
        methodSelections: {
          communication: [
            {
              id: "slack",
              label: "Slack",
              sections: {
                corePrinciple: "p",
                logisticsAdmin: "l",
                codeOfConduct: "c",
              },
            },
          ],
        },
      },
    });
    expect(partial.editingPublishedRuleId).toBe("rule-1");
    expect(partial.title).toBe("Oak");
    expect(partial.communityContext).toBe("River cleanup");
    expect(partial.selectedCoreValueIds).toEqual(["1"]);
    expect(partial.coreValuesChipsSnapshot?.[0]?.label).toBe("Ecology");
    expect(partial.selectedCommunicationMethodIds).toEqual(["slack"]);
    expect(partial.communicationMethodDetailsById?.slack?.corePrinciple).toBe(
      "p",
    );
    expect(partial.sections).toEqual([]);
  });

  it("sets sections to [] even when methodSelections is missing (edit hydrate)", () => {
    const partial = createFlowStateFromPublishedRule({
      id: "rule-2",
      title: "Pine",
      summary: "",
      document: {
        coreValues: [],
      },
    });
    expect(partial.sections).toEqual([]);
  });
});
