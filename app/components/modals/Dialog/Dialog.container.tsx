"use client";

import { memo, useId, useRef } from "react";
import { useCreateModalA11y } from "../Create/useCreateModalA11y";
import { DialogView } from "./Dialog.view";
import type { DialogProps } from "./Dialog.types";

const DialogContainer = memo<DialogProps>(
  ({
    isOpen,
    onClose,
    title,
    description,
    footer,
    children,
    className = "",
    ariaLabel,
    ariaLabelledBy: ariaLabelledByProp,
    backdropVariant = "default",
  }) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const autoTitleId = useId();
    const titleId = ariaLabelledByProp ?? autoTitleId;

    useCreateModalA11y(isOpen, onClose, dialogRef);

    return (
      <DialogView
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        footer={footer}
        className={className}
        ariaLabel={ariaLabel}
        ariaLabelledBy={titleId}
        titleId={titleId}
        backdropVariant={backdropVariant}
        overlayRef={overlayRef}
        dialogRef={dialogRef}
      >
        {children}
      </DialogView>
    );
  },
);

DialogContainer.displayName = "Dialog";

export default DialogContainer;
