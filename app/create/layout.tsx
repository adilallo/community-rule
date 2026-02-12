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
    if (nextStep) {
      router.push(`/create/${nextStep}`);
    }
  };

  const handleBack = () => {
    if (previousStep) {
      router.push(`/create/${previousStep}`);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <CreateFlowTopNav />
      <main className="flex-1 flex items-center justify-center overflow-auto">
        {children}
      </main>
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
              Next
            </Button>
          ) : null
        }
        onBackClick={previousStep ? handleBack : undefined}
      />
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
