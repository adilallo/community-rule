"use client";

import { useMemo } from "react";
import Create from "../../modals/Create";
import Chip from "../../controls/Chip";
import InputLabel from "../../utility/InputLabel";
import ContentLockup from "../../type/ContentLockup";
import ModalTextAreaField from "../../../(app)/create/components/ModalTextAreaField";
import { useMessages, useTranslation } from "../../../contexts/MessagesContext";
import type { TemplateChipDetail } from "../../../../lib/create/templateReviewMapping";

export interface TemplateChipDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: TemplateChipDetail | null;
}

/**
 * Read-only mirror of the custom-rule per-chip modals. Shows the exact text
 * from `messages/en/create/customRule/*.json` for the matched preset — never
 * the template `body` placeholder. When no preset is found for the chip label,
 * the modal surfaces a clear "details not available" note rather than falling
 * back to seed copy.
 */
export function TemplateChipDetailModal({
  isOpen,
  onClose,
  detail,
}: TemplateChipDetailModalProps) {
  const m = useMessages();
  const t = useTranslation("create.templateReview.chipDetailModal");

  const resolved = useMemo(() => resolveChipContent(detail, m), [detail, m]);

  return (
    <Create
      isOpen={isOpen}
      onClose={onClose}
      backdropVariant="blurredYellow"
      headerContent={
        <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
          <ContentLockup
            title={resolved?.title ?? ""}
            description={resolved?.subtitle ?? ""}
            variant="modal"
            alignment="left"
          />
        </div>
      }
      showBackButton={false}
      showNextButton
      onNext={onClose}
      nextButtonText={t("closeButton")}
      ariaLabel={resolved?.title || "Template entry details"}
    >
      <div className="flex flex-col gap-[var(--measures-spacing-600,24px)] pb-2">
        {resolved?.body ?? (
          <p className="font-inter text-[14px] leading-[20px] text-[color:var(--color-content-default-secondary,#a3a3a3)]">
            {t("fallback.bodyLabel")}
          </p>
        )}
      </div>
    </Create>
  );
}

type ResolvedChipContent = {
  title: string;
  subtitle: string;
  body: React.ReactNode;
};

