"use client";

/**
 * Controlled section editor for a conflict-management chip. Used by both the
 * custom-rule `conflict-management` add-method modal and the `final-review`
 * chip edit modal. Caller owns draft state and persistence.
 */

import { memo, useCallback } from "react";
import { formatConflictApplicableScopeForTextarea } from "../../../../../lib/create/ruleSectionsFromMethodSelections";
import { useMessages } from "../../../../contexts/MessagesContext";
import ModalTextAreaField from "../ModalTextAreaField";
import type { ConflictManagementDetailEntry } from "../../types";

function conflictScopeTextareaValue(value: ConflictManagementDetailEntry): string {
  return formatConflictApplicableScopeForTextarea(
    value.selectedApplicableScope,
    value.applicableScope,
  );
}

function conflictDetailWithScopeTextarea(
  value: ConflictManagementDetailEntry,
  text: string,
): ConflictManagementDetailEntry {
  const lines = text
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return {
    ...value,
    applicableScope: lines,
    selectedApplicableScope: [...lines],
  };
}

export interface ConflictManagementEditFieldsProps {
  value: ConflictManagementDetailEntry;
  onChange: (_next: ConflictManagementDetailEntry) => void;
}

function ConflictManagementEditFieldsComponent({
  value,
  onChange,
}: ConflictManagementEditFieldsProps) {
  const m = useMessages();
  const t = m.create.customRule.conflictManagement;

  const patch = useCallback(
    <K extends keyof ConflictManagementDetailEntry>(
      key: K,
      next: ConflictManagementDetailEntry[K],
    ) => {
      onChange({ ...value, [key]: next });
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col gap-6">
      <ModalTextAreaField
        label={t.sectionHeadings.corePrinciple}
        value={value.corePrinciple}
        onChange={(v) => patch("corePrinciple", v)}
      />
      <ModalTextAreaField
        label={t.sectionHeadings.applicableScope}
        value={conflictScopeTextareaValue(value)}
        placeholder={t.applicableScopePlaceholder}
        onChange={(v) => onChange(conflictDetailWithScopeTextarea(value, v))}
        rows={4}
      />
      <ModalTextAreaField
        label={t.sectionHeadings.processProtocol}
        value={value.processProtocol}
        onChange={(v) => patch("processProtocol", v)}
      />
      <ModalTextAreaField
        label={t.sectionHeadings.restorationFallbacks}
        value={value.restorationFallbacks}
        onChange={(v) => patch("restorationFallbacks", v)}
      />
    </div>
  );
}

ConflictManagementEditFieldsComponent.displayName =
  "ConflictManagementEditFields";

export default memo(ConflictManagementEditFieldsComponent);
