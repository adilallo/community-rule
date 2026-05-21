import { describe, expect, it } from "vitest";
import useCasesCompletedRules from "../../messages/en/pages/useCasesCompletedRules.json";
import { createFlowStateFromPublishedRule } from "../../lib/create/publishedDocumentToCreateFlowState";
import { normalizePublishedDocumentForEdit } from "../../lib/create/normalizePublishedDocumentForEdit";

describe("normalizePublishedDocumentForEdit", () => {
  it("derives methodSelections and coreValues from use-case display sections", () => {
    const fixture = useCasesCompletedRules.mutualAidColorado;
    const normalized = normalizePublishedDocumentForEdit(fixture.document);

    expect(Array.isArray(normalized.coreValues)).toBe(true);
    expect((normalized.coreValues as unknown[]).length).toBeGreaterThan(0);

    const ms = normalized.methodSelections as Record<string, unknown>;
    expect(Array.isArray(ms.membership)).toBe(true);
    expect((ms.membership as unknown[]).length).toBeGreaterThan(0);
    expect(Array.isArray(ms.decisionApproaches)).toBe(true);
    expect((ms.decisionApproaches as unknown[]).length).toBeGreaterThan(0);
  });

  it("is idempotent when methodSelections already exist", () => {
    const once = normalizePublishedDocumentForEdit(
      useCasesCompletedRules.mutualAidColorado.document,
    );
    const twice = normalizePublishedDocumentForEdit(once);
    expect(twice.methodSelections).toEqual(once.methodSelections);
    expect(twice.coreValues).toEqual(once.coreValues);
  });
});

describe("createFlowStateFromPublishedRule with section-only documents", () => {
  it("hydrates method ids from normalized use-case duplicate shape", () => {
    const doc = normalizePublishedDocumentForEdit(
      useCasesCompletedRules.mutualAidColorado.document,
    );
    const patch = createFlowStateFromPublishedRule({
      id: "rule-1",
      title: "Mutual Aid Colorado Template (Copy)",
      summary: "Summary",
      document: doc as Record<string, unknown>,
    });

    expect(patch.selectedMembershipMethodIds?.length).toBeGreaterThan(0);
    expect(patch.selectedDecisionApproachIds?.length).toBeGreaterThan(0);
    expect(patch.selectedCoreValueIds?.length).toBeGreaterThan(0);
    expect(patch.sections).toEqual([]);
  });
});
