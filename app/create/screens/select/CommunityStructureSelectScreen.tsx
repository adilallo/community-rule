"use client";

import {
  useState,
  useMemo,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
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

/** Create Community — frame 5 (Figma 20094-41317). */
export function CommunityStructureSelectScreen() {
  const m = useMessages();
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.communityStructure");

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<
    ChipOption[]
  >(() =>
    applySavedSelection(
      chipRowsFromLabels(m.create.communityStructure.organizationTypes),
      state.selectedOrganizationTypeIds,
    ),
  );

  const [governanceStyleOptions, setGovernanceStyleOptions] = useState<
    ChipOption[]
  >(() =>
    applySavedSelection(
      chipRowsFromLabels(m.create.communityStructure.governanceStyles),
      state.selectedGovernanceStyleIds,
    ),
  );

  useEffect(() => {
    setOrganizationTypeOptions((prev) =>
      applySavedSelection(prev, state.selectedOrganizationTypeIds),
    );
  }, [state.selectedOrganizationTypeIds]);

  useEffect(() => {
    setGovernanceStyleOptions((prev) =>
      applySavedSelection(prev, state.selectedGovernanceStyleIds),
    );
  }, [state.selectedGovernanceStyleIds]);

  const organizationCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setOrganizationTypeOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const governanceCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setGovernanceStyleOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );

  const persistOrg = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setOrganizationTypeOptions(next);
    updateState({
      selectedOrganizationTypeIds: next
        .filter((o) => o.state === "Selected")
        .map((o) => o.id),
    });
  };

  const persistGov = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setGovernanceStyleOptions(next);
    updateState({
      selectedGovernanceStyleIds: next
        .filter((o) => o.state === "Selected")
        .map((o) => o.id),
    });
  };

  const handleOrganizationTypeClick = (chipId: string) => {
    const next: ChipOption[] = organizationTypeOptions.map((opt) =>
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
    persistOrg(next);
  };

  const handleGovernanceStyleClick = (chipId: string) => {
    const next: ChipOption[] = governanceStyleOptions.map((opt) =>
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
    persistGov(next);
  };

  const multiLabel = t("multiSelect.label");
  const addText = t("multiSelect.addButtonText");

  const multiSelectBlock = (
    <>
      <MultiSelect
        label={multiLabel}
        size="S"
        options={organizationTypeOptions}
        onChipClick={handleOrganizationTypeClick}
        {...organizationCustomHandlers}
        addButton={true}
        addButtonText={addText}
      />
      <MultiSelect
        label={multiLabel}
        size="S"
        options={governanceStyleOptions}
        onChipClick={handleGovernanceStyleClick}
        {...governanceCustomHandlers}
        addButton={true}
        addButtonText={addText}
      />
    </>
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
