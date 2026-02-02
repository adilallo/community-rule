"use client";

import { memo, useEffect, useRef } from "react";
import { CreateView } from "./Create.view";
import type { CreateProps } from "./Create.types";

const CreateContainer = memo<CreateProps>(
  ({
    isOpen,
    onClose,
    title,
    description,
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
  }) => {
    const createRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    // Handle ESC key to close
    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, onClose]);

    // Focus trap and body scroll lock
    useEffect(() => {
      if (!isOpen) return;

      // Store previous active element
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Focus the first focusable element in the create dialog
      if (createRef.current) {
        const focusableElements = createRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        } else {
          // Fallback: make create dialog focusable and focus it
          createRef.current.setAttribute("tabindex", "-1");
          createRef.current.focus();
        }
      }

      // Focus trap
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !createRef.current) return;

        const focusableElements = createRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTab);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleTab);
        // Restore focus to previous element
        previousActiveElementRef.current?.focus();
      };
    }, [isOpen]);

    return (
      <CreateView
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
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
      />
    );
  },
);

CreateContainer.displayName = "Create";

export default CreateContainer;
