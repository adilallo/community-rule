import type {
  CommunicationMethodDetailEntry,
  ConflictManagementDetailEntry,
  DecisionApproachDetailEntry,
  MembershipMethodDetailEntry,
} from "../../app/(app)/create/types";
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
} from "./finalReviewChipPresets";

function stringArraysEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/** True when communication facet text matches {@link communicationPresetFor} for this card id. */
export function communicationMethodFacetMatchesPreset(
  details: CommunicationMethodDetailEntry | undefined,
  cardId: string,
): boolean {
  if (!details) return true;
  const p = communicationPresetFor(cardId);
  return (
    details.corePrinciple === p.corePrinciple &&
    details.logisticsAdmin === p.logisticsAdmin &&
    details.codeOfConduct === p.codeOfConduct
  );
}

export function membershipMethodFacetMatchesPreset(
  details: MembershipMethodDetailEntry | undefined,
  cardId: string,
): boolean {
  if (!details) return true;
  const p = membershipPresetFor(cardId);
  return (
    details.eligibility === p.eligibility &&
    details.joiningProcess === p.joiningProcess &&
    details.expectations === p.expectations
  );
}

export function decisionApproachFacetMatchesPreset(
  details: DecisionApproachDetailEntry | undefined,
  cardId: string,
): boolean {
  if (!details) return true;
  const p = decisionApproachPresetFor(cardId);
  return (
    details.corePrinciple === p.corePrinciple &&
    stringArraysEqual(details.applicableScope, p.applicableScope) &&
    stringArraysEqual(details.selectedApplicableScope, p.selectedApplicableScope) &&
    details.stepByStepInstructions === p.stepByStepInstructions &&
    details.consensusLevel === p.consensusLevel &&
    details.objectionsDeadlocks === p.objectionsDeadlocks
  );
}

export function conflictManagementFacetMatchesPreset(
  details: ConflictManagementDetailEntry | undefined,
  cardId: string,
): boolean {
  if (!details) return true;
  const p = conflictManagementPresetFor(cardId);
  return (
    details.corePrinciple === p.corePrinciple &&
    stringArraysEqual(details.applicableScope, p.applicableScope) &&
    stringArraysEqual(details.selectedApplicableScope, p.selectedApplicableScope) &&
    details.processProtocol === p.processProtocol &&
    details.restorationFallbacks === p.restorationFallbacks
  );
}
