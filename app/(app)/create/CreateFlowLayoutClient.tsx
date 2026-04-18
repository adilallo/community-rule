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
import CreateFlowTopNav from "../../components/utility/CreateFlowTopNav";
import { getNextStep, getStepIndex } from "./utils/flowSteps";
import { getProportionBarProgressForCreateFlowStep } from "./utils/createFlowProportionProgress";
import {
  createFlowStepUsesCenteredTextLayout,
  createFlowStepUsesCardLayout,
} from "./utils/createFlowScreenRegistry";
import CreateFlowFooter from "../../components/utility/CreateFlowFooter";
import Button from "../../components/buttons/Button";
import { buildPublishPayload } from "../../../lib/create/buildPublishPayload";
import { isValidCreateFlowSaveEmail } from "../../../lib/create/isValidCreateFlowSaveEmail";
import {
  fetchAuthSession,
  publishRule,
  requestMagicLink,
} from "../../../lib/create/api";
import { safeInternalPath } from "../../../lib/safeInternalPath";
import { setTransferPendingFlag } from "./utils/anonymousDraftStorage";
import { writeLastPublishedRule } from "../../../lib/create/lastPublishedRule";
import {
  fetchTemplateBySlug,
  type RuleTemplateDto,
} from "../../../lib/create/fetchTemplates";
import messages from "../../../messages/en/index";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useMessages, useTranslation } from "../../contexts/MessagesContext";
import { PostLoginDraftTransfer } from "./PostLoginDraftTransfer";
import { SignedInDraftHydration } from "./SignedInDraftHydration";
import Alert from "../../components/modals/Alert";
import {
  CreateFlowDraftSaveBannerProvider,
  useCreateFlowDraftSaveBanner,
} from "./context/CreateFlowDraftSaveBannerContext";

