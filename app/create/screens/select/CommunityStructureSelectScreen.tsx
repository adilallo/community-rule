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
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";

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

function selectedIdsFromOptions(options: ChipOption[]): string[] {
  return options
    .filter((o) => o.state === "Selected")
    .map((o) => o.id);
}

/** Create Community step 3 — Figma `20094:18244` (responsive grid + column caps via `createFlowLayoutTokens`). */
export function CommunityStructureSelectScreen() {
  const m = useMessages();
  const cs = m.create.communityStructure;
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<
    ChipOption[]
  >(() =>
    applySavedSelection(
      chipRowsFromLabels(cs.organizationTypes),
      state.selectedOrganizationTypeIds,
    ),
  );

  const [scaleOptions, setScaleOptions] = useState<ChipOption[]>(() =>
    applySavedSelection(
      chipRowsFromLabels(cs.scaleOptions),
      state.selectedScaleIds,
    ),
  );

  const [maturityOptions, setMaturityOptions] = useState<ChipOption[]>(() =>
    applySavedSelection(
      chipRowsFromLabels(cs.maturityOptions),
      state.selectedMaturityIds,
    ),
  );

  useEffect(() => {
    setOrganizationTypeOptions((prev) =>
      applySavedSelection(prev, state.selectedOrganizationTypeIds),
    );
  }, [state.selectedOrganizationTypeIds]);

  useEffect(() => {
    setScaleOptions((prev) => applySavedSelection(prev, state.selectedScaleIds));
  }, [state.selectedScaleIds]);

  useEffect(() => {
    setMaturityOptions((prev) =>
      applySavedSelection(prev, state.selectedMaturityIds),
    );
  }, [state.selectedMaturityIds]);

  const organizationCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setOrganizationTypeOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const scaleCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setScaleOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const maturityCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setMaturityOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );

  const persistOrg = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setOrganizationTypeOptions(next);
    updateState({ selectedOrganizationTypeIds: selectedIdsFromOptions(next) });
  };

  const persistScale = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setScaleOptions(next);
    updateState({ selectedScaleIds: selectedIdsFromOptions(next) });
  };

  const persistMaturity = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setMaturityOptions(next);
    updateState({ selectedMaturityIds: selectedIdsFromOptions(next) });
  };

  const handleOrganizationTypeClick = (chipId: string) => {
    persistOrg(
      organizationTypeOptions.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state:
                opt.state === "Selected"
                  ? ("Unselected" as const)
                  : ("Selected" as const),
            }
          : opt,
      ),
    );
  };

  const handleScaleClick = (chipId: string) => {
    persistScale(
      scaleOptions.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state:
                opt.state === "Selected"
                  ? ("Unselected" as const)
                  : ("Selected" as const),
            }
          : opt,
      ),
    );
  };

  const handleMaturityClick = (chipId: string) => {
    persistMaturity(
      maturityOptions.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state:
                opt.state === "Selected"
                  ? ("Unselected" as const)
                  : ("Selected" as const),
            }
          : opt,
      ),
    );
  };

  const multiSelectBlock = (
    <>
      <MultiSelect
        label={cs.organizationMultiSelect.label}
        showHelpIcon
        size="S"
        options={organizationTypeOptions}
        onChipClick={handleOrganizationTypeClick}
        {...organizationCustomHandlers}
        addButton
        addButtonText={cs.organizationMultiSelect.addButtonText}
      />
      <MultiSelect
        label={cs.scaleMultiSelect.label}
        showHelpIcon
        size="S"
        options={scaleOptions}
        onChipClick={handleScaleClick}
        {...scaleCustomHandlers}
        addButton
        addButtonText={cs.scaleMultiSelect.addButtonText}
      />
      <MultiSelect
        label={cs.maturityMultiSelect.label}
        showHelpIcon
        size="S"
        options={maturityOptions}
        onChipClick={handleMaturityClick}
        {...maturityCustomHandlers}
        addButton
        addButtonText={cs.maturityMultiSelect.addButtonText}
      />
    </>
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
