"use client";

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
      />
    );
  },
);

CreateContainer.displayName = "Create";

export default CreateContainer;
