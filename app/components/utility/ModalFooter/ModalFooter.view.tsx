"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import Button from "../../buttons/Button";
import Stepper from "../../progress/Stepper";
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
  stepper: stepperProp,
  footerContent,
  className = "",
}: ModalFooterProps) {
  const t = useTranslation("common");

  // Use localized defaults if text not provided
  const defaultBackText = backButtonText || t("buttons.back");
  const defaultNextText = nextButtonText || t("buttons.next");
  
  // Determine if stepper should be shown
  // Defaults to true if currentStep and totalSteps are provided, unless explicitly set to false
  const shouldShowStepper = stepperProp !== undefined 
    ? stepperProp 
    : (currentStep !== undefined && totalSteps !== undefined);

  return (
    <div
      className={`h-[64px] bg-[var(--color-surface-default-primary)] rounded-bl-[var(--radius-300,12px)] rounded-br-[var(--radius-300,12px)] shrink-0 relative ${className}`}
    >
      {/* Back Button - Absolutely positioned bottom left */}
      {showBackButton && (
        <div className="absolute left-[16px] top-[12px]">
          <Button buttonType="outline" palette="default" size="medium" onClick={onBack}>
            {defaultBackText}
          </Button>
        </div>
      )}

      {/* Stepper (Centered) */}
      {shouldShowStepper && currentStep && totalSteps && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Stepper active={currentStep} totalSteps={totalSteps} />
        </div>
      )}

      {/* Next Button - Absolutely positioned bottom right */}
      {showNextButton && (
        <div className="absolute right-[16px] top-[12px]">
          <Button
            buttonType="filled"
            palette="default"
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
