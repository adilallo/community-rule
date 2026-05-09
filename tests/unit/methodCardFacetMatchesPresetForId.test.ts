import { describe, expect, it } from "vitest";
import { communicationPresetFor } from "../../lib/create/finalReviewChipPresets";
import { communicationMethodFacetMatchesPreset } from "../../lib/create/methodCardFacetMatchesPresetForId";

const uuid = "550e8400-e29b-41d4-a716-446655440000";

describe("methodCardFacetMatchesPresetForId", () => {
  it("communication: matches fresh preset seed for an unknown id", () => {
    const p = communicationPresetFor(uuid);
    expect(communicationMethodFacetMatchesPreset(p, uuid)).toBe(true);
  });

  it("communication: mismatches when any section differs from preset", () => {
    const p = communicationPresetFor(uuid);
    expect(
      communicationMethodFacetMatchesPreset(
        { ...p, corePrinciple: "edited" },
        uuid,
      ),
    ).toBe(false);
  });
});
