"use client";

/**
 * Controlled meaning/signals field set for a core-value chip. Rendered both
 * by `core-values` (custom-rule selection step) and `final-review` (chip
 * edit modal). Holds no state — the parent owns the draft and decides when
 * to persist (`updateState`) or discard.
 */

import { memo, useCallback } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import ModalTextAreaField from "../ModalTextAreaField";
import type { CoreValueDetailEntry } from "../../types";

export interface CoreValueEditFieldsProps {
  value: CoreValueDetailEntry;
  onChange: (_next: CoreValueDetailEntry) => void;
}

function CoreValueEditFieldsComponent({
  value,
  onChange,
}: CoreValueEditFieldsProps) {
  const m = useMessages();
  const t = m.create.customRule.coreValues.detailModal;

  const patch = useCallback(
    <K extends keyof CoreValueDetailEntry>(
      key: K,
      next: CoreValueDetailEntry[K],
    ) => {
      onChange({ ...value, [key]: next });
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col gap-[var(--measures-spacing-600,24px)] pb-2">
      <ModalTextAreaField
        label={t.meaningLabel}
        value={value.meaning}
        onChange={(v) => patch("meaning", v)}
        rows={4}
      />
      <ModalTextAreaField
        label={t.signalsLabel}
        value={value.signals}
        onChange={(v) => patch("signals", v)}
        rows={4}
      />
    </div>
  );
}

CoreValueEditFieldsComponent.displayName = "CoreValueEditFields";

export default memo(CoreValueEditFieldsComponent);
