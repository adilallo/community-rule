"use client";

import { useState, useEffect } from "react";
import MultiSelect from "../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../components/controls/MultiSelect/MultiSelect.types";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";

function chipRowsFromLabels(
  rows: readonly { label: string }[],
): ChipOption[] {
  return rows.map((row, i) => ({
    id: String(i + 1),
    label: row.label,
    state: "Unselected" as const,
  }));
}

function selectedIdsFromOptions(options: ChipOption[]): string[] {
  return options
    .filter((o) => o.state === "Selected")
    .map((o) => o.id);
}

/** Create Community — Figma `20094:41317`, chips only (layout tokens shared with structure select). */
export function CommunitySizeSelectScreen() {
  const m = useMessages();
  const cs = m.create.communitySize;
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();

  const [communitySizeOptions, setCommunitySizeOptions] = useState<
    ChipOption[]
  >(() => {
    const base = chipRowsFromLabels(cs.communitySizes);
    const selected = new Set(state.selectedCommunitySizeIds ?? []);
    return base.map((opt) => ({
      ...opt,
      state: selected.has(opt.id) ? ("Selected" as const) : ("Unselected" as const),
    }));
  });

  useEffect(() => {
    const selected = new Set(state.selectedCommunitySizeIds ?? []);
    setCommunitySizeOptions((prev) =>
      prev.map((opt) =>
        opt.state === "Custom"
          ? opt
          : {
              ...opt,
              state: selected.has(opt.id)
                ? ("Selected" as const)
                : ("Unselected" as const),
            },
      ),
    );
  }, [state.selectedCommunitySizeIds]);

  const persistSelection = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setCommunitySizeOptions(next);
    updateState({
      selectedCommunitySizeIds: selectedIdsFromOptions(next),
    });
  };

  const handleCommunitySizeClick = (chipId: string) => {
    const next: ChipOption[] = communitySizeOptions.map((opt) =>
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
    persistSelection(next);
  };

  const multiSelectBlock = (
    <MultiSelect
      formHeader={false}
      size="M"
      options={communitySizeOptions}
      onChipClick={handleCommunitySizeClick}
      addButton={false}
    />
  );

  return (
    <CreateFlowTwoColumnSelectShell
      header={
        <CreateFlowHeaderLockup
          title={cs.header.title}
          description={cs.header.description}
          justification="left"
        />
      }
    >
      {multiSelectBlock}
    </CreateFlowTwoColumnSelectShell>
  );
}
