"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { useCreateFlow } from "../context/CreateFlowContext";
import type { CreateFlowStep } from "../types";
import {
  type CreateFlowNavigationOptions,
  buildTemplateReviewHref,
  getNextStep,
  getPreviousStep,
  parseCreateFlowScreenFromPathname,
  resolveCreateFlowBackTarget,
  TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY,
  TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE,
} from "../utils/flowSteps";

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
 * Resolves the active step from `/create/{screenId}` via
 * {@link parseCreateFlowScreenFromPathname} (flowSteps). Footer Back uses
 * {@link resolveCreateFlowBackTarget} so template **Use without changes**
 * (which skips the custom-rule segment) returns to `/create/review-template/{slug}`
 * from `confirm-stakeholders` instead of `conflict-management`.
 *
 * Template review footer Back uses {@link buildTemplateReviewHref}’s
 * `?fromFlow=1` marker (and persisted `templateReviewEntryFromCreateFlow`) so
 * users who came from `/create/review` return there instead of `/`.
 */
export function useCreateFlowNavigation(
  options?: CreateFlowNavigationOptions,
): {
  currentStep: CreateFlowStep | null;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (_step: CreateFlowStep) => void;
  canGoNext: () => boolean;
  canGoBack: () => boolean;
  nextStep: CreateFlowStep | null;
  previousStep: CreateFlowStep | null;
  /** On `/create/review-template/…`, footer Back should go to `/create/review`. */
  templateReviewFooterBackToCreateReview: boolean;
} {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, updateState } = useCreateFlow();

  const validStep = parseCreateFlowScreenFromPathname(pathname ?? null);

  useLayoutEffect(() => {
    if (!pathname?.includes("/create/review-template/")) return;
    if (
      searchParams.get(TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY) !==
      TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE
    ) {
      return;
    }
    if (state.templateReviewEntryFromCreateFlow === true) return;
    updateState({ templateReviewEntryFromCreateFlow: true });
  }, [
    pathname,
    searchParams,
    state.templateReviewEntryFromCreateFlow,
    updateState,
  ]);

  const nextStep = getNextStep(validStep, options);
  const previousStep = getPreviousStep(validStep, options);

  const backTarget = useMemo(
    () =>
      resolveCreateFlowBackTarget(
        validStep,
        options,
        state.templateReviewBackSlug,
      ),
    [validStep, options?.skipCommunitySave, state.templateReviewBackSlug],
  );

  const goToNextStep = useCallback(() => {
    blurActiveElement();
    if (nextStep) {
      router.push(`/create/${nextStep}`);
    }
  }, [router, nextStep]);

  const goToPreviousStep = useCallback(() => {
    blurActiveElement();
    if (!backTarget) return;
    if (backTarget.kind === "templateReview") {
      router.push(
        buildTemplateReviewHref(backTarget.slug, {
          fromCreateWizard: state.templateReviewEntryFromCreateFlow === true,
        }),
      );
      return;
    }
    router.push(`/create/${backTarget.step}`);
  }, [router, backTarget, state.templateReviewEntryFromCreateFlow]);

  const templateReviewFooterBackToCreateReview = useMemo(
    () =>
      Boolean(state.templateReviewEntryFromCreateFlow) ||
      (pathname?.includes("/create/review-template/") &&
        searchParams.get(TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY) ===
          TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE),
    [state.templateReviewEntryFromCreateFlow, pathname, searchParams],
  );

  const goToStep = useCallback(
    (step: CreateFlowStep) => {
      blurActiveElement();
      router.push(`/create/${step}`);
    },
    [router],
  );

  const canGoNext = useCallback(() => nextStep !== null, [nextStep]);
  const canGoBack = useCallback(() => backTarget != null, [backTarget]);

  return {
    currentStep: validStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoNext,
    canGoBack,
    nextStep,
    previousStep,
    templateReviewFooterBackToCreateReview,
  };
}
