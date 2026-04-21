import { describe, expect, it } from "vitest";
import { applyFinalReviewChipEditPatch } from "../../lib/create/applyFinalReviewChipEditPatch";
import type { CreateFlowState } from "../../app/(app)/create/types";
import type { FinalReviewChipEditPatch } from "../../app/(app)/create/components/FinalReviewChipEditModal";

describe("applyFinalReviewChipEditPatch", () => {
  it("creates the coreValueDetailsByChipId record when missing", () => {
    const patch: FinalReviewChipEditPatch = {
      groupKey: "coreValues",
      overrideKey: "accessibility",
      value: { meaning: "Be welcoming.", signals: "Captions on videos." },
    };

    const result = applyFinalReviewChipEditPatch({}, patch);

    expect(result).toEqual({
      coreValueDetailsByChipId: {
        accessibility: {
          meaning: "Be welcoming.",
          signals: "Captions on videos.",
        },
      },
    });
  });

  it("merges into the existing record without dropping siblings", () => {
    const state: CreateFlowState = {
      communicationMethodDetailsById: {
        signal: {
          corePrinciple: "Stay async-first.",
          logisticsAdmin: "Daily check-ins.",
          codeOfConduct: "Be kind.",
        },
      },
    };
    const patch: FinalReviewChipEditPatch = {
      groupKey: "communication",
      overrideKey: "in-person-meetings",
      value: {
        corePrinciple: "Meet weekly.",
        logisticsAdmin: "Hybrid format.",
        codeOfConduct: "Listen actively.",
      },
    };

    const result = applyFinalReviewChipEditPatch(state, patch);

    expect(result.communicationMethodDetailsById).toEqual({
      signal: {
        corePrinciple: "Stay async-first.",
        logisticsAdmin: "Daily check-ins.",
        codeOfConduct: "Be kind.",
      },
      "in-person-meetings": {
        corePrinciple: "Meet weekly.",
        logisticsAdmin: "Hybrid format.",
        codeOfConduct: "Listen actively.",
      },
    });
  });

  it("overwrites the same key when the user re-saves it", () => {
    const state: CreateFlowState = {
      membershipMethodDetailsById: {
        "open-access": {
          eligibility: "Anyone",
          joiningProcess: "Sign up",
          expectations: "Old expectations",
        },
      },
    };
    const patch: FinalReviewChipEditPatch = {
      groupKey: "membership",
      overrideKey: "open-access",
      value: {
        eligibility: "Anyone over 18",
        joiningProcess: "Sign up + intro call",
        expectations: "New expectations",
      },
    };

    const result = applyFinalReviewChipEditPatch(state, patch);

    expect(result.membershipMethodDetailsById?.["open-access"]).toEqual({
      eligibility: "Anyone over 18",
      joiningProcess: "Sign up + intro call",
      expectations: "New expectations",
    });
  });

  it("routes decisionApproaches to its dedicated state field", () => {
    const patch: FinalReviewChipEditPatch = {
      groupKey: "decisionApproaches",
      overrideKey: "lazy-consensus",
      value: {
        corePrinciple: "Silence implies assent.",
        applicableScope: ["budget"],
        selectedApplicableScope: ["budget"],
        stepByStepInstructions: "Propose. Wait 72h.",
        consensusLevel: 0.66,
        objectionsDeadlocks: "Escalate to vote.",
      },
    };

    const result = applyFinalReviewChipEditPatch({}, patch);

    expect(Object.keys(result)).toEqual(["decisionApproachDetailsById"]);
  });

  it("routes conflictManagement to its dedicated state field", () => {
    const patch: FinalReviewChipEditPatch = {
      groupKey: "conflictManagement",
      overrideKey: "peer-mediation",
      value: {
        corePrinciple: "Restore trust.",
        applicableScope: ["interpersonal"],
        selectedApplicableScope: ["interpersonal"],
        processProtocol: "Pair the parties with a neutral facilitator.",
        restorationFallbacks: "Council escalation.",
      },
    };

    const result = applyFinalReviewChipEditPatch({}, patch);

    expect(Object.keys(result)).toEqual(["conflictManagementDetailsById"]);
  });
});
