"use client";

/**
 * Controlled section editor for a communication-method chip. Used by both
 * the custom-rule `communication-methods` add-method modal and the
 * `final-review` chip edit modal — caller owns draft state and decides when
 * to persist or discard.
 */

import { memo, useCallback } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import ModalTextAreaField from "../ModalTextAreaField";
import type { CommunicationMethodDetailEntry } from "../../types";

export interface CommunicationMethodEditFieldsProps {
  value: CommunicationMethodDetailEntry;
  onChange: (_next: CommunicationMethodDetailEntry) => void;
}

const FIELDS: ReadonlyArray<keyof CommunicationMethodDetailEntry> = [
  "corePrinciple",
  "logisticsAdmin",
  "codeOfConduct",
];

function CommunicationMethodEditFieldsComponent({
  value,
  onChange,
}: CommunicationMethodEditFieldsProps) {
  const m = useMessages();
  const t = m.create.customRule.communication;

  const patch = useCallback(
    <K extends keyof CommunicationMethodDetailEntry>(
      key: K,
      next: CommunicationMethodDetailEntry[K],
    ) => {
      onChange({ ...value, [key]: next });
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col gap-6">
      {FIELDS.map((field) => (
        <ModalTextAreaField
          key={field}
          label={t.sectionHeadings[field]}
          rows={6}
          value={value[field]}
          onChange={(v) => patch(field, v)}
        />
      ))}
    </div>
  );
}

CommunicationMethodEditFieldsComponent.displayName =
  "CommunicationMethodEditFields";

export default memo(CommunicationMethodEditFieldsComponent);