function resolveChipContent(
  detail: TemplateChipDetail | null,
  m: ReturnType<typeof useMessages>,
): ResolvedChipContent | null {
  if (!detail) return null;
  const title = detail.chipLabel;

  switch (detail.groupKey) {
    case "coreValues": {
      const cv = m.create.customRule.coreValues;
      const preset = findCoreValuePreset(cv.values, detail.chipLabel);
      if (!preset) return noPresetFallback(title);
      return {
        title,
        subtitle: cv.detailModal.subtitle,
        body: (
          <>
            <ModalTextAreaField
              label={cv.detailModal.meaningLabel}
              value={preset.meaning}
              onChange={noop}
              disabled
              rows={4}
            />
            <ModalTextAreaField
              label={cv.detailModal.signalsLabel}
              value={preset.signals}
              onChange={noop}
              disabled
              rows={4}
            />
          </>
        ),
      };
    }

    case "communication": {
      const comm = m.create.customRule.communication;
      const preset = findMethodByLabel(comm.methods, detail.chipLabel);
      if (!preset) return noPresetFallback(title);
      return {
        title,
        subtitle: preset.supportText,
        body: (
          <>
            <ModalTextAreaField
              label={comm.sectionHeadings.corePrinciple}
              value={preset.sections.corePrinciple}
              onChange={noop}
              disabled
              rows={6}
            />
            <ModalTextAreaField
              label={comm.sectionHeadings.logisticsAdmin}
              value={preset.sections.logisticsAdmin}
              onChange={noop}
              disabled
              rows={6}
            />
            <ModalTextAreaField
              label={comm.sectionHeadings.codeOfConduct}
              value={preset.sections.codeOfConduct}
              onChange={noop}
              disabled
              rows={6}
            />
          </>
        ),
      };
    }

    case "membership": {
      const mem = m.create.customRule.membership;
      const preset = findMethodByLabel(mem.methods, detail.chipLabel);
      if (!preset) return noPresetFallback(title);
      return {
        title,
        subtitle: preset.supportText,
        body: (
          <>
            <ModalTextAreaField
              label={mem.sectionHeadings.eligibility}
              value={preset.sections.eligibility}
              onChange={noop}
              disabled
              rows={6}
            />
            <ModalTextAreaField
              label={mem.sectionHeadings.joiningProcess}
              value={preset.sections.joiningProcess}
              onChange={noop}
              disabled
              rows={6}
            />
            <ModalTextAreaField
              label={mem.sectionHeadings.expectations}
              value={preset.sections.expectations}
              onChange={noop}
              disabled
              rows={6}
            />
          </>
        ),
      };
    }

    case "decisionApproaches": {
      const da = m.create.customRule.decisionApproaches;
      const preset = findMethodByLabel(da.methods, detail.chipLabel);
      if (!preset) return noPresetFallback(title);
      return {
        title,
        subtitle: preset.supportText,
        body: (
          <>
            <ModalTextAreaField
              label={da.sectionHeadings.corePrinciple}
              value={preset.sections.corePrinciple}
              onChange={noop}
              disabled
              rows={4}
            />
            <ReadOnlyScopeField
              label={da.sectionHeadings.applicableScope}
              scopes={preset.sections.applicableScope}
            />
            <ModalTextAreaField
              label={da.sectionHeadings.stepByStepInstructions}
              value={preset.sections.stepByStepInstructions}
              onChange={noop}
              disabled
              rows={4}
            />
            <ReadOnlyValueField
              label={da.sectionHeadings.consensusLevel}
              value={`${preset.sections.consensusLevel}%`}
            />
            <ModalTextAreaField
              label={da.sectionHeadings.objectionsDeadlocks}
              value={preset.sections.objectionsDeadlocks}
              onChange={noop}
              disabled
              rows={4}
            />
          </>
        ),
      };
    }

    case "conflictManagement": {
      const cm = m.create.customRule.conflictManagement;
      const preset = findMethodByLabel(cm.methods, detail.chipLabel);
      if (!preset) return noPresetFallback(title);
      return {
        title,
        subtitle: preset.supportText,
        body: (
          <>
            <ModalTextAreaField
              label={cm.sectionHeadings.corePrinciple}
              value={preset.sections.corePrinciple}
              onChange={noop}
              disabled
              rows={4}
            />
            <ReadOnlyScopeField
              label={cm.sectionHeadings.applicableScope}
              scopes={preset.sections.applicableScope}
            />
            <ModalTextAreaField
              label={cm.sectionHeadings.processProtocol}
              value={preset.sections.processProtocol}
              onChange={noop}
              disabled
              rows={4}
            />
            <ModalTextAreaField
              label={cm.sectionHeadings.restorationFallbacks}
              value={preset.sections.restorationFallbacks}
              onChange={noop}
              disabled
              rows={4}
            />
          </>
        ),
      };
    }

    default:
      return noPresetFallback(title);
  }
}

function noPresetFallback(title: string): ResolvedChipContent {
  return { title, subtitle: "", body: null };
}

function noop() {
  /* read-only */
}

/**
 * Minimal read-only Applicable Scope row — locked chips shown as "selected"
 * without the "+ Add" affordance.
 */
function ReadOnlyScopeField({
  label,
  scopes,
}: {
  label: string;
  scopes: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <InputLabel label={label} helpIcon size="s" palette="default" />
      <div className="flex flex-wrap items-center gap-2">
        {scopes.map((scope) => (
          <Chip
            key={scope}
            label={scope}
            state="selected"
            palette="default"
            size="s"
            disabled
          />
        ))}
      </div>
    </div>
  );
}

function ReadOnlyValueField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <InputLabel label={label} helpIcon size="s" palette="default" />
      <span className="font-inter text-[16px] font-medium leading-[20px] text-[color:var(--color-content-default-primary)]">
        {value}
      </span>
    </div>
  );
}

/** Case-insensitive, trim-tolerant method lookup by `label`. */
function findMethodByLabel<T extends { label: string }>(
  methods: readonly T[],
  label: string,
): T | undefined {
  const normalized = label.trim().toLowerCase();
  return methods.find((m) => m.label.trim().toLowerCase() === normalized);
}

type CoreValuePreset = { label: string; meaning: string; signals: string };

function findCoreValuePreset(
  values: readonly unknown[],
  label: string,
): CoreValuePreset | undefined {
  const normalized = label.trim().toLowerCase();
  for (const v of values) {
    if (
      v &&
      typeof v === "object" &&
      "label" in v &&
      typeof (v as CoreValuePreset).label === "string" &&
      (v as CoreValuePreset).label.trim().toLowerCase() === normalized
    ) {
      const preset = v as Partial<CoreValuePreset>;
      return {
        label: preset.label ?? label,
        meaning: preset.meaning ?? "",
        signals: preset.signals ?? "",
      };
    }
  }
  return undefined;
}
