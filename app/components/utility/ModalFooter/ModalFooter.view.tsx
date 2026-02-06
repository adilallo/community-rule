"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import Button from "../../buttons/Button";
import Stepper from "../../progress/Progress/Stepper";
import type { ModalFooterProps } from "./ModalFooter.types";

export function ModalFooterView({
  showBackButton = false,
  showNextButton = false,
  onBack,
  onNext,
  backButtonText,
  nextButtonText,
  nextButtonDisabled = false,
  currentStep,
  totalSteps,
  footerContent,
  className = "",
}: ModalFooterProps) {
  const t = useTranslation("common");

  // Use localized defaults if text not provided
  const defaultBackText = backButtonText || t("buttons.back");
  const defaultNextText = nextButtonText || t("buttons.next");
  return (
    <div
      className={`h-[64px] bg-[var(--color-surface-default-primary)] rounded-bl-[var(--radius-300,12px)] rounded-br-[var(--radius-300,12px)] shrink-0 relative ${className}`}
    >
      {/* Back Button - Absolutely positioned bottom left */}
      {showBackButton && (
        <div className="absolute left-[16px] top-[12px]">
          <Button variant="outline" size="medium" onClick={onBack}>
            {defaultBackText}
          </Button>
        </div>
      )}

      {/* Stepper (Centered) */}
      {currentStep && totalSteps && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Stepper active={currentStep} totalSteps={totalSteps} />
        </div>
      )}

      {/* Next Button - Absolutely positioned bottom right */}
      {showNextButton && (
        <div className="absolute right-[16px] top-[12px]">
          <Button
            variant="filled"
            size="medium"
            onClick={onNext}
            disabled={nextButtonDisabled}
          >
            {defaultNextText}
          </Button>
        </div>
      )}

      {/* Custom Footer Content */}
      {footerContent}
    </div>
  );
}
