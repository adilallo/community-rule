import { describe, expect, it } from "vitest";
import {
  buildCoreValuesPrefillFromTemplateBody,
  buildTemplateCustomizePrefill,
} from "../../lib/create/applyTemplatePrefill";
import coreValuesMessages from "../../messages/en/create/customRule/coreValues.json";

function coreValuePresetId(label: string): string {
  const values = coreValuesMessages.values as Array<
    string | { label: string }
  >;
  const idx = values.findIndex((v) => {
    const l = typeof v === "string" ? v : v.label;
    return l.toLowerCase() === label.toLowerCase();
  });
  return String(idx + 1);
}

describe("buildTemplateCustomizePrefill", () => {
  it("returns an empty object for malformed bodies", () => {
    expect(buildTemplateCustomizePrefill(null)).toEqual({});
    expect(buildTemplateCustomizePrefill({})).toEqual({});
    expect(buildTemplateCustomizePrefill({ sections: "nope" })).toEqual({});
  });

  it("maps communication / membership / decisions / conflict titles to method-id slugs", () => {
    const body = {
      sections: [
        {
          categoryName: "Communication",
          entries: [
            { title: "In-Person Meetings", body: "x" },
            { title: "Loomio", body: "y" },
          ],
        },
        {
          categoryName: "Membership",
          entries: [{ title: "Peer Sponsorship", body: "m" }],
        },
        {
          categoryName: "Decision-making",
          entries: [{ title: "Consensus Decision-Making", body: "d" }],
        },
        {
          categoryName: "Conflict management",
          entries: [{ title: "Restorative Justice", body: "c" }],
        },
      ],
    };
    expect(buildTemplateCustomizePrefill(body)).toEqual({
      selectedCommunicationMethodIds: ["in-person-meetings", "loomio"],
      selectedMembershipMethodIds: ["peer-sponsorship"],
      selectedDecisionApproachIds: ["consensus-decision-making"],
      selectedConflictManagementIds: ["restorative-justice"],
    });
  });

  it("matches template Values against the preset list and marks them selected", () => {
    const body = {
      sections: [
        {
          categoryName: "Values",
          entries: [
            { title: "Consensus", body: "" },
            { title: "Community Care", body: "" },
          ],
        },
      ],
    };
    const prefill = buildTemplateCustomizePrefill(body);
    const selected = prefill.selectedCoreValueIds ?? [];
    expect(selected).toContain(coreValuePresetId("Consensus"));
    expect(selected).toContain(coreValuePresetId("Community Care"));

    const snapshot = prefill.coreValuesChipsSnapshot ?? [];
    const selectedRows = snapshot.filter((r) => r.state === "selected");
    expect(selectedRows.map((r) => r.label).sort()).toEqual([
      "Community Care",
      "Consensus",
    ]);
    // Unmatched presets should still appear, as unselected, so the screen
    // renders the full chip list (the select screen reads the snapshot as-is).
    expect(snapshot.length).toBeGreaterThan(selectedRows.length);
  });

  it("preserves bespoke template values as custom chip rows", () => {
    const body = {
      sections: [
        {
          categoryName: "Values",
          entries: [{ title: "Very Bespoke Thing", body: "" }],
        },
      ],
    };
    const prefill = buildTemplateCustomizePrefill(body);
    const custom = (prefill.coreValuesChipsSnapshot ?? []).find(
      (r) => r.label === "Very Bespoke Thing",
    );
    expect(custom).toBeDefined();
    expect(custom?.state).toBe("selected");
    expect(prefill.selectedCoreValueIds).toContain(custom?.id);
  });

  it("ignores unknown category names", () => {
    const prefill = buildTemplateCustomizePrefill({
      sections: [
        { categoryName: "Mystery", entries: [{ title: "What", body: "" }] },
      ],
    });
    expect(prefill).toEqual({});
  });
});

describe("buildCoreValuesPrefillFromTemplateBody", () => {
  it("returns {} for malformed bodies", () => {
    expect(buildCoreValuesPrefillFromTemplateBody(null)).toEqual({});
    expect(buildCoreValuesPrefillFromTemplateBody({})).toEqual({});
    expect(
      buildCoreValuesPrefillFromTemplateBody({ sections: "nope" }),
    ).toEqual({});
  });

  it("returns {} when the body has no Values section", () => {
    expect(
      buildCoreValuesPrefillFromTemplateBody({
        sections: [
          { categoryName: "Communication", entries: [{ title: "Signal" }] },
        ],
      }),
    ).toEqual({});
  });

  it("seeds the snapshot + selected ids from the Values section only", () => {
    const prefill = buildCoreValuesPrefillFromTemplateBody({
      sections: [
        {
          categoryName: "Values",
          entries: [
            { title: "Consensus", body: "" },
            { title: "Community Care", body: "" },
          ],
        },
        {
          categoryName: "Communication",
          entries: [{ title: "Signal", body: "" }],
        },
      ],
    });
    const selected = prefill.selectedCoreValueIds ?? [];
    expect(selected).toContain(coreValuePresetId("Consensus"));
    expect(selected).toContain(coreValuePresetId("Community Care"));
    // Methods should not be touched by the values-only helper.
    expect(prefill.selectedCommunicationMethodIds).toBeUndefined();
  });
});
