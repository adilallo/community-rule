"use client";

import {
  useState,
  useMemo,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import MultiSelect from "../../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../../components/controls/MultiSelect/MultiSelect.types";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import type { CommunityStructureChipSnapshotRow } from "../../types";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";

function createListCustomHandlers(
  setList: Dispatch<SetStateAction<ChipOption[]>>,
  confirmState: "unselected" | "selected",
  onInteraction?: () => void,
) {
  const touch = () => onInteraction?.();
  return {
    onAddClick: () => {
      touch();
      setList((prev) => [
        ...prev,
        { id: crypto.randomUUID(), label: "", state: "custom" },
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
    state: "unselected" as const,
  }));
}

function applySavedSelection(
  options: ChipOption[],
  saved: string[] | undefined,
): ChipOption[] {
  const selected = new Set(saved ?? []);
  return options.map((opt) =>
    opt.state === "custom"
      ? opt
      : {
          ...opt,
          state: selected.has(opt.id)
            ? ("selected" as const)
            : ("unselected" as const),
        },
  );
}

function selectedIdsFromOptions(options: ChipOption[]): string[] {
  return options
    .filter((o) => o.state === "selected")
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

/** Returns chips when a draft snapshot exists; otherwise null (use preset rows + selected ids). */
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

/** Create Community step 3 — Figma `20094:18244` (responsive grid + column caps via `createFlowLayoutTokens`). */
export function CommunityStructureSelectScreen() {
  const m = useMessages();
  const cs = m.create.community.communityStructure;
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<
    ChipOption[]
  >(() => {
    const fromSnap = snapshotRowsToChipOptions(
      state.communityStructureChipSnapshots?.organizationTypes,
    );
    if (fromSnap) return fromSnap;
    return applySavedSelection(
      chipRowsFromLabels(cs.organizationTypes),
      state.selectedOrganizationTypeIds,
    );
  });

  const [scaleOptions, setScaleOptions] = useState<ChipOption[]>(() => {
    const fromSnap = snapshotRowsToChipOptions(
      state.communityStructureChipSnapshots?.scale,
    );
    if (fromSnap) return fromSnap;
    return applySavedSelection(
      chipRowsFromLabels(cs.scaleOptions),
      state.selectedScaleIds,
    );
  });

  const [maturityOptions, setMaturityOptions] = useState<ChipOption[]>(() => {
    const fromSnap = snapshotRowsToChipOptions(
      state.communityStructureChipSnapshots?.maturity,
    );
    if (fromSnap) return fromSnap;
    return applySavedSelection(
      chipRowsFromLabels(cs.maturityOptions),
      state.selectedMaturityIds,
    );
  });

  useEffect(() => {
    const fromSnap = snapshotRowsToChipOptions(
      state.communityStructureChipSnapshots?.organizationTypes,
    );
    if (fromSnap) {
      setOrganizationTypeOptions(fromSnap);
      return;
    }
    setOrganizationTypeOptions((prev) =>
      applySavedSelection(prev, state.selectedOrganizationTypeIds),
    );
  }, [
    state.communityStructureChipSnapshots?.organizationTypes,
    state.selectedOrganizationTypeIds,
  ]);

  useEffect(() => {
    const fromSnap = snapshotRowsToChipOptions(
      state.communityStructureChipSnapshots?.scale,
    );
    if (fromSnap) {
      setScaleOptions(fromSnap);
      return;
    }
    setScaleOptions((prev) => applySavedSelection(prev, state.selectedScaleIds));
  }, [
    state.communityStructureChipSnapshots?.scale,
    state.selectedScaleIds,
  ]);

  useEffect(() => {
    const fromSnap = snapshotRowsToChipOptions(
      state.communityStructureChipSnapshots?.maturity,
    );
    if (fromSnap) {
      setMaturityOptions(fromSnap);
      return;
    }
    setMaturityOptions((prev) =>
      applySavedSelection(prev, state.selectedMaturityIds),
    );
  }, [
    state.communityStructureChipSnapshots?.maturity,
    state.selectedMaturityIds,
  ]);

  const organizationCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setOrganizationTypeOptions,
        "unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const scaleCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setScaleOptions,
        "unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const maturityCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setMaturityOptions,
        "unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );

  const persistOrg = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setOrganizationTypeOptions(next);
    updateState({
      selectedOrganizationTypeIds: selectedIdsFromOptions(next),
      communityStructureChipSnapshots: {
        organizationTypes: chipOptionsToSnapshotRows(next),
      },
    });
  };

  const persistScale = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setScaleOptions(next);
    updateState({
      selectedScaleIds: selectedIdsFromOptions(next),
      communityStructureChipSnapshots: {
        scale: chipOptionsToSnapshotRows(next),
      },
    });
  };

  const persistMaturity = (next: ChipOption[]) => {
    markCreateFlowInteraction();
    setMaturityOptions(next);
    updateState({
      selectedMaturityIds: selectedIdsFromOptions(next),
      communityStructureChipSnapshots: {
        maturity: chipOptionsToSnapshotRows(next),
      },
    });
  };

  const handleOrganizationTypeClick = (chipId: string) => {
    persistOrg(
      organizationTypeOptions.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state:
                opt.state === "selected"
                  ? ("unselected" as const)
                  : ("selected" as const),
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
                opt.state === "selected"
                  ? ("unselected" as const)
                  : ("selected" as const),
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
                opt.state === "selected"
                  ? ("unselected" as const)
                  : ("selected" as const),
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
        size="s"
        options={organizationTypeOptions}
        onChipClick={handleOrganizationTypeClick}
        {...organizationCustomHandlers}
        addButton
        addButtonText={cs.organizationMultiSelect.addButtonText}
      />
      <MultiSelect
        label={cs.scaleMultiSelect.label}
        showHelpIcon
        size="s"
        options={scaleOptions}
        onChipClick={handleScaleClick}
        {...scaleCustomHandlers}
        addButton
        addButtonText={cs.scaleMultiSelect.addButtonText}
      />
      <MultiSelect
        label={cs.maturityMultiSelect.label}
        showHelpIcon
        size="s"
        options={maturityOptions}
        onChipClick={handleMaturityClick}
        {...maturityCustomHandlers}
        addButton
        addButtonText={cs.maturityMultiSelect.addButtonText}
      />
    </>
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
