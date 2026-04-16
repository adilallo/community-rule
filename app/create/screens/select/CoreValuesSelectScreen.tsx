"use client";

import { useState, useEffect, useCallback } from "react";
import MultiSelect from "../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../components/controls/MultiSelect/MultiSelect.types";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import type { CommunityStructureChipSnapshotRow } from "../../types";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";

const MAX_CORE_VALUES = 5;

function chipRowsFromLabels(rows: readonly string[]): ChipOption[] {
  return rows.map((label, i) => ({
    id: String(i + 1),
    label,
    state: "Unselected" as const,
  }));
}

function applySavedSelection(
  options: ChipOption[],
  saved: string[] | undefined,
): ChipOption[] {
  const selected = new Set(saved ?? []);
  return options.map((opt) =>
    opt.state === "Custom"
      ? opt
      : {
          ...opt,
          state: selected.has(opt.id)
            ? ("Selected" as const)
            : ("Unselected" as const),
        },
  );
}

function selectedIdsFromOptions(options: ChipOption[]): string[] {
  return options
    .filter((o) => o.state === "Selected")
    .map((o) => o.id);
}

function chipOptionsToSnapshotRows(
  options: ChipOption[],
): CommunityStructureChipSnapshotRow[] {
  return options.map((o) => ({
    id: o.id,
    label: o.label,
    ...(o.state !== undefined ? { state: o.state } : {}),
  }));
}

function snapshotRowsToChipOptions(
  rows: CommunityStructureChipSnapshotRow[] | undefined,
): ChipOption[] | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    ...(r.state !== undefined
      ? { state: r.state as ChipOption["state"] }
      : {}),
  }));
}

/** Create Custom — Core Values (Figma `20264:68378`). Up to five selections; preset list + custom chips. */
export function CoreValuesSelectScreen() {
  const m = useMessages();
  const cv = m.create.coreValues;
  const presetLabels = cv.values;
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();

  const [coreValueOptions, setCoreValueOptions] = useState<ChipOption[]>(
    () => {
      const fromSnap = snapshotRowsToChipOptions(state.coreValuesChipsSnapshot);
      if (fromSnap) return fromSnap;
      return applySavedSelection(
        chipRowsFromLabels(presetLabels),
        state.selectedCoreValueIds,
      );
    },
  );

  useEffect(() => {
    const fromSnap = snapshotRowsToChipOptions(state.coreValuesChipsSnapshot);
    if (fromSnap) {
      setCoreValueOptions(fromSnap);
      return;
    }
    setCoreValueOptions((prev) =>
      applySavedSelection(prev, state.selectedCoreValueIds),
    );
  }, [state.coreValuesChipsSnapshot, state.selectedCoreValueIds]);

  const persistCoreValues = useCallback(
    (next: ChipOption[]) => {
      markCreateFlowInteraction();
      setCoreValueOptions(next);
      updateState({
        selectedCoreValueIds: selectedIdsFromOptions(next),
        coreValuesChipsSnapshot: chipOptionsToSnapshotRows(next),
      });
    },
    [markCreateFlowInteraction, updateState],
  );

  const handleChipClick = (chipId: string) => {
    const target = coreValueOptions.find((o) => o.id === chipId);
    if (!target || target.state === "Custom") return;

    const willSelect = target.state !== "Selected";
    const selectedCount = coreValueOptions.filter(
      (o) => o.state === "Selected",
    ).length;
    if (willSelect && selectedCount >= MAX_CORE_VALUES) return;

    const next: ChipOption[] = coreValueOptions.map((opt) =>
      opt.id === chipId
        ? {
            ...opt,
            state:
              opt.state === "Selected"
                ? ("Unselected" as const)
                : ("Selected" as const),
          }
        : opt,
    );
    persistCoreValues(next);
  };

  const addHandlers = {
    onAddClick: () => {
      markCreateFlowInteraction();
      setCoreValueOptions((prev) => {
        const next: ChipOption[] = [
          ...prev,
          { id: crypto.randomUUID(), label: "", state: "Custom" },
        ];
        updateState({
          selectedCoreValueIds: selectedIdsFromOptions(next),
          coreValuesChipsSnapshot: chipOptionsToSnapshotRows(next),
        });
        return next;
      });
    },
    onCustomChipConfirm: (chipId: string, value: string) => {
      markCreateFlowInteraction();
      setCoreValueOptions((prev) => {
        const next = prev.map((opt) =>
          opt.id === chipId
            ? { ...opt, label: value, state: "Unselected" as const }
            : opt,
        );
        updateState({
          selectedCoreValueIds: selectedIdsFromOptions(next),
          coreValuesChipsSnapshot: chipOptionsToSnapshotRows(next),
        });
        return next;
      });
    },
    onCustomChipClose: (chipId: string) => {
      markCreateFlowInteraction();
      setCoreValueOptions((prev) => {
        const next = prev.filter((o) => o.id !== chipId);
        updateState({
          selectedCoreValueIds: selectedIdsFromOptions(next),
          coreValuesChipsSnapshot: chipOptionsToSnapshotRows(next),
        });
        return next;
      });
    },
  };

  const description = (
    <>
      <span className="leading-[1.3] text-[color:var(--color-content-default-tertiary,#b4b4b4)]">
        {cv.header.descriptionLead}{" "}
      </span>
      <button
        type="button"
        onClick={addHandlers.onAddClick}
        className="cursor-pointer font-inter font-normal leading-[1.3] text-[color:var(--color-content-default-tertiary,#b4b4b4)] underline decoration-solid underline-offset-[3px] hover:opacity-90"
      >
        {cv.header.addLink}
      </button>
      <span className="leading-[1.3] text-[color:var(--color-content-default-tertiary,#b4b4b4)]">
        {" "}
        {cv.header.descriptionTrail}
      </span>
    </>
  );

  return (
    <CreateFlowTwoColumnSelectShell
      lgVerticalAlign="start"
      header={
        <CreateFlowHeaderLockup
          title={cv.header.title}
          description={description}
          justification="left"
        />
      }
    >
      <MultiSelect
        formHeader={false}
        size="M"
        options={coreValueOptions}
        onChipClick={handleChipClick}
        onAddClick={addHandlers.onAddClick}
        onCustomChipConfirm={addHandlers.onCustomChipConfirm}
        onCustomChipClose={addHandlers.onCustomChipClose}
        addButton
        addButtonText={cv.multiSelect.addButtonText}
      />
    </CreateFlowTwoColumnSelectShell>
  );
}
