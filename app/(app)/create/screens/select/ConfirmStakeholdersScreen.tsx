"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MultiSelect from "../../../../components/controls/MultiSelect";
import Alert from "../../../../components/modals/Alert";
import type { ChipOption } from "../../../../components/controls/MultiSelect/MultiSelect.types";
import { useTranslation } from "../../../../contexts/MessagesContext";
import { MAX_STAKEHOLDER_EMAILS } from "../../../../../lib/create/stakeholderLimits";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";
import {
  CREATE_FLOW_MANAGE_STAKEHOLDERS_QUERY,
  CREATE_FLOW_MANAGE_STAKEHOLDERS_VALUE,
} from "../../utils/flowSteps";
import { createFlowStepPath } from "../../utils/createFlowPaths";
import { PublishedStakeholdersManagePanel } from "./PublishedStakeholdersManagePanel";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailsToChipOptions(emails: string[]): ChipOption[] {
  return emails.map((email) => ({
    id: email,
    label: email,
    state: "selected" as const,
  }));
}

export function ConfirmStakeholdersScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const t = useTranslation("create.reviewAndComplete.confirmStakeholders");

  const manageStakeholdersIntent =
    searchParams?.get(CREATE_FLOW_MANAGE_STAKEHOLDERS_QUERY) ===
    CREATE_FLOW_MANAGE_STAKEHOLDERS_VALUE;
  const editingPublishedRuleId = state.editingPublishedRuleId?.trim() ?? "";
  const managePublishedMode =
    manageStakeholdersIntent && editingPublishedRuleId.length > 0;

  useEffect(() => {
    if (!manageStakeholdersIntent) return;
    if (editingPublishedRuleId.length > 0) return;
    router.replace(createFlowStepPath("edit-rule"));
  }, [
    manageStakeholdersIntent,
    editingPublishedRuleId.length,
    router,
  ]);

  const persistedKey = (state.stakeholderEmails ?? []).join("\0");
  const [toastDismissed, setToastDismissed] = useState(false);
  const [chipError, setChipError] = useState<string | null>(null);
  const [stakeholderOptions, setStakeholderOptions] = useState<ChipOption[]>(
    () => emailsToChipOptions(state.stakeholderEmails ?? []),
  );

  useEffect(() => {
    setStakeholderOptions((prev) => {
      const inFlight = prev.filter((c) => c.state === "custom");
      const nextPersisted = emailsToChipOptions(state.stakeholderEmails ?? []);
      return [...nextPersisted, ...inFlight];
    });
  }, [persistedKey]);

  const handleAddStakeholder = () => {
    markCreateFlowInteraction();
    setChipError(null);
    const confirmed = state.stakeholderEmails ?? [];
    const customCount = stakeholderOptions.filter(
      (o) => o.state === "custom",
    ).length;
    if (confirmed.length + customCount >= MAX_STAKEHOLDER_EMAILS) {
      setChipError(t("maxStakeholders"));
      return;
    }
    setStakeholderOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", state: "custom" },
    ]);
  };

  const handleCustomChipConfirm = (chipId: string, value: string) => {
    markCreateFlowInteraction();
    setChipError(null);
    const trimmed = value.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setChipError(t("invalidEmail"));
      return;
    }
    const current = state.stakeholderEmails ?? [];
    if (current.includes(trimmed)) {
      setChipError(t("duplicateEmail"));
      setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
      return;
    }
    if (current.length >= MAX_STAKEHOLDER_EMAILS) {
      setChipError(t("maxStakeholders"));
      setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
      return;
    }
    setStakeholderOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? { id: trimmed, label: trimmed, state: "selected" as const }
          : opt,
      ),
    );
    updateState({ stakeholderEmails: [...current, trimmed] });
  };

  const handleCustomChipClose = (chipId: string) => {
    markCreateFlowInteraction();
    setChipError(null);
    setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  const handleChipClick = (chipId: string) => {
    markCreateFlowInteraction();
    setChipError(null);
    setStakeholderOptions((prev) => prev.filter((opt) => opt.id !== chipId));
    updateState({
      stakeholderEmails: (state.stakeholderEmails ?? []).filter(
        (e) => e !== chipId,
      ),
    });
  };

  if (managePublishedMode) {
    return (
      <CreateFlowStepShell
        variant="centeredNarrowBottomPad"
        contentTopBelowMd="space-1400"
      >
        <div
          className={`flex flex-col items-start gap-[var(--measures-spacing-300,12px)] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
        >
          <div className="flex w-full flex-col gap-[var(--measures-spacing-200,8px)] py-[12px]">
            <CreateFlowHeaderLockup
              title={t("managePublished.lockupTitle")}
              description={t("managePublished.lockupDescription")}
              justification="left"
            />
          </div>
          <PublishedStakeholdersManagePanel ruleId={editingPublishedRuleId} />
        </div>
      </CreateFlowStepShell>
    );
  }

  return (
    <>
      <CreateFlowStepShell
        variant="centeredNarrowBottomPad"
        contentTopBelowMd="space-1400"
      >
        <div
          className={`flex flex-col items-start gap-[var(--measures-spacing-300,12px)] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
        >
          <div className="flex w-full flex-col gap-[var(--measures-spacing-200,8px)] py-[12px]">
            <CreateFlowHeaderLockup
              title={t("title")}
              description={t("description")}
              justification="left"
            />
          </div>
          {chipError ? (
            <p
              className="font-inter text-sm text-[var(--color-border-default-utility-negative)]"
              role="alert"
            >
              {chipError}
            </p>
          ) : null}
          <MultiSelect
            formHeader={false}
            showHelpIcon={false}
            size="s"
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
