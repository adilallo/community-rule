"use client";

import { createPortal } from "react-dom";
import ContentLockup from "../ContentLockup";
import ModalFooter from "../ModalFooter";
import ModalHeader from "../ModalHeader";
import type { CreateViewProps } from "./Create.types";

export function CreateView({
  isOpen,
  onClose,
  title,
  description,
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
}: CreateViewProps) {
  if (!isOpen) return null;

  const createContent = (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Create Dialog */}
      <div
        ref={createRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface-default-primary)] rounded-[var(--radius-500,20px)] shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] w-[560px] max-h-[728px] flex flex-col overflow-hidden z-[9999] ${className}`}
      >
        {/* Header with close buttons */}
        <ModalHeader onClose={onClose} onMoreOptions={onClose} />

        {/* Header Lockup Section (Sticky) */}
        {(title || description) && (
          <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0 sticky top-[48px] z-[2]">
            <ContentLockup
              title={title}
              description={description}
              variant="modal"
              alignment="left"
            />
          </div>
        )}

        {/* Content Area (Scrollable) */}
        <div className="flex flex-col gap-[var(--spacing-scale-024)] px-[24px] pb-[96px] overflow-x-clip overflow-y-auto relative shrink-0 flex-1">
          {children}
        </div>

        {/* Footer */}
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
      </div>
    </>
  );

  // Portal to body
  if (typeof window !== "undefined") {
    return createPortal(createContent, document.body);
  }

  return null;
}
