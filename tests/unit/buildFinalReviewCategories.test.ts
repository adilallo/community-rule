import { describe, it, expect } from "vitest";
import { buildFinalReviewCategoriesFromState } from "../../lib/create/buildFinalReviewCategories";
import type { CreateFlowState } from "../../app/(app)/create/types";

const NAMES = {
  values: "Values",
  communication: "Communication",
  membership: "Membership",
  decisions: "Decision-making",
  conflict: "Conflict management",
};

describe("buildFinalReviewCategoriesFromState", () => {
  it("returns [] when state has no selections and no sections", () => {
    expect(buildFinalReviewCategoriesFromState({}, NAMES)).toEqual([]);
  });

  it("resolves method ids to labels from message presets", () => {
    // IDs here match `messages/en/create/customRule/*.json` `methods[].id`.
    // Same shape `buildTemplateCustomizePrefill` emits via methodSlugFromTitle.
    const state: CreateFlowState = {
      selectedCommunicationMethodIds: ["signal", "in-person-meetings"],
      selectedMembershipMethodIds: ["open-access"],
      selectedDecisionApproachIds: ["lazy-consensus"],
      selectedConflictManagementIds: ["peer-mediation"],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    const byName = new Map(rows.map((r) => [r.name, r.chips]));
    expect(byName.get("Communication")).toEqual([
      "Signal",
      "In-Person Meetings",
    ]);
    expect(byName.get("Membership")).toEqual(["Open Access"]);
    expect(byName.get("Decision-making")).toEqual(["Lazy Consensus"]);
    expect(byName.get("Conflict management")).toEqual(["Peer Mediation"]);
    expect(byName.has("Values")).toBe(false);
  });

  it("derives core values via buildCoreValuesForDocument (snapshot + selected ids)", () => {
    const state: CreateFlowState = {
      selectedCoreValueIds: ["1", "custom-one"],
      coreValuesChipsSnapshot: [
        { id: "1", label: "Accessibility", state: "selected" },
        { id: "2", label: "Accountability", state: "unselected" },
        { id: "custom-one", label: "Resilience", state: "selected" },
      ],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    expect(rows).toEqual([
      { name: "Values", chips: ["Accessibility", "Resilience"] },
    ]);
  });

  it("drops unknown ids silently instead of inserting empty labels", () => {
    const state: CreateFlowState = {
      selectedCommunicationMethodIds: ["signal", "bogus-id"],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    expect(rows).toEqual([{ name: "Communication", chips: ["Signal"] }]);
  });

  it("dedupes repeated labels from duplicate ids", () => {
    const state: CreateFlowState = {
      selectedCommunicationMethodIds: ["signal", "signal"],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    expect(rows).toEqual([{ name: "Communication", chips: ["Signal"] }]);
  });

  it("prefers state.sections when populated (use-without-changes path)", () => {
    const state: CreateFlowState = {
      sections: [
        {
          categoryName: "Values",
          entries: [
            { title: "Consciousness", body: "…" },
            { title: "Ecology", body: "…" },
          ],
        },
        {
          categoryName: "Communication",
          entries: [{ title: "Signal", body: "…" }],
        },
      ],
      // Selection ids must be ignored when sections is present — the
      // "Use without changes" handler resets them for exactly that reason,
      // but we double-check the helper honors the sections branch first.
      selectedCommunicationMethodIds: ["in-person-meetings"],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    expect(rows).toEqual([
      { name: "Values", chips: ["Consciousness", "Ecology"] },
      { name: "Communication", chips: ["Signal"] },
    ]);
  });

  it("prepends a Values row from coreValuesChipsSnapshot when sections lack one", () => {
    const state: CreateFlowState = {
      sections: [
        {
          categoryName: "Communication",
          entries: [{ title: "Signal", body: "…" }],
        },
      ],
      selectedCoreValueIds: ["1"],
      coreValuesChipsSnapshot: [
        { id: "1", label: "Accessibility", state: "selected" },
      ],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    expect(rows).toEqual([
      { name: "Values", chips: ["Accessibility"] },
      { name: "Communication", chips: ["Signal"] },
    ]);
  });

  it("does not duplicate Values when sections already includes one", () => {
    const state: CreateFlowState = {
      sections: [
        {
          categoryName: "Values",
          entries: [{ title: "Consciousness", body: "…" }],
        },
      ],
      selectedCoreValueIds: ["1"],
      coreValuesChipsSnapshot: [
        { id: "1", label: "Accessibility", state: "selected" },
      ],
    };
    const rows = buildFinalReviewCategoriesFromState(state, NAMES);
    expect(rows).toEqual([
      { name: "Values", chips: ["Consciousness"] },
    ]);
  });
});
