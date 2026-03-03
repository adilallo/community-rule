"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import type { CreateFlowStep } from "../types";
import { getNextStep, getPreviousStep, isValidStep } from "../utils/flowSteps";

/**
 * Options passed to navigation handlers (e.g. for blur before navigate)
 */
const blurActiveElement = (): void => {
  if (
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
  ) {
    document.activeElement.blur();
  }
};

/**
 * Hook for Create Rule Flow navigation.
 *
 * Must be used within the create flow (pathname like /create/[step]).
 * Uses the current step from the URL and provides type-safe navigation.
 */
export function useCreateFlowNavigation(): {
  currentStep: CreateFlowStep | null;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (_step: CreateFlowStep) => void;
  canGoNext: () => boolean;
  canGoBack: () => boolean;
  nextStep: CreateFlowStep | null;
  previousStep: CreateFlowStep | null;
} {
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = (pathname?.split("/").pop() ??
    null) as CreateFlowStep | null;
  const validStep = isValidStep(currentStep) ? currentStep : null;

  const nextStep = getNextStep(validStep);
  const previousStep = getPreviousStep(validStep);

  const goToNextStep = useCallback(() => {
    blurActiveElement();
    if (nextStep) {
      router.push(`/create/${nextStep}`);
    }
  }, [router, nextStep]);

  const goToPreviousStep = useCallback(() => {
    blurActiveElement();
    if (previousStep) {
      router.push(`/create/${previousStep}`);
    }
  }, [router, previousStep]);

  const goToStep = useCallback(
    (step: CreateFlowStep) => {
      blurActiveElement();
      router.push(`/create/${step}`);
    },
    [router],
  );

  const canGoNext = useCallback(() => nextStep !== null, [nextStep]);
  const canGoBack = useCallback(() => previousStep !== null, [previousStep]);

  return {
    currentStep: validStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoNext,
    canGoBack,
    nextStep,
    previousStep,
  };
}
