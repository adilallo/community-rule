import { describe, expect, it } from "vitest";
import type { CreateFlowState } from "../../app/(app)/create/types";
import { removeMethodCardFromFacetSelection } from "../../lib/create/removeMethodCardFromFacetSelection";

const CUSTOM_A = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

describe("removeMethodCardFromFacetSelection", () => {
  it("returns {} when the card is not in the facet selection", () => {
    const state: CreateFlowState = {
      selectedCommunicationMethodIds: ["signal"],
    };
    expect(
      removeMethodCardFromFacetSelection(state, "communication", "loomio"),
    ).toEqual({});
  });

  it("removes a preset id, its details, and leaves other selections", () => {
    const state: CreateFlowState = {
      selectedCommunicationMethodIds: ["signal", "slack"],
      communicationMethodDetailsById: {
        signal: {} as never,
        slack: {} as never,
      },
    };
    const patch = removeMethodCardFromFacetSelection(
      state,
      "communication",
      "signal",
    );
    expect(patch.selectedCommunicationMethodIds).toEqual(["slack"]);
    expect(patch.communicationMethodDetailsById).toEqual({ slack: {} });
  });

  it("removes a custom card id and clears meta + field blocks", () => {
    const state: CreateFlowState = {
      selectedCommunicationMethodIds: ["signal", CUSTOM_A],
      communicationMethodDetailsById: {
        signal: {} as never,
        [CUSTOM_A]: {} as never,
      },
      customMethodCardMetaById: {
        [CUSTOM_A]: { label: "P", supportText: "D" },
      },
      customMethodCardFieldBlocksById: {
        [CUSTOM_A]: [],
      },
    };
    const patch = removeMethodCardFromFacetSelection(
      state,
      "communication",
      CUSTOM_A,
    );
    expect(patch.selectedCommunicationMethodIds).toEqual(["signal"]);
    expect(patch.communicationMethodDetailsById).toEqual({ signal: {} });
    expect(patch.customMethodCardMetaById).toBeUndefined();
    expect(patch.customMethodCardFieldBlocksById).toBeUndefined();
  });
});
