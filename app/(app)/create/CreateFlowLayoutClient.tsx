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
import {
  clearAnonymousCreateFlowStorage,
  setTransferPendingFlag,
} from "./utils/anonymousDraftStorage";
import { deleteServerDraft } from "../../../lib/create/api";
import { writeLastPublishedRule } from "../../../lib/create/lastPublishedRule";
import { buildTemplateCustomizePrefill } from "../../../lib/create/applyTemplatePrefill";
import { loadTemplateReviewBySlug } from "../../../lib/create/loadTemplateReviewBySlug";
import messages from "../../../messages/en/index";
import {
  CREATE_FLOW_FOOTER_BUTTON_CLASS,
  CREATE_FLOW_FOOTER_BUTTON_ON_DARK_CLASS,
} from "./utils/createFlowFooterClassNames";
import {
  CUSTOM_RULE_CONFIRM_FOOTER_STEP_BY_STEP,
  type CustomRuleConfirmFooterStep,
} from "./utils/customRuleConfirmFooterSteps";
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
  } = useCreateFlowNavigation(
    skipCommunitySave ? { skipCommunitySave: true } : undefined,
  );
  const { state, clearState, updateState, resetCustomRuleSelections } =
    useCreateFlow();
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
          ? messages.create.reviewAndComplete.publish.missingCommunityName
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
        : messages.create.reviewAndComplete.publish.genericPublishFailed,
    );
  }, [state, router, openLogin]);

  /**
   * Customize flow from a template-review page. Applies the template's
   * customize selections onto `CreateFlowState` so the custom-rule screens
   * render with chips pre-highlighted, then routes to `core-values` once
   * the community name is set — otherwise to `informational` with a
   * `pendingTemplateAction` pin so `/create/review` later redirects past
   * itself straight to `core-values` (see `CommunityReviewScreen`).
   *
   * Why title alone? Other community-stage fields (e.g.
   * `communityStructureChipSnapshots`) are sticky once the user lands on
   * those screens, so they can't reliably answer "has the user given us
   * real input yet?". A non-empty community name is the minimum bar
   * `buildPublishPayload` already enforces — we reuse that here.
   *
   * Direct entry (marketing home "Popular templates" or `/templates`
   * landed on directly) wipes the anonymous draft at the *click site* via
   * `clearCreateFlowPersistedDrafts` before navigating, so `state.title`
   * is empty here and the no-community branch fires naturally. No
   * URL-marker plumbing needed in this handler.
   */
  const handleCustomizeTemplate = useCallback(async () => {
    if (!templateReviewSlug) return;
    setTemplateReviewApplyError(null);
    setIsApplyingTemplate(true);
    const loaded = await loadTemplateReviewBySlug(templateReviewSlug);
    setIsApplyingTemplate(false);
    if (loaded.ok === false) {
      setTemplateReviewApplyError(loaded.message);
      return;
    }
    const prefill = buildTemplateCustomizePrefill(loaded.template.body);
    const hasCommunityName =
      typeof state.title === "string" && state.title.trim().length > 0;
    // Prefill merges (shallow) with current state. When we have to bounce the
    // user to the community stage first, pin a pendingTemplateAction so
    // `/create/review` knows to skip past itself to `core-values` later.
    updateState({
      ...prefill,
      ...(hasCommunityName
        ? { pendingTemplateAction: undefined }
        : {
            pendingTemplateAction: {
              slug: templateReviewSlug,
              mode: "customize",
            },
          }),
    });
    router.push(
      hasCommunityName ? "/create/core-values" : "/create/informational",
    );
  }, [router, state.title, templateReviewSlug, updateState]);

  /**
   * "Use without changes" from a template-review page. Drops users into the
   * review-and-complete stage (`confirm-stakeholders` → `final-review`) so the
   * publish flow — and its server-enforced sign-in gate (`publishRule` 401 →
   * `openLogin`) — is reused. The template body becomes the rule document;
   * the user's community name remains the rule title.
   *
   * Community-name branch: apply template body/summary immediately and jump
   * to `confirm-stakeholders`.
   *
   * No-community-name branch: same template body/summary apply so state is
   * ready, plus a `pendingTemplateAction` pin so `/create/review` later
   * redirects past itself straight to `confirm-stakeholders` once community
   * data is captured (see `CommunityReviewScreen`). Users aren't forced back
   * through the template picker just to pick the same template again.
   *
   * Direct entry (marketing home "Popular templates" or `/templates`
   * landed on directly) wipes the anonymous draft at the click site via
   * `clearCreateFlowPersistedDrafts` before navigating, so `state.title`
   * is empty and the no-community branch fires naturally.
   */
  const handleUseTemplateWithoutChanges = useCallback(async () => {
    if (!templateReviewSlug) return;
    setTemplateReviewApplyError(null);

    setIsApplyingTemplate(true);
    const loaded = await loadTemplateReviewBySlug(templateReviewSlug);
    setIsApplyingTemplate(false);
    if (loaded.ok === false) {
      setTemplateReviewApplyError(loaded.message);
      return;
    }
    const { template } = loaded;
    const doc = template.body;
    if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
      setTemplateReviewApplyError(messages.create.templateReview.errors.applyFailed);
      return;
    }
    const sectionsRaw = (doc as { sections?: unknown }).sections;
    const sections = Array.isArray(sectionsRaw)
      ? (sectionsRaw as Record<string, unknown>[])
      : [];
    if (sections.length === 0) {
      setTemplateReviewApplyError(messages.create.templateReview.errors.applyFailed);
      return;
    }

    // Using the template verbatim: scrub any prior customize picks so they
    // don't bleed into `document.coreValues` at publish time.
    resetCustomRuleSelections();

    const summaryRaw =
      typeof template.description === "string"
        ? template.description.trim()
        : "";
    const hasCommunityName =
      typeof state.title === "string" && state.title.trim().length > 0;
    updateState({
      sections,
      ...(summaryRaw.length > 0 ? { summary: summaryRaw } : {}),
      ...(hasCommunityName
        ? { pendingTemplateAction: undefined }
        : {
            pendingTemplateAction: {
              slug: templateReviewSlug,
              mode: "useWithoutChanges",
            },
          }),
    });
    router.push(
      hasCommunityName
        ? "/create/confirm-stakeholders"
        : "/create/informational",
    );
  }, [
    resetCustomRuleSelections,
    router,
    state.title,
    templateReviewSlug,
    updateState,
  ]);

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
                title={messages.create.reviewAndComplete.publish.finalizeBannerTitle}
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
                    ? messages.create.reviewAndComplete.publish.finalizeButtonPublishing
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
