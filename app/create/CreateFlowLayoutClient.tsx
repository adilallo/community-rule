"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { CreateFlowProvider, useCreateFlow } from "./context/CreateFlowContext";
import { useCreateFlowNavigation } from "./hooks/useCreateFlowNavigation";
import { useCreateFlowExit } from "./hooks/useCreateFlowExit";
import CreateFlowTopNav from "../components/utility/CreateFlowTopNav";
import { getStepIndex } from "./utils/flowSteps";
import CreateFlowFooter from "../components/utility/CreateFlowFooter";
import Button from "../components/buttons/Button";
import { buildPublishPayload } from "../../lib/create/buildPublishPayload";
import { fetchAuthSession, publishRule } from "../../lib/create/api";
import { writeLastPublishedRule } from "../../lib/create/lastPublishedRule";
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
  const [publishBannerMessage, setPublishBannerMessage] = useState<
    string | null
  >(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleFinalize = useCallback(async () => {
    setPublishBannerMessage(null);
    const payloadResult = buildPublishPayload(state);
    if (payloadResult.ok === false) {
      setPublishBannerMessage(
        payloadResult.error === "missingCommunityName"
          ? messages.create.publish.missingCommunityName
          : payloadResult.error,
      );
      return;
    }
    const { title, summary, document: ruleDocument } = payloadResult;
    setIsPublishing(true);
    const publishResult = await publishRule({
      title,
      summary,
      document: ruleDocument,
    });
    setIsPublishing(false);
    if (publishResult.ok === true) {
      writeLastPublishedRule({
        id: publishResult.id,
        title,
        summary: summary ?? null,
        document: ruleDocument,
      });
      router.push("/create/completed");
      return;
    }
    if (publishResult.status === 401) {
      openLogin({
        variant: "default",
        nextPath: "/create/final-review?syncDraft=1",
        backdropVariant: "blurredYellow",
      });
      return;
    }
    setPublishBannerMessage(
      publishResult.error.trim() !== ""
        ? publishResult.error
        : messages.create.publish.genericPublishFailed,
    );
  }, [state, router, openLogin]);

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

  const hasErrorOverlays =
    Boolean(draftSaveBannerMessage) || Boolean(publishBannerMessage);

  return (
    <div className="relative flex h-screen min-h-0 flex-col overflow-hidden bg-black">
      {hasErrorOverlays ? (
        <div
          className="pointer-events-none fixed left-0 right-0 top-0 z-[200] flex flex-col gap-2 px-[var(--spacing-measures-spacing-500,20px)] pt-[var(--spacing-measures-spacing-300,12px)] md:px-[var(--measures-spacing-1800,64px)]"
          aria-live="polite"
        >
          {draftSaveBannerMessage ? (
            <div className="pointer-events-auto mx-auto w-full max-w-[960px]">
              <Alert
                type="banner"
                status="danger"
                title={messages.create.topNav.draftSaveBannerTitle}
                description={draftSaveBannerMessage}
                onClose={() => setDraftSaveBannerMessage(null)}
                className="w-full"
              />
            </div>
          ) : null}
          {publishBannerMessage ? (
            <div className="pointer-events-auto mx-auto w-full max-w-[960px]">
              <Alert
                type="banner"
                status="danger"
                title={messages.create.publish.finalizeBannerTitle}
                description={publishBannerMessage}
                onClose={() => setPublishBannerMessage(null)}
                className="w-full"
              />
            </div>
          ) : null}
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
        className={`shrink-0 ${
          isCompletedStep ? "!bg-[var(--color-teal-teal50,#c9fef9)]" : ""
        }`.trim()}
      />
      <main
        className={`flex min-h-0 flex-1 justify-center ${
          useFullHeightMain
            ? isCompletedStep
              ? "items-stretch overflow-y-auto sm:overflow-hidden"
              : "items-stretch overflow-hidden"
            : "flex-row items-center justify-center overflow-y-auto"
        }`}
      >
        {children}
      </main>
      {!isCompletedStep && (
        <CreateFlowFooter
          className="shrink-0"
          secondButton={
            nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={isPublishing}
                className="md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]"
                onClick={() => {
                  if (currentStep === "final-review") {
                    void handleFinalize();
                  } else {
                    goToNextStep();
                  }
                }}
              >
                {currentStep === "final-review"
                  ? isPublishing
                    ? messages.create.publish.finalizeButtonPublishing
                    : "Finalize CommunityRule"
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

export default function CreateFlowLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return <CreateFlowSessionShell>{children}</CreateFlowSessionShell>;
}
