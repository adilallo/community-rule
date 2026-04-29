"use client";

import ContentLockup from "../../type/ContentLockup";
import ModalFooter from "../../utility/ModalFooter";
import ModalHeader from "../../utility/ModalHeader";
import { CreateModalFrameView } from "./CreateModalFrame.view";
import type { CreateViewProps } from "./Create.types";

export function CreateView({
  isOpen,
  onClose,
  title,
  description,
  headerContent,
  children,
  footerContent,
  showBackButton,
  showNextButton,
  onBack,
  onNext,
  backButtonText,
  nextButtonText,
  nextButtonDisabled,
  currentStep,
  totalSteps,
  className,
  ariaLabel,
  ariaLabelledBy,
  createRef,
  overlayRef,
  backdropVariant,
}: CreateViewProps) {
  return (
    <CreateModalFrameView
      isOpen={isOpen}
      onOverlayClick={onClose}
      backdropVariant={backdropVariant}
      className={className}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      overlayRef={overlayRef}
      dialogRef={createRef}
    >
      <ModalHeader onClose={onClose} onMoreOptions={onClose} />

      {headerContent !== undefined ? (
        <div className="shrink-0">{headerContent}</div>
      ) : title || description ? (
        <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
          <ContentLockup
            title={title}
            description={description}
            variant="modal"
            alignment="left"
          />
        </div>
      ) : null}

      <div className="scrollbar-design flex min-h-0 flex-1 flex-col gap-[var(--spacing-scale-024)] overflow-x-clip overflow-y-auto px-[24px] pb-6 pt-0">
        {children}
      </div>

      <ModalFooter
        showBackButton={showBackButton}
        showNextButton={showNextButton}
        onBack={onBack}
        onNext={onNext}
        backButtonText={backButtonText}
        nextButtonText={nextButtonText}
        nextButtonDisabled={nextButtonDisabled}
        currentStep={currentStep}
        totalSteps={totalSteps}
        footerContent={footerContent}
      />
    </CreateModalFrameView>
  );
}
