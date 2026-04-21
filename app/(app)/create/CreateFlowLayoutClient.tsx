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
import { useCreateFlowFinalize } from "./hooks/useCreateFlowFinalize";
import { useTemplateReviewActions } from "./hooks/useTemplateReviewActions";
import CreateFlowTopNav from "../../components/utility/CreateFlowTopNav";
import { getNextStep, getStepIndex } from "./utils/flowSteps";
import { getProportionBarProgressForCreateFlowStep } from "./utils/createFlowProportionProgress";
import {
  createFlowStepUsesCenteredTextLayout,
  createFlowStepUsesCardLayout,
} from "./utils/createFlowScreenRegistry";
import CreateFlowFooter from "../../components/utility/CreateFlowFooter";
import Button from "../../components/buttons/Button";
import { isValidCreateFlowSaveEmail } from "../../../lib/create/isValidCreateFlowSaveEmail";
import {
  fetchAuthSession,
  requestMagicLink,
} from "../../../lib/create/api";
import { safeInternalPath } from "../../../lib/safeInternalPath";
import {
  clearAnonymousCreateFlowStorage,
  setTransferPendingFlag,
} from "./utils/anonymousDraftStorage";
import { deleteServerDraft } from "../../../lib/create/api";
import messages from "../../../messages/en/index";
import {
  CREATE_FLOW_FOOTER_BUTTON_CLASS,
  CREATE_FLOW_FOOTER_BUTTON_ON_DARK_CLASS,
} from "./utils/createFlowFooterClassNames";
import {
  CUSTOM_RULE_CONFIRM_FOOTER_STEP_BY_STEP,
  type CustomRuleConfirmFooterStep,
} from "./utils/customRuleConfirmFooterSteps";
import { getDefaultFooterLabel } from "./utils/createFlowFooterLabels";
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
  // Mirror in-progress draft to localStorage for ALL visitors once we know who
  // they are. Refresh-survival is the same UX for guest and signed-in users;
  // signed-in users additionally get an explicit "Save & Exit" that PUTs to
  // the server (handled in `useCreateFlowExit`).
  const enableLocalDraftMirroring = sessionResolved;

  return (
    <CreateFlowProvider enableLocalDraftMirroring={enableLocalDraftMirroring}>
      <CreateFlowDraftSaveBannerProvider>
        <Suspense fallback={null}>
          <CreateFlowLayoutContent
            sessionUser={sessionUser}
            sessionResolved={sessionResolved}
          >
            {children}
          </CreateFlowLayoutContent>
        </Suspense>
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
  const communitySaveMessages = create.community.communitySave;
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
    templateReviewFooterBackToCreateReview,
  } = useCreateFlowNavigation(
    skipCommunitySave ? { skipCommunitySave: true } : undefined,
  );
  const { state, clearState, updateState, resetCustomRuleSelections } =
    useCreateFlow();
  const { draftSaveBannerMessage, setDraftSaveBannerMessage } =
    useCreateFlowDraftSaveBanner();
  const [communitySaveMagicLinkSubmitting, setCommunitySaveMagicLinkSubmitting] =
    useState(false);
  const [communitySaveMagicLinkError, setCommunitySaveMagicLinkError] = useState<
    string | null
  >(null);
  const [communitySaveMagicLinkSuccess, setCommunitySaveMagicLinkSuccess] =
    useState(false);

  const {
    publishBannerMessage,
    setPublishBannerMessage,
    isPublishing,
    finalize: handleFinalize,
  } = useCreateFlowFinalize({ state, router, openLogin });

  const {
    isTemplateReviewRoute,
    templateReviewSlug,
    isApplyingTemplate,
    templateReviewApplyError,
    setTemplateReviewApplyError,
    handleCustomize: handleCustomizeTemplate,
    handleUseWithoutChanges: handleUseTemplateWithoutChanges,
  } = useTemplateReviewActions({
    pathname,
    state,
    updateState,
    resetCustomRuleSelections,
    router,
  });

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

    // Exit from `/create/completed` is post-publish: the rule is saved, so we
    // skip the leave-confirm + login prompt and just wipe the in-flight draft.
    // For signed-in users we also DELETE the server draft so a future visit to
    // /create starts fresh instead of rehydrating yesterday's work.
    if (currentStep === "completed") {
      clearState();
      clearAnonymousCreateFlowStorage();
      if (sessionUser) {
        void deleteServerDraft();
      }
      router.push("/");
      return;
    }

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

  /**
   * Custom Rule stage "confirm selection" steps: all five render the same
   * primary footer button, differing only by disable predicate and label.
   * Driving JSX from a config keeps the five sites aligned — adding a new
   * selection screen means one row here, not a new branch below.
   */
  const customRuleConfirmFooter: CustomRuleConfirmFooterStep | undefined =
    currentStep != null
      ? CUSTOM_RULE_CONFIRM_FOOTER_STEP_BY_STEP.get(currentStep)
      : undefined;

  /**
   * Top banner stack rendered above the main column when any of the
   * shell-level statuses are active. Each entry maps to one `<Alert>`;
   * we filter out empty messages so the wrapper only mounts when at
   * least one banner is actually showing. Order here is the visual
   * stacking order (top → bottom).
   */
  const topBanners: Array<{
    key: string;
    status: "danger" | "positive";
    title: string;
    description?: string;
    onClose: () => void;
  }> = [
    draftSaveBannerMessage
      ? {
          key: "draftSave",
          status: "danger" as const,
          title: messages.create.topNav.draftSaveBannerTitle,
          description: draftSaveBannerMessage,
          onClose: () => setDraftSaveBannerMessage(null),
        }
      : null,
    publishBannerMessage
      ? {
          key: "publish",
          status: "danger" as const,
          title:
            messages.create.reviewAndComplete.publish.finalizeBannerTitle,
          description: publishBannerMessage,
          onClose: () => setPublishBannerMessage(null),
        }
      : null,
    templateReviewApplyError
      ? {
          key: "templateApply",
          status: "danger" as const,
          title: messages.create.templateReview.errors.applyFailed,
          description: templateReviewApplyError,
          onClose: () => setTemplateReviewApplyError(null),
        }
      : null,
    communitySaveMagicLinkError
      ? {
          key: "magicLinkError",
          status: "danger" as const,
          title: communitySaveMessages.magicLinkErrorTitle,
          description: communitySaveMagicLinkError,
          onClose: () => setCommunitySaveMagicLinkError(null),
        }
      : null,
    communitySaveMagicLinkSuccess
      ? {
          key: "magicLinkSuccess",
          status: "positive" as const,
          title: communitySaveMessages.magicLinkSuccessTitle,
          description: communitySaveMessages.magicLinkSuccessDescription,
          onClose: () => setCommunitySaveMagicLinkSuccess(false),
        }
      : null,
  ].filter((b): b is NonNullable<typeof b> => b !== null);

  return (
    <div className="relative flex h-screen min-h-0 flex-col overflow-hidden bg-black">
      {topBanners.length > 0 ? (
        <div
          className="pointer-events-none fixed left-0 right-0 top-0 z-[200] flex flex-col gap-2 px-[var(--spacing-measures-spacing-500,20px)] pt-[var(--spacing-measures-spacing-300,12px)] md:px-[var(--measures-spacing-1800,64px)]"
          aria-live="polite"
        >
          {topBanners.map((b) => (
            <div
              key={b.key}
              className="pointer-events-auto mx-auto w-full max-w-[960px]"
            >
              <Alert
                type="banner"
                status={b.status}
                title={b.title}
                description={b.description}
                onClose={b.onClose}
                className="w-full"
              />
            </div>
          ))}
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
                  className={CREATE_FLOW_FOOTER_BUTTON_ON_DARK_CLASS}
                  onClick={() => void handleUseTemplateWithoutChanges()}
                >
                  {messages.create.templateReview.footer.useWithoutChanges}
                </Button>
                <Button
                  buttonType="filled"
                  palette="default"
                  size="xsmall"
                  disabled={isApplyingTemplate}
                  className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
                  onClick={() => void handleCustomizeTemplate()}
                >
                  {messages.create.templateReview.footer.customize}
                </Button>
              </div>
            ) : currentStep === "community-name" && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  typeof state.title !== "string" ||
                  state.title.trim().length === 0
                }
                className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
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
                  className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
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
                  className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
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
                  className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
                  onClick={() => {
                    // Scrub any prior template-customize prefill so entering
                    // the custom-rule stage from review is always a clean slate.
                    resetCustomRuleSelections();
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
                  className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
                  onClick={() => {
                    // `fromFlow=1` tells `/templates` to skip the fresh-slate
                    // draft clear it normally runs on template click, so the
                    // user's in-progress Create Community stage survives this
                    // detour. Direct entries to `/templates` (no marker) and
                    // home "Popular templates" clicks always start fresh by
                    // wiping anonymous draft storage at click time.
                    router.push("/templates?fromFlow=1");
                  }}
                >
                  {footer.createFromTemplate}
                </Button>
              </div>
            ) : customRuleConfirmFooter && nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={
                  isPublishing ||
                  customRuleConfirmFooter.selectionIds(state).length === 0
                }
                className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
                onClick={() => {
                  goToNextStep();
                }}
              >
                {footer[customRuleConfirmFooter.footerMessageKey]}
              </Button>
            ) : nextStep ? (
              <Button
                buttonType="filled"
                palette="default"
                size="xsmall"
                disabled={isPublishing}
                className={CREATE_FLOW_FOOTER_BUTTON_CLASS}
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
                    ? messages.create.reviewAndComplete.publish
                        .finalizeButtonPublishing
                    : footer.finalizeCommunityRule
                  : getDefaultFooterLabel(currentStep, footer)}
              </Button>
            ) : null
          }
          onBackClick={
            isTemplateReviewRoute
              ? () =>
                  router.push(
                    templateReviewFooterBackToCreateReview
                      ? "/create/review"
                      : "/",
                  )
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
