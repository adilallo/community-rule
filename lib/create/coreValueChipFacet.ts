import type {
  CommunityStructureChipSnapshotRow,
  CreateFlowState,
} from "../../app/(app)/create/types";
import {
  duplicateMethodCardTitle,
  omitIdFromStringRecord,
} from "./duplicateMethodCardModalDraft";
import { moveFacetSelectionIdToFront } from "./methodCardSelectionOrder";

export const MAX_SELECTED_CORE_VALUES = 5;

/** Remove a chip from snapshot, selection ids, and per-chip detail overrides. */
export function removeCoreValueChipFromDraft(
  state: CreateFlowState,
  chipId: string,
): Partial<CreateFlowState> {
  const snap = state.coreValuesChipsSnapshot ?? [];
  const nextSnap = snap.filter((r) => r.id !== chipId);
  const sel = [...(state.selectedCoreValueIds ?? [])].filter((id) => id !== chipId);
  const hadDetail =
    Boolean(state.coreValueDetailsByChipId) &&
    Object.prototype.hasOwnProperty.call(state.coreValueDetailsByChipId, chipId);
  const nextDetails = hadDetail
    ? omitIdFromStringRecord(state.coreValueDetailsByChipId, chipId)
    : undefined;

  const out: Partial<CreateFlowState> = {
    coreValuesChipsSnapshot: nextSnap,
    selectedCoreValueIds: sel,
  };

  if (hadDetail) {
    out.coreValueDetailsByChipId = nextDetails;
  }

  return out;
}

/** Clone a core value chip with a suffixed label; returns null when at capacity. */
export function duplicateCoreValueChipInDraft(
  state: CreateFlowState,
  chipId: string,
  duplicateTitleSuffix: string,
): {
  patch: Partial<CreateFlowState>;
  newId: string;
  newLabel: string;
} | null {
  const sel = [...(state.selectedCoreValueIds ?? [])];
  if (sel.length >= MAX_SELECTED_CORE_VALUES) {
    return null;
  }
  const snap = state.coreValuesChipsSnapshot ?? [];
  const row = snap.find((r) => r.id === chipId);
  if (!row) {
    return null;
  }
  const rawLabel =
    typeof row.label === "string" && row.label.trim().length > 0
      ? row.label.trim()
      : chipId;
  const newId = crypto.randomUUID();
  const newLabel = duplicateMethodCardTitle(rawLabel, duplicateTitleSuffix);
  const newRow: CommunityStructureChipSnapshotRow = {
    id: newId,
    label: newLabel,
    state: "selected",
  };

  const nextSnap = [...snap, newRow];
  const inherited = state.coreValueDetailsByChipId?.[chipId];
  const nextDetails =
    inherited !== undefined
      ? {
          ...(state.coreValueDetailsByChipId ?? {}),
          [newId]: structuredClone(inherited),
        }
      : { ...(state.coreValueDetailsByChipId ?? {}) };

  return {
    newId,
    newLabel,
    patch: {
      coreValuesChipsSnapshot: nextSnap,
      selectedCoreValueIds: moveFacetSelectionIdToFront(sel, newId),
      ...(Object.keys(nextDetails).length > 0
        ? { coreValueDetailsByChipId: nextDetails }
        : {}),
    },
  };
}
