"use client";

/**
 * Controlled section editor for a conflict-management chip. Used by both the
 * custom-rule `conflict-management` add-method modal and the `final-review`
 * chip edit modal. Caller owns draft state and persistence.
 */

import { memo, useCallback } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import ModalTextAreaField from "../ModalTextAreaField";
import ApplicableScopeField from "../ApplicableScopeField";
import type { ConflictManagementDetailEntry } from "../../types";

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
      <ApplicableScopeField
        label={t.sectionHeadings.applicableScope}
        addLabel={t.scopeAddButtonLabel}
        scopes={value.applicableScope}
        selectedScopes={value.selectedApplicableScope}
        onToggleScope={(scope) =>
          patch(
            "selectedApplicableScope",
            value.selectedApplicableScope.includes(scope)
              ? value.selectedApplicableScope.filter((s) => s !== scope)
              : [...value.selectedApplicableScope, scope],
          )
        }
        onAddScope={(scope) =>
          patch("applicableScope", [...value.applicableScope, scope])
        }
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
