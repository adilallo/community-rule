import { describe, expect, it } from "vitest";
import {
  assignTemplateMethodSlugsToPrefill,
  createFlowStepForCustomRuleFacetGroup,
  CUSTOM_RULE_FACETS,
  CUSTOM_RULE_FACET_BY_GROUP,
  METHOD_FACET_API_SECTION_IDS,
  PUBLISHED_CUSTOM_RULE_SELECTION_KEYS,
  readMethodPresetsForFacetGroup,
  STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS,
} from "../../lib/create/customRuleFacets";
import { SECTION_IDS } from "../../lib/server/validation/methodFacetsSchemas";
import type { CreateFlowStep } from "../../app/(app)/create/types";

describe("customRuleFacets (CR-92)", () => {
  it("METHOD_FACET_API_SECTION_IDS matches API SECTION_IDS", () => {
    expect([...METHOD_FACET_API_SECTION_IDS]).toEqual([...SECTION_IDS]);
  });

  it("has five rows in stable order", () => {
    expect(CUSTOM_RULE_FACETS.map((r) => r.facetGroupKey)).toEqual([
      "coreValues",
      "communication",
      "membership",
      "decisionApproaches",
      "conflictManagement",
    ]);
  });

  it("facet group map covers every TemplateFacetGroupKey", () => {
    for (const row of CUSTOM_RULE_FACETS) {
      expect(CUSTOM_RULE_FACET_BY_GROUP.get(row.facetGroupKey)).toBe(row);
    }
  });

  it("createFlowStepForCustomRuleFacetGroup matches footer steps", () => {
    const steps = new Set<CreateFlowStep>();
    for (const row of CUSTOM_RULE_FACETS) {
      steps.add(createFlowStepForCustomRuleFacetGroup(row.facetGroupKey));
    }
    expect(steps.has("core-values")).toBe(true);
    expect(steps.has("communication-methods")).toBe(true);
    expect(steps.has("membership-methods")).toBe(true);
    expect(steps.has("decision-approaches")).toBe(true);
    expect(steps.has("conflict-management")).toBe(true);
  });

  it("assignTemplateMethodSlugsToPrefill maps normalised keys", () => {
    const prefill: Record<string, unknown> = {};
    expect(assignTemplateMethodSlugsToPrefill(prefill, "communications", ["a"])).toBe(
      true,
    );
    expect(prefill.selectedCommunicationMethodIds).toEqual(["a"]);
  });

  it("published selection keys are the five selected* fields", () => {
    expect(PUBLISHED_CUSTOM_RULE_SELECTION_KEYS).toEqual([
      "selectedCoreValueIds",
      "selectedCommunicationMethodIds",
      "selectedMembershipMethodIds",
      "selectedDecisionApproachIds",
      "selectedConflictManagementIds",
    ]);
  });

  it("strip keys include method pins once", () => {
    const pinCount = STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS.filter(
      (k) => k === "methodSectionsPinCommitted",
    ).length;
    expect(pinCount).toBe(1);
  });

  it("readMethodPresetsForFacetGroup returns ids for communication", () => {
    const m = readMethodPresetsForFacetGroup("communication");
    expect(m.length).toBeGreaterThan(0);
    expect(typeof m[0]!.id).toBe("string");
  });
});
