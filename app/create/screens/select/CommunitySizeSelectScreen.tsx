"use client";

import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from "react";
import MultiSelect from "../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../components/controls/MultiSelect/MultiSelect.types";
import { useMessages, useTranslation } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";

function createListCustomHandlers(
  setList: Dispatch<SetStateAction<ChipOption[]>>,
  confirmState: "Unselected" | "Selected",
  onInteraction?: () => void,
) {
  const touch = () => onInteraction?.();
  return {
    onAddClick: () => {
      touch();
      setList((prev) => [
        ...prev,
        { id: crypto.randomUUID(), label: "", state: "Custom" },
      ]);
    },
    onCustomChipConfirm: (chipId: string, value: string) => {
      touch();
      setList((prev) =>
        prev.map((opt) =>
          opt.id === chipId
            ? { ...opt, label: value, state: confirmState }
            : opt,
        ),
      );
    },
    onCustomChipClose: (chipId: string) => {
      touch();
      setList((prev) => prev.filter((o) => o.id !== chipId));
    },
  };
}

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

/** Create Community — frame 3 (Figma 20094-18244). */
export function CommunitySizeSelectScreen() {
  const m = useMessages();
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.communitySize");

  const [communitySizeOptions, setCommunitySizeOptions] = useState<
    ChipOption[]
  >(() => {
    const base = chipRowsFromLabels(m.create.communitySize.communitySizes);
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

  const communityCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setCommunitySizeOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );

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

  const multiLabel = t("multiSelect.label");
  const addText = t("multiSelect.addButtonText");

  const multiSelectBlock = (
    <MultiSelect
      label={multiLabel}
      size="S"
      options={communitySizeOptions}
      onChipClick={handleCommunitySizeClick}
      {...communityCustomHandlers}
      addButton={true}
      addButtonText={addText}
    />
  );

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      {mdUp ? (
        <div className="flex w-full max-w-[1280px] items-center justify-center gap-[var(--measures-spacing-1200,48px)]">
          <div className="flex max-w-[640px] min-h-px min-w-px flex-[1_0_0] flex-col items-start justify-center gap-[var(--measures-spacing-200,8px)] py-[12px]">
            <CreateFlowHeaderLockup
              title={t("header.title")}
              description={t("header.description")}
              justification="left"
            />
          </div>
          <div className="flex max-w-[640px] min-h-px min-w-px flex-[1_0_0] flex-col items-start gap-[var(--measures-spacing-800,32px)]">
            {multiSelectBlock}
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-[640px] flex-col items-start gap-[var(--measures-spacing-400,16px)]">
          <CreateFlowHeaderLockup
            title={t("header.title")}
            description={t("header.description")}
            justification="left"
          />
          {multiSelectBlock}
        </div>
      )}
    </CreateFlowStepShell>
  );
}
