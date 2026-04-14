"use client";

import { useState, useEffect } from "react";
import MultiSelect from "../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../components/controls/MultiSelect/MultiSelect.types";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";

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
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      <div className="flex w-full min-w-0 flex-col items-start gap-[var(--measures-spacing-400,16px)] md:max-w-[640px] lg:max-w-[1328px] lg:flex-row lg:flex-nowrap lg:items-center lg:justify-center lg:gap-[var(--measures-spacing-1200,48px)]">
        <div
          className={`flex flex-col items-start gap-[var(--measures-spacing-200,8px)] lg:flex-1 lg:justify-center lg:py-[12px] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
        >
          <CreateFlowHeaderLockup
            title={cs.header.title}
            description={cs.header.description}
            justification="left"
          />
        </div>
        <div
          className={`flex flex-col items-start gap-[var(--measures-spacing-800,32px)] lg:flex-1 ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
        >
          {multiSelectBlock}
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
