import { describe, expect, it } from "vitest";
import { CREATE_FLOW_SCREEN_REGISTRY } from "../../app/(app)/create/utils/createFlowScreenRegistry";
import { VALID_STEPS } from "../../app/(app)/create/utils/flowSteps";

describe("create flow registry vs valid steps (CR-92 §3)", () => {
  it("CREATE_FLOW_SCREEN_REGISTRY defines every VALID_STEPS id", () => {
    const keys = new Set(Object.keys(CREATE_FLOW_SCREEN_REGISTRY));
    for (const step of VALID_STEPS) {
      expect(keys.has(step), `missing registry entry for ${step}`).toBe(true);
    }
    expect(keys.size).toBe(VALID_STEPS.length);
  });
});
