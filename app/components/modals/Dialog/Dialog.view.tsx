"use client";

import { memo } from "react";
import ContentLockup from "../../type/ContentLockup";
import ModalFooter from "../../utility/ModalFooter";
import ModalHeader from "../../utility/ModalHeader";
import { CreateModalFrameView } from "../Create/CreateModalFrame.view";
import type { DialogViewProps } from "./Dialog.types";

export const DialogView = memo(function DialogView({
  isOpen,
  onClose,
  title,
  description,
  footer,
  children,
  className,
  ariaLabel,
  ariaLabelledBy,
  titleId,
  backdropVariant,
  overlayRef,
  dialogRef,
}: DialogViewProps) {
  return (
    <CreateModalFrameView
      isOpen={isOpen}
      onOverlayClick={onClose}
      backdropVariant={backdropVariant}
      className={className}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      overlayRef={overlayRef}
      dialogRef={dialogRef}
    >
      <ModalHeader onClose={onClose} onMoreOptions={onClose} />

      <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
        <ContentLockup
          title={title}
          description={description}
          variant="modal"
          alignment="left"
          titleId={titleId}
        />
      </div>

      {children ? (
        <div className="scrollbar-design flex min-h-0 flex-1 flex-col gap-[var(--spacing-scale-024)] overflow-x-clip overflow-y-auto px-[24px] pb-6 pt-0">
          {children}
        </div>
      ) : null}

      <ModalFooter
        showBackButton={false}
        showNextButton={false}
        stepper={false}
        footerContent={
          <div className="absolute right-[16px] top-[12px] flex max-w-[calc(100%-32px)] flex-wrap items-center justify-end gap-3">
            {footer}
          </div>
        }
      />
    </CreateModalFrameView>
  );
});

DialogView.displayName = "DialogView";
