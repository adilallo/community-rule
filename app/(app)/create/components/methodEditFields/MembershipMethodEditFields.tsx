"use client";

/**
 * Controlled section editor for a membership-method chip. Used by both the
 * custom-rule `membership-methods` add-method modal and the `final-review`
 * chip edit modal — caller owns draft state and decides when to persist or
 * discard.
 */

import { memo, useCallback } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import ModalTextAreaField from "../ModalTextAreaField";
import type { MembershipMethodDetailEntry } from "../../types";

export interface MembershipMethodEditFieldsProps {
  value: MembershipMethodDetailEntry;
  onChange: (_next: MembershipMethodDetailEntry) => void;
}

const FIELDS: ReadonlyArray<keyof MembershipMethodDetailEntry> = [
  "eligibility",
  "joiningProcess",
  "expectations",
];

function MembershipMethodEditFieldsComponent({
  value,
  onChange,
}: MembershipMethodEditFieldsProps) {
  const m = useMessages();
  const t = m.create.customRule.membership;

  const patch = useCallback(
    <K extends keyof MembershipMethodDetailEntry>(
      key: K,
      next: MembershipMethodDetailEntry[K],
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

MembershipMethodEditFieldsComponent.displayName =
  "MembershipMethodEditFields";

export default memo(MembershipMethodEditFieldsComponent);
