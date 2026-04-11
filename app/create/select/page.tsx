"use client";

import {
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import MultiSelect from "../../components/controls/MultiSelect";
import type { ChipOption } from "../../components/controls/MultiSelect/MultiSelect.types";
import { useMessages, useTranslation } from "../../contexts/MessagesContext";
import { useCreateFlow } from "../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

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

/**
 * Select page for the create flow
 *
 * Displays selection options using HeaderLockup and MultiSelect components.
 * Responsive layout: two-column at `md` and up, single column below (see `--breakpoint-md` in `app/tailwind.css`).
 * Lockup sizing via `CreateFlowHeaderLockup`. MultiSelect stays `S`.
 */
export default function SelectPage() {
  const m = useMessages();
  const { markCreateFlowInteraction } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.select");

  const [communitySizeOptions, setCommunitySizeOptions] = useState<
    ChipOption[]
  >(() => chipRowsFromLabels(m.create.select.communitySizes));

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<
    ChipOption[]
  >(() => chipRowsFromLabels(m.create.select.organizationTypes));

  const [governanceStyleOptions, setGovernanceStyleOptions] = useState<
    ChipOption[]
  >(() => chipRowsFromLabels(m.create.select.governanceStyles));

  const communityCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setCommunitySizeOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
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

  const handleCommunitySizeClick = (chipId: string) => {
    markCreateFlowInteraction();
    setCommunitySizeOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? "Unselected" : "Selected",
            }
          : opt,
      ),
    );
  };

  const handleOrganizationTypeClick = (chipId: string) => {
    markCreateFlowInteraction();
    setOrganizationTypeOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? "Unselected" : "Selected",
            }
          : opt,
      ),
    );
  };

  const handleGovernanceStyleClick = (chipId: string) => {
    markCreateFlowInteraction();
    setGovernanceStyleOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? "Unselected" : "Selected",
            }
          : opt,
      ),
    );
  };

  const multiLabel = t("multiSelect.label");
  const addText = t("multiSelect.addButtonText");

  const multiSelectBlock = (
    <>
      <MultiSelect
        label={multiLabel}
        size="S"
        options={communitySizeOptions}
        onChipClick={handleCommunitySizeClick}
        {...communityCustomHandlers}
        addButton={true}
        addButtonText={addText}
      />
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
