"use client";

/**
 * Figma: "Modal / Create" (20874-172292)
 */

import { memo, useRef } from "react";
import { CreateView } from "./Create.view";
import type { CreateProps } from "./Create.types";
import { useCreateModalA11y } from "./useCreateModalA11y";

const CreateContainer = memo<CreateProps>(
  ({
    isOpen,
    onClose,
    title,
    description,
    headerContent,
    children,
    footerContent,
    footerClassName,
    showBackButton = true,
    showNextButton = true,
    onBack,
    onNext,
    backButtonText = "Back",
    nextButtonText = "Next",
    nextButtonDisabled = false,
    currentStep,
    totalSteps,
    className = "",
    ariaLabel,
    ariaLabelledBy,
    backdropVariant = "default",
    stepper,
    kebabTriggerAriaLabel,
    kebabMenuAriaLabel,
    kebabMenuItems,
    belowCard,
  }) => {
    const createRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useCreateModalA11y(isOpen, onClose, createRef);

    return (
      <CreateView
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        headerContent={headerContent}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        footerContent={footerContent}
        footerClassName={footerClassName}
        showBackButton={showBackButton}
        showNextButton={showNextButton}
        onBack={onBack}
        onNext={onNext}
        backButtonText={backButtonText}
        nextButtonText={nextButtonText}
        nextButtonDisabled={nextButtonDisabled}
        currentStep={currentStep}
        totalSteps={totalSteps}
        className={className}
        ariaLabel={ariaLabel}
        ariaLabelledBy={ariaLabelledBy}
        createRef={createRef}
        overlayRef={overlayRef}
        backdropVariant={backdropVariant}
        stepper={stepper}
        kebabTriggerAriaLabel={kebabTriggerAriaLabel}
        kebabMenuAriaLabel={kebabMenuAriaLabel}
        kebabMenuItems={kebabMenuItems}
        belowCard={belowCard}
      />
    );
  },
);

CreateContainer.displayName = "Create";

export default CreateContainer;
