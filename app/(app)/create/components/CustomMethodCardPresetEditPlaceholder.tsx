"use client";

/**
 * Shown in method-card Create modals and final-review chip edit when the chip
 * is user-authored (`customMethodCardMetaById`) — preset section editors do
 * not apply until structured parity exists with wizard field blocks.
 */

import { memo } from "react";
import { useMessages } from "../../../contexts/MessagesContext";

function CustomMethodCardPresetEditPlaceholderComponent() {
  const m = useMessages();
  const body = m.create.customRule.customMethodCardWizard.editModal.placeholderBody;

  return (
    <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m,15px)] leading-[var(--line-height-body-m,22px)] text-[var(--color-content-default-secondary)]">
      {body}
    </p>
  );
}

CustomMethodCardPresetEditPlaceholderComponent.displayName =
  "CustomMethodCardPresetEditPlaceholder";

export default memo(CustomMethodCardPresetEditPlaceholderComponent);
