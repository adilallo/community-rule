import { describe, expect, it } from "vitest";
import { createFlowStateFromPublishedRule } from "../../lib/create/publishedDocumentToCreateFlowState";

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
