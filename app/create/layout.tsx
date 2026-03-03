"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CreateFlowProvider,
  useCreateFlow,
  saveCreateFlowDraft,
} from "./context/CreateFlowContext";
import { useCreateFlowNavigation } from "./hooks/useCreateFlowNavigation";
import CreateFlowTopNav from "../components/utility/CreateFlowTopNav";
import CreateFlowFooter from "../components/utility/CreateFlowFooter";
import Button from "../components/buttons/Button";

/**
 * Layout for the Create Rule Flow
 *
 * Provides a full-screen layout without the root layout's TopNav/Footer.
 * This layout wraps all create flow pages and provides the CreateFlowContext.
 * Includes the create flow-specific TopNav and Footer components.
 */
function CreateFlowLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    previousStep,
    goToNextStep,
    goToPreviousStep,
  } = useCreateFlowNavigation();
  const { state, clearState } = useCreateFlow();

  const handleExit = (options?: { saveDraft?: boolean }) => {
    const saveDraft = options?.saveDraft ?? false;
    if (!saveDraft && typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Leave create flow? Your progress will be lost.",
      );
      if (!confirmed) return;
    }
    if (saveDraft) {
      saveCreateFlowDraft(state);
    }
    clearState();
    router.push("/");
  };

  const isCompletedStep = currentStep === "completed";
  const isRightRailStep = currentStep === "right-rail";
  const useFullHeightMain = isCompletedStep || isRightRailStep;

  return (
    <div
      className={`bg-black flex flex-col ${useFullHeightMain ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
      <CreateFlowTopNav
        hasShare={isCompletedStep}
        hasExport={isCompletedStep}
        hasEdit={isCompletedStep}
        loggedIn={isCompletedStep}
        onEdit={
          isCompletedStep
            ? () => router.push("/create/final-review")
            : undefined
        }
        onExit={handleExit}
        buttonPalette={isCompletedStep ? "inverse" : undefined}
        className={
          isCompletedStep ? "!bg-[var(--color-teal-teal50,#c9fef9)]" : undefined
        }
      />
      <main
        className={`flex-1 flex min-h-0 justify-center ${useFullHeightMain ? "items-stretch overflow-hidden" : "items-center overflow-auto"}`}
      >
        {children}
      </main>
      {!isCompletedStep && (
        <CreateFlowFooter
          secondButton={
            nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                className="md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]"
                onClick={goToNextStep}
              >
                {currentStep === "final-review"
                  ? "Finalize CommunityRule"
                  : "Next"}
              </Button>
            ) : null
          }
          onBackClick={previousStep ? goToPreviousStep : undefined}
        />
      )}
    </div>
  );
}

export default function CreateFlowLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CreateFlowProvider>
      <CreateFlowLayoutContent>{children}</CreateFlowLayoutContent>
    </CreateFlowProvider>
  );
}