/** First step where Save & Exit is offered (first Create Community select per Figma). */
const SAVE_EXIT_FROM_STEP_INDEX = getStepIndex("community-structure");

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
  const { create } = useMessages();
  const footer = create.footer;
  const communitySaveMessages = create.communitySave;
  const tLogin = useTranslation("pages.login");
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useAuthModal();
  const skipCommunitySave = sessionResolved && Boolean(sessionUser);
  const {
    currentStep,
    nextStep,
    previousStep,
    goToNextStep,
    goToPreviousStep,
  } = useCreateFlowNavigation(
    skipCommunitySave ? { skipCommunitySave: true } : undefined,
  );
  const { state, clearState, updateState } = useCreateFlow();
  const { draftSaveBannerMessage, setDraftSaveBannerMessage } =
    useCreateFlowDraftSaveBanner();
  const [publishBannerMessage, setPublishBannerMessage] = useState<
    string | null
  >(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [templateReviewApplyError, setTemplateReviewApplyError] = useState<
    string | null
  >(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [communitySaveMagicLinkSubmitting, setCommunitySaveMagicLinkSubmitting] =
    useState(false);
  const [communitySaveMagicLinkError, setCommunitySaveMagicLinkError] = useState<
    string | null
  >(null);
  const [communitySaveMagicLinkSuccess, setCommunitySaveMagicLinkSuccess] =
    useState(false);

  const templateReviewMatch = pathname?.match(
    /\/create\/review-template\/([^/?#]+)/,
  );
  const templateReviewSlug = templateReviewMatch?.[1]
    ? decodeURIComponent(templateReviewMatch[1])
    : null;
  /** Match anywhere in path so locale/basePath variants still get template footer + layout. */
  const isTemplateReviewRoute = Boolean(
    pathname?.includes("/create/review-template/"),
  );

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

  const handleUseTemplateWithoutChanges = useCallback(async () => {
    if (!templateReviewSlug) return;
    setTemplateReviewApplyError(null);
    setIsApplyingTemplate(true);
    const result = await fetchTemplateBySlug(templateReviewSlug);
    setIsApplyingTemplate(false);
    if (result === null) {
      setTemplateReviewApplyError(messages.create.templateReview.errors.notFound);
      return;
    }
    if ("error" in result) {
      setTemplateReviewApplyError(result.error);
      return;
    }
    const template: RuleTemplateDto = result;
    const doc = template.body;
    if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
      setTemplateReviewApplyError(messages.create.templateReview.errors.applyFailed);
      return;
    }
    const summaryRaw =
      typeof template.description === "string"
        ? template.description.trim()
        : "";
    writeLastPublishedRule({
      id: `template:${template.slug}`,
      title: template.title,
      summary: summaryRaw.length > 0 ? summaryRaw : null,
      document: doc as Record<string, unknown>,
    });
    router.push("/create/completed");
  }, [router, templateReviewSlug]);

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
      const returnToTemplateReview =
        templateReviewSlug != null
          ? `/create/review-template/${encodeURIComponent(templateReviewSlug)}?syncDraft=1`
          : null;
      openLogin({
        variant: "saveProgress",
        nextPath:
          returnToTemplateReview ??
          `${pathname ?? "/create"}?syncDraft=1`,
        backdropVariant: "blurredYellow",
      });
      return;
    }

    if (!sessionUser) return;
    await runAuthenticatedExit(opts);
  };

  useEffect(() => {
    if (
      sessionResolved &&
      sessionUser &&
      currentStep === "community-save"
    ) {
      router.replace("/create/review");
    }
  }, [sessionResolved, sessionUser, currentStep, router]);

  useEffect(() => {
    if (currentStep !== "community-save") {
      setCommunitySaveMagicLinkError(null);
      setCommunitySaveMagicLinkSuccess(false);
      setCommunitySaveMagicLinkSubmitting(false);
    }
  }, [currentStep]);

  const handleCommunitySaveMagicLinkSubmit = useCallback(async () => {
    setCommunitySaveMagicLinkError(null);
    setCommunitySaveMagicLinkSuccess(false);
    const raw = state.communitySaveEmail;
    const trimmed = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    if (!isValidCreateFlowSaveEmail(trimmed)) return;

    setCommunitySaveMagicLinkSubmitting(true);
    try {
      const stepAfterSave = getNextStep("community-save");
      const segment = stepAfterSave ?? "review";
      const rawNext = `/create/${segment}?syncDraft=1`;
      const nextPath = safeInternalPath(rawNext);
      const result = await requestMagicLink(trimmed, nextPath);
      if (result.ok === false) {
        if (result.retryAfterMs != null && result.retryAfterMs > 0) {
          const seconds = Math.ceil(result.retryAfterMs / 1000);
          setCommunitySaveMagicLinkError(
            tLogin("errors.rateLimited").replace("{seconds}", String(seconds)),
          );
        } else {
          setCommunitySaveMagicLinkError(
            result.error || tLogin("errors.generic"),
          );
        }
        return;
      }
      setTransferPendingFlag();
      updateState({ communitySaveEmail: trimmed });
      setCommunitySaveMagicLinkSuccess(true);
    } catch {
      setCommunitySaveMagicLinkError(tLogin("errors.network"));
    } finally {
      setCommunitySaveMagicLinkSubmitting(false);
    }
  }, [state.communitySaveEmail, tLogin, updateState]);

  const isCompletedStep = currentStep === "completed";
  const isRightRailStep = currentStep === "decision-approaches";
  const isFinalReviewStep = currentStep === "final-review";
  const isCardLayoutStep = createFlowStepUsesCardLayout(currentStep);
  /** Two-column select / right-rail: below `lg` main scrolls; at `lg+` only the right column scrolls. */
  const isSelectSplitScrollStep =
    currentStep === "community-size" ||
    currentStep === "community-structure" ||
    currentStep === "core-values" ||
    currentStep === "decision-approaches";
  const stepIdx = currentStep != null ? getStepIndex(currentStep) : -1;

  /** At `md+`, main cross-axis: center by default; exceptions stay top-aligned (see product spec). */
  const mainContentClass = isCompletedStep
    ? "items-stretch overflow-y-auto md:overflow-hidden"
    : isSelectSplitScrollStep
      ? "items-start justify-start overflow-y-auto max-lg:overflow-y-auto lg:min-h-0 lg:items-stretch lg:overflow-hidden"
      : isFinalReviewStep || isCardLayoutStep || isTemplateReviewRoute
        ? "items-start justify-center overflow-y-auto"
        : "items-start justify-center overflow-y-auto md:items-center";

  const isTextStep = createFlowStepUsesCenteredTextLayout(currentStep);
  const mainMaxMdJustify =
    isTextStep && !isCompletedStep && !isRightRailStep
      ? "max-md:justify-center"
      : "max-md:justify-start";
  const mainMaxMdCross = isCompletedStep
    ? "max-md:flex-col max-md:items-stretch"
    : "max-md:flex-col max-md:items-center";
  const mainResponsiveLayout = `${mainMaxMdCross} ${mainMaxMdJustify} md:flex-row md:justify-center`;
  const saveDraftOnExit =
    Boolean(sessionUser) && stepIdx >= SAVE_EXIT_FROM_STEP_INDEX;

  const proportionBarProgress = getProportionBarProgressForCreateFlowStep(
    currentStep,
  );

  const footerPrimaryButtonClass =
    "md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]";

  const hasTopOverlays =
    Boolean(draftSaveBannerMessage) ||
    Boolean(publishBannerMessage) ||
    Boolean(templateReviewApplyError) ||
    Boolean(communitySaveMagicLinkError) ||
    Boolean(communitySaveMagicLinkSuccess);

  return (
    <div className="relative flex h-screen min-h-0 flex-col overflow-hidden bg-black">
      {hasTopOverlays ? (
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
          {templateReviewApplyError ? (
            <div className="pointer-events-auto mx-auto w-full max-w-[960px]">
              <Alert
                type="banner"
                status="danger"
                title={messages.create.templateReview.errors.applyFailed}
                description={templateReviewApplyError}
                onClose={() => setTemplateReviewApplyError(null)}
                className="w-full"
              />
            </div>
          ) : null}
          {communitySaveMagicLinkError ? (
            <div className="pointer-events-auto mx-auto w-full max-w-[960px]">
              <Alert
                type="banner"
                status="danger"
                title={communitySaveMessages.magicLinkErrorTitle}
                description={communitySaveMagicLinkError}
                onClose={() => setCommunitySaveMagicLinkError(null)}
                className="w-full"
              />
            </div>
          ) : null}
          {communitySaveMagicLinkSuccess ? (
            <div className="pointer-events-auto mx-auto w-full max-w-[960px]">
              <Alert
                type="banner"
                status="positive"
                title={communitySaveMessages.magicLinkSuccessTitle}
                description={communitySaveMessages.magicLinkSuccessDescription}
                onClose={() => setCommunitySaveMagicLinkSuccess(false)}
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
        className={`flex min-h-0 flex-1 w-full ${mainContentClass} ${mainResponsiveLayout}`}
      >
        {children}
      </main>
      {!isCompletedStep && (
        <CreateFlowFooter
          className="shrink-0"
          progressBar={!isTemplateReviewRoute && !isFinalReviewStep}
          proportionBarProgress={proportionBarProgress}
          proportionBarVariant="segmented"
          secondButton={
            isTemplateReviewRoute ? (
              <div className="flex flex-shrink-0 items-center gap-3 md:gap-4">
                <Button
                  buttonType="ghost"
                  palette="default"
                  size="xsmall"
                  disabled={isApplyingTemplate}
                  className="md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)] !text-white"
                  onClick={() => void handleUseTemplateWithoutChanges()}
                >
                  {messages.create.templateReview.footer.useWithoutChanges}
                </Button>
                <Button
                  buttonType="filled"
                  palette="default"
                  size="xsmall"
                  disabled={isApplyingTemplate}
                  title={
                    messages.create.templateReview.footer.customizeAriaHint
                  }
                  className="md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]"
                  onClick={() => {
                    if (!templateReviewSlug) return;
                    // Preserve template slug for a future customize / prefill ticket (informational does not read it yet).
                    router.push(
                      `/create/informational?template=${encodeURIComponent(templateReviewSlug)}`,
                    );
                  }}
                >
                  {messages.create.templateReview.footer.customize}
                </Button>
              </div>
            ) : currentStep === "community-name" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={isPublishing}
                className={footerPrimaryButtonClass}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer.confirmName}
              </Button>
            ) : currentStep === "community-save" && nextStep ? (
              <div className="flex flex-shrink-0 items-center gap-3 md:gap-4">
                <Button
                  buttonType="outline"
                  palette="default"
                  size="xsmall"
                  disabled={isPublishing}
                  className={footerPrimaryButtonClass}
                  onClick={() => {
                    goToNextStep();
                  }}
                >
                  {footer.saveLater}
                </Button>
                <Button
                  buttonType="filled"
                  palette="default"
                  size="xsmall"
                  disabled={
                    isPublishing ||
                    communitySaveMagicLinkSubmitting ||
                    communitySaveMagicLinkSuccess ||
                    !isValidCreateFlowSaveEmail(state.communitySaveEmail)
                  }
                  className={footerPrimaryButtonClass}
                  onClick={() => {
                    void handleCommunitySaveMagicLinkSubmit();
                  }}
                >
                  {communitySaveMagicLinkSubmitting
                    ? footer.submitEmailSending
                    : footer.submitEmail}
                </Button>
              </div>
            ) : currentStep === "review" && nextStep ? (
              <div className="flex flex-shrink-0 items-center gap-3 md:gap-4">
                <Button
                  buttonType="outline"
                  palette="default"
                  size="xsmall"
                  disabled={isPublishing}
                  className={footerPrimaryButtonClass}
                  onClick={() => {
                    goToNextStep();
                  }}
                >
                  {footer.createCustom}
                </Button>
                <Button
                  buttonType="filled"
                  palette="default"
                  size="xsmall"
                  disabled={isPublishing}
                  className={footerPrimaryButtonClass}
                  onClick={() => {
                    router.push("/templates");
                  }}
                >
                  {footer.createFromTemplate}
                </Button>
              </div>
            ) : currentStep === "core-values" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  (state.selectedCoreValueIds?.length ?? 0) === 0
                }
                className={footerPrimaryButtonClass}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer.confirmCoreValues}
              </Button>
            ) : currentStep === "communication-methods" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  (state.selectedCommunicationMethodIds?.length ?? 0) === 0
                }
                className={footerPrimaryButtonClass}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer.confirmCommunication}
              </Button>
            ) : currentStep === "membership-methods" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  (state.selectedMembershipMethodIds?.length ?? 0) === 0
                }
                className={footerPrimaryButtonClass}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer.confirmMembership}
              </Button>
            ) : currentStep === "decision-approaches" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  (state.selectedDecisionApproachIds?.length ?? 0) === 0
                }
                className={footerPrimaryButtonClass}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer.confirmRightRail}
              </Button>
            ) : currentStep === "conflict-management" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  (state.selectedConflictManagementIds?.length ?? 0) === 0
                }
                className={footerPrimaryButtonClass}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer.confirmConflictManagement}
              </Button>
            ) : nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={isPublishing}
                className={footerPrimaryButtonClass}
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
                    : footer.finalizeCommunityRule
                  : currentStep === "confirm-stakeholders"
                    ? footer.confirmStakeholders
                    : currentStep === "community-context"
                      ? footer.confirmDescription
                      : currentStep === "community-structure"
                        ? footer.confirmDetails
                        : currentStep === "community-size"
                          ? footer.confirmMembers
                          : footer.next}
              </Button>
            ) : null
          }
          onBackClick={
            isTemplateReviewRoute
              ? () => router.push("/")
              : previousStep
                ? goToPreviousStep
                : undefined
          }
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
