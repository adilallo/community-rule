"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CreateFlowProvider, useCreateFlow } from "./context/CreateFlowContext";
import { useCreateFlowNavigation } from "./hooks/useCreateFlowNavigation";
import { useCreateFlowExit } from "./hooks/useCreateFlowExit";
import CreateFlowTopNav from "../components/utility/CreateFlowTopNav";
import { getStepIndex } from "./utils/flowSteps";
import CreateFlowFooter from "../components/utility/CreateFlowFooter";
import Button from "../components/buttons/Button";
import { fetchAuthSession } from "../../lib/create/api";
import messages from "../../messages/en/index";
import { useAuthModal } from "../contexts/AuthModalContext";
import { PostLoginDraftTransfer } from "./PostLoginDraftTransfer";
import { SignedInDraftHydration } from "./SignedInDraftHydration";
import Alert from "../components/modals/Alert";
import {
  CreateFlowDraftSaveBannerProvider,
  useCreateFlowDraftSaveBanner,
} from "./context/CreateFlowDraftSaveBannerContext";

/** First step where Save & Exit is offered (after informational + name / `text`). */
const SAVE_EXIT_FROM_STEP_INDEX = getStepIndex("select");

function CreateFlowSessionShell({ children }: { children: ReactNode }) {
  const [sessionUser, setSessionUser] = useState<
    { id: string; email: string } | null | undefined
  >(undefined);

  useEffect(() => {
    let cancelled = false;
    void fetchAuthSession().then(({ user }) => {
      if (!cancelled) setSessionUser(user);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sessionResolved = sessionUser !== undefined;
  const enableAnonymousPersistence = sessionResolved && sessionUser === null;

  return (
    <CreateFlowProvider enableAnonymousPersistence={enableAnonymousPersistence}>
      <CreateFlowDraftSaveBannerProvider>
        <CreateFlowLayoutContent
          sessionUser={sessionUser}
          sessionResolved={sessionResolved}
        >
          {children}
        </CreateFlowLayoutContent>
      </CreateFlowDraftSaveBannerProvider>
    </CreateFlowProvider>
  );
}

function CreateFlowLayoutContent({
  children,
  sessionUser,
  sessionResolved,
}: {
  children: ReactNode;
  sessionUser: { id: string; email: string } | null | undefined;
  sessionResolved: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useAuthModal();
  const {
    currentStep,
    nextStep,
    previousStep,
    goToNextStep,
    goToPreviousStep,
  } = useCreateFlowNavigation();
  const { state, clearState } = useCreateFlow();
  const { draftSaveBannerMessage, setDraftSaveBannerMessage } =
    useCreateFlowDraftSaveBanner();

  const runAuthenticatedExit = useCreateFlowExit({
    state,
    currentStep,
    clearState,
    router,
    user: sessionUser ?? null,
    setDraftSaveBannerMessage,
  });

  const handleExit = async (opts?: { saveDraft?: boolean }) => {
    const saveDraft = opts?.saveDraft ?? false;
    if (!sessionResolved) return;

    if (sessionUser === null) {
      if (saveDraft) return;
      openLogin({
        variant: "saveProgress",
        nextPath: `${pathname ?? "/create/informational"}?syncDraft=1`,
        backdropVariant: "blurredYellow",
      });
      return;
    }

    if (!sessionUser) return;
    await runAuthenticatedExit(opts);
  };

  const isCompletedStep = currentStep === "completed";
  const isRightRailStep = currentStep === "right-rail";
  const useFullHeightMain = isCompletedStep || isRightRailStep;
  const stepIdx = currentStep != null ? getStepIndex(currentStep) : -1;
  const saveDraftOnExit =
    Boolean(sessionUser) && stepIdx >= SAVE_EXIT_FROM_STEP_INDEX;

  return (
    <div
      className={`bg-black flex flex-col ${useFullHeightMain ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
      {draftSaveBannerMessage ? (
        <div className="w-full shrink-0 px-[var(--spacing-measures-spacing-500,20px)] pt-[var(--spacing-measures-spacing-300,12px)] md:px-[var(--measures-spacing-1800,64px)] z-[100]">
          <Alert
            type="banner"
            status="danger"
            title={messages.create.topNav.draftSaveBannerTitle}
            description={draftSaveBannerMessage}
            onClose={() => setDraftSaveBannerMessage(null)}
            className="w-full max-w-[960px] mx-auto"
          />
        </div>
      ) : null}
      <Suspense fallback={null}>
        <SignedInDraftHydration
          sessionUser={sessionUser}
          sessionResolved={sessionResolved}
        />
      </Suspense>
      <Suspense fallback={null}>
        <PostLoginDraftTransfer sessionUser={sessionUser} />
      </Suspense>
      <CreateFlowTopNav
        hasShare={isCompletedStep}
        hasExport={isCompletedStep}
        hasEdit={isCompletedStep}
        saveDraftOnExit={saveDraftOnExit}
        onEdit={
          isCompletedStep
            ? () => router.push("/create/final-review")
            : undefined
        }
        onExit={(opts) => void handleExit(opts)}
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
                  : currentStep === "confirm-stakeholders"
                    ? "Confirm Stakeholders"
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
  return <CreateFlowSessionShell>{children}</CreateFlowSessionShell>;
}
