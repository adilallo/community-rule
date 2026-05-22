"use client";

/**
 * Controlled field blocks for wizard-authored method cards in Create modals
 * (facet screens + final-review chip edit). When `onBlocksChange` is omitted,
 * blocks render read-only (disabled controls).
 *
 * Layout matches preset method editors ({@link CommunicationMethodEditFields},
 * {@link DecisionApproachEditFields}): {@link ModalTextAreaField},
 * {@link ApplicableScopeField} chip rows, {@link IncrementerBlock}.
 */

import { memo, useCallback } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import { CustomMethodCardFieldBlocksSummaryView } from "./CustomMethodCardFieldBlocksSummary.view";
import type { CustomMethodCardFieldBlocksSummaryProps } from "./CustomMethodCardFieldBlocksSummary.types";

function CustomMethodCardFieldBlocksSummaryContainerComponent({
  blocks,
  onBlocksChange,
}: CustomMethodCardFieldBlocksSummaryProps) {
  const m = useMessages();
  const wiz = m.create.customRule.customMethodCardWizard;
  const fm = wiz.fieldModals;
  const em = wiz.editModal;
  const readOnly = !onBlocksChange;

  const onPatch = useCallback(
    (next: Parameters<NonNullable<typeof onBlocksChange>>[0]) => {
      onBlocksChange?.(next);
    },
    [onBlocksChange],
  );

  return (
    <CustomMethodCardFieldBlocksSummaryView
      blocks={blocks}
      readOnly={readOnly}
      emptyValue={em.readout.emptyValue}
      noFileChosen={em.readout.noFileChosen}
      fieldModalsCopy={{
        badges: { addOptionLabel: fm.badges.addOptionLabel },
        upload: {
          uploadFileInputAriaLabel: fm.upload.uploadFileInputAriaLabel,
          uploadHint: fm.upload.uploadHint,
          clearPendingUploadAriaLabel: fm.upload.clearPendingUploadAriaLabel,
          clearPendingUploadTooltip: fm.upload.clearPendingUploadTooltip,
          uploadPreviewImageAlt: fm.upload.uploadPreviewImageAlt,
        },
        proportion: {
          decrementAriaLabel: fm.proportion.decrementAriaLabel,
          incrementAriaLabel: fm.proportion.incrementAriaLabel,
        },
      }}
      onPatch={onPatch}
    />
  );
}

const CustomMethodCardFieldBlocksSummary = memo(
  CustomMethodCardFieldBlocksSummaryContainerComponent,
);
CustomMethodCardFieldBlocksSummary.displayName =
  "CustomMethodCardFieldBlocksSummary";

export default CustomMethodCardFieldBlocksSummary;
