"use client";

import { useState } from "react";
import MultiSelect from "../../components/controls/MultiSelect";
import Alert from "../../components/modals/Alert";
import type { ChipOption } from "../../components/controls/MultiSelect/MultiSelect.types";
import { useTranslation } from "../../contexts/MessagesContext";
import { useCreateFlow } from "../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

/**
 * Confirm stakeholders step — stacked lockup + MultiSelect (not split columns).
 * Figma: 21104-46594.
 */
export default function ConfirmStakeholdersPage() {
  const { markCreateFlowInteraction } = useCreateFlow();
  const t = useTranslation("create.confirmStakeholders");
  const [toastDismissed, setToastDismissed] = useState(false);
  const [stakeholderOptions, setStakeholderOptions] = useState<ChipOption[]>(
    [],
  );

  const handleAddStakeholder = () => {
    markCreateFlowInteraction();
    setStakeholderOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", state: "Custom" },
    ]);
  };

  const handleCustomChipConfirm = (chipId: string, value: string) => {
    markCreateFlowInteraction();
    setStakeholderOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId ? { ...opt, label: value, state: "Selected" } : opt,
      ),
    );
  };

  const handleCustomChipClose = (chipId: string) => {
    markCreateFlowInteraction();
    setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  const handleChipClick = (chipId: string) => {
    markCreateFlowInteraction();
    setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  return (
    <>
      <CreateFlowStepShell
        variant="centeredNarrowBottomPad"
        contentTopBelowMd="space-1400"
      >
        <div className="flex w-full max-w-[640px] flex-col items-start gap-[var(--measures-spacing-300,12px)]">
          <div className="flex w-full flex-col gap-[var(--measures-spacing-200,8px)] py-[12px]">
            <CreateFlowHeaderLockup
              title={t("title")}
              description={t("description")}
              justification="left"
            />
          </div>
          <MultiSelect
            formHeader={false}
            showHelpIcon={false}
            size="S"
            options={stakeholderOptions}
            onChipClick={handleChipClick}
            onAddClick={handleAddStakeholder}
            onCustomChipConfirm={handleCustomChipConfirm}
            onCustomChipClose={handleCustomChipClose}
            addButton
            addButtonText={t("addStakeholder")}
          />
        </div>
      </CreateFlowStepShell>

      {!toastDismissed && (
        <div
          className="fixed bottom-[5.25rem] left-1/2 z-10 w-[min(640px,calc(100%-2.5rem))] max-w-[640px] -translate-x-1/2 md:bottom-[5.5rem]"
          role="status"
          aria-live="polite"
        >
          <Alert
            type="banner"
            status="positive"
            title={t("draftToastTitle")}
            hasLeadingIcon={false}
            hasBodyText={false}
            onClose={() => setToastDismissed(true)}
            className="w-full !px-[var(--space-600,24px)] !py-[var(--space-400,16px)] md:!py-4"
          />
        </div>
      )}
    </>
  );
}
