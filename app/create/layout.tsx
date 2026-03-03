"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CreateFlowProvider } from "./context/CreateFlowContext";
import CreateFlowTopNav from "../components/utility/CreateFlowTopNav";
import CreateFlowFooter from "../components/utility/CreateFlowFooter";
import Button from "../components/buttons/Button";
import type { CreateFlowStep } from "./types";

/**
 * Layout for the Create Rule Flow
 *
 * Provides a full-screen layout without the root layout's TopNav/Footer.
 * This layout wraps all create flow pages and provides the CreateFlowContext.
 * Includes the create flow-specific TopNav and Footer components.
 */
function CreateFlowLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current step from pathname
  const currentStep = pathname?.split("/").pop() as CreateFlowStep | undefined;

  // Define step order
  const stepOrder: CreateFlowStep[] = [
    "informational",
    "text",
    "select",
    "upload",
    "review",
    "cards",
    "right-rail",
    "final-review",
    "completed",
  ];

  // Get next step
  const getNextStep = (): CreateFlowStep | null => {
    if (!currentStep) return null;
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === stepOrder.length - 1) {
      return null;
    }
    return stepOrder[currentIndex + 1];
  };

  // Get previous step
  const getPreviousStep = (): CreateFlowStep | null => {
    if (!currentStep) return null;
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === 0) {
      return null;
    }
    return stepOrder[currentIndex - 1];
  };

  const nextStep = getNextStep();
  const previousStep = getPreviousStep();

  const handleNext = () => {
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
    if (nextStep) {
      router.push(`/create/${nextStep}`);
    }
  };

  const handleBack = () => {
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
    if (previousStep) {
      router.push(`/create/${previousStep}`);
    }
  };

  const isCompletedStep = currentStep === "completed";

  return (
    <div
      className={`bg-black flex flex-col ${isCompletedStep ? "h-screen overflow-hidden" : "min-h-screen"}`}
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
        buttonPalette={isCompletedStep ? "inverse" : undefined}
        className={
          isCompletedStep ? "!bg-[var(--color-teal-teal50,#c9fef9)]" : undefined
        }
      />
      <main
        className={`flex-1 flex min-h-0 justify-center ${isCompletedStep ? "items-stretch overflow-hidden" : "items-center overflow-auto"}`}
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
                onClick={handleNext}
              >
                {currentStep === "final-review"
                  ? "Finalize CommunityRule"
                  : "Next"}
              </Button>
            ) : null
          }
          onBackClick={previousStep ? handleBack : undefined}
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
