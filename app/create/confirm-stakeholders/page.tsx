"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import MultiSelect from "../../components/controls/MultiSelect";
import Alert from "../../components/modals/Alert";
import type { ChipOption } from "../../components/controls/MultiSelect/MultiSelect.types";

const TITLE =
  "Do other stakeholders need to be involved in creating your community?";

const DESCRIPTION =
  "Adding people at this step will invite them to see your proposed CommunityRule and make their own proposals.";

const DRAFT_TOAST_TITLE = "Congratulations! You've drafted your CommunityRule!";

/**
 * Confirm stakeholders step — stacked lockup + MultiSelect (not split columns).
 * Figma: 21104-46594.
 */
export default function ConfirmStakeholdersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [stakeholderOptions, setStakeholderOptions] = useState<ChipOption[]>(
    [],
  );
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const effectiveMdOrLarger = !isMounted || isMdOrLarger;

  const handleAddStakeholder = () => {
    setStakeholderOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", state: "Custom" },
    ]);
  };

  const handleCustomChipConfirm = (chipId: string, value: string) => {
    setStakeholderOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId ? { ...opt, label: value, state: "Selected" } : opt,
      ),
    );
  };

  const handleCustomChipClose = (chipId: string) => {
    setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  const handleChipClick = (chipId: string) => {
    setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  return (
    <>
      <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[var(--measures-spacing-1800,64px)] pb-28 md:pb-32">
        <div className="flex w-full max-w-[640px] flex-col gap-[var(--measures-spacing-300,12px)] items-start">
          <div className="flex w-full flex-col gap-[var(--measures-spacing-200,8px)] py-[12px]">
            <HeaderLockup
              title={TITLE}
              description={DESCRIPTION}
              justification="left"
              size={effectiveMdOrLarger ? "L" : "M"}
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
            addButtonText="Add stakeholder"
          />
        </div>
      </div>

      {!toastDismissed && (
        <div
          className="fixed left-1/2 z-10 w-[min(640px,calc(100%-2.5rem))] max-w-[640px] -translate-x-1/2 bottom-[5.25rem] md:bottom-[5.5rem]"
          role="status"
          aria-live="polite"
        >
          <Alert
            type="banner"
            status="positive"
            title={DRAFT_TOAST_TITLE}
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
