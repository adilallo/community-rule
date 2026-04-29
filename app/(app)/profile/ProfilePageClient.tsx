"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useTranslation } from "../../contexts/MessagesContext";
import {
  deleteAccount,
  deletePublishedRule,
  deleteServerDraft,
  duplicatePublishedRule,
  fetchAuthSession,
  fetchMyPublishedRules,
  fetchServerDraftForProfile,
  logout,
  requestEmailChange,
  type MyPublishedRule,
} from "../../../lib/create/api";
import {
  FIRST_STEP,
  isValidStep,
} from "../create/utils/flowSteps";
import type { CreateFlowStep } from "../create/types";
import { clearAnonymousCreateFlowStorage } from "../create/utils/anonymousDraftStorage";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  ProfilePageSignedOutView,
  ProfilePageView,
} from "./_components/ProfilePage.view";

function resolveContinueStepState(
  state: { currentStep?: CreateFlowStep } & Record<string, unknown>,
): CreateFlowStep {
  const s = state.currentStep;
  if (s && isValidStep(s)) return s;
  return FIRST_STEP;
}

export default function ProfilePageClient() {
  const t = useTranslation("pages.profile");
  const router = useRouter();
  const { openLogin } = useAuthModal();
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [rules, setRules] = useState<MyPublishedRule[]>([]);
  const [rulesError, setRulesError] = useState(false);
  const [draft, setDraft] = useState<
    Awaited<ReturnType<typeof fetchServerDraftForProfile>>
  >(null);
  const [ruleDeleteTargetId, setRuleDeleteTargetId] = useState<string | null>(
    null,
  );
  const [ruleDeleteBusy, setRuleDeleteBusy] = useState(false);
  const [draftDeleteOpen, setDraftDeleteOpen] = useState(false);
  const [draftDeleteBusy, setDraftDeleteBusy] = useState(false);
  const [accountDeleteOpen, setAccountDeleteOpen] = useState(false);
  const [accountDeleteBusy, setAccountDeleteBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [emailChangeOpen, setEmailChangeOpen] = useState(false);
  const [emailChangeInput, setEmailChangeInput] = useState("");
  const [emailChangeBusy, setEmailChangeBusy] = useState(false);
  const [emailChangeModalError, setEmailChangeModalError] = useState<
    string | null
  >(null);
  const [emailChangeRequestSent, setEmailChangeRequestSent] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<
    string | null
  >(null);
  const emailChangeQueryHandledRef = useRef(false);

  const load = useCallback(async () => {
    setActionError(null);
    const { user: u } = await fetchAuthSession();
    setUser(u);
    setSessionLoaded(true);
    if (!u) {
      setRules([]);
      setRulesError(false);
      setDraft(null);
      return;
    }
    const [r, d] = await Promise.all([
      fetchMyPublishedRules(),
      fetchServerDraftForProfile(),
    ]);
    if (r === null) {
      setRules([]);
      setRulesError(true);
    } else {
      setRules(r);
      setRulesError(false);
    }
    setDraft(d);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (emailChangeQueryHandledRef.current) return;
    if (typeof window === "undefined") return;
    const search = window.location.search;
    if (!search) return;
    const params = new URLSearchParams(search);
    const ok = params.get("email_change");
    const err = params.get("error");
    if (ok !== "ok" && !err?.startsWith("email_change_")) return;

    emailChangeQueryHandledRef.current = true;

    if (ok === "ok") {
      setProfileSuccessMessage(t("emailChangeSuccess"));
      void load().then(() => {
        router.refresh();
      });
    } else if (err === "email_change_expired") {
      setActionError(t("emailChangeVerifyExpired"));
    } else if (err === "email_change_invalid") {
      setActionError(t("emailChangeVerifyInvalid"));
    } else if (err === "email_change_taken") {
      setActionError(t("emailChangeVerifyTaken"));
    } else if (err === "email_change_server") {
      setActionError(t("actionError"));
    }

    router.replace("/profile", { scroll: false });
  }, [load, router, t]);

  const handleOpenEmailChange = useCallback(() => {
    if (!user) return;
    setActionError(null);
    setProfileSuccessMessage(null);
    setEmailChangeModalError(null);
    setEmailChangeRequestSent(false);
    setEmailChangeInput(user.email);
    setEmailChangeOpen(true);
  }, [user]);

  const handleCloseEmailChange = useCallback(() => {
    if (emailChangeBusy) return;
    setEmailChangeOpen(false);
    setEmailChangeRequestSent(false);
  }, [emailChangeBusy]);

  const handleDismissProfileSuccess = useCallback(() => {
    setProfileSuccessMessage(null);
  }, []);

  const handleDismissActionError = useCallback(() => {
    setActionError(null);
  }, []);

  const handleDismissRulesError = useCallback(() => {
    setRulesError(false);
  }, []);

  const handleDismissEmailChangeModalError = useCallback(() => {
    setEmailChangeModalError(null);
  }, []);

  const handleSubmitEmailChange = useCallback(async () => {
    const trimmed = emailChangeInput.trim();
    if (!trimmed || emailChangeBusy) return;
    setEmailChangeModalError(null);
    setEmailChangeBusy(true);
    const res = await requestEmailChange(trimmed);
    setEmailChangeBusy(false);
    if (res.ok === false) {
      if (res.retryAfterMs != null && res.retryAfterMs > 0) {
        const sec = Math.max(1, Math.ceil(res.retryAfterMs / 1000));
        setEmailChangeModalError(
          t("emailChangeRateLimited").replace(/\{\{seconds\}\}/g, String(sec)),
        );
      } else {
        setEmailChangeModalError(res.error);
      }
    } else {
      setEmailChangeRequestSent(true);
    }
  }, [emailChangeBusy, emailChangeInput, t]);

  const handleSignOut = useCallback(async () => {
    setActionError(null);
    await logout();
    setUser(null);
    setRules([]);
    setDraft(null);
    router.refresh();
  }, [router]);

  const handleRequestDeleteRule = useCallback((id: string) => {
    setActionError(null);
    setRuleDeleteTargetId(id);
  }, []);

  const handleCloseDeleteRuleDialog = useCallback(() => {
    if (ruleDeleteBusy) return;
    setRuleDeleteTargetId(null);
  }, [ruleDeleteBusy]);

  const handleConfirmDeleteRule = useCallback(async () => {
    const id = ruleDeleteTargetId;
    if (!id || ruleDeleteBusy) return;

    setActionError(null);
    setRuleDeleteBusy(true);
    const res = await deletePublishedRule(id);
    setRuleDeleteBusy(false);
    if (res.ok === true) {
      setRuleDeleteTargetId(null);
      void load();
      return;
    }
    if (res.status === 404) {
      setActionError(t("notFound"));
      setRuleDeleteTargetId(null);
    } else if (res.status === 403) {
      setActionError(t("forbidden"));
      setRuleDeleteTargetId(null);
    } else {
      setActionError(t("actionError"));
    }
  }, [load, ruleDeleteBusy, ruleDeleteTargetId, t]);

  const handleDuplicateRule = useCallback(
    async (id: string) => {
      setActionError(null);
      const res = await duplicatePublishedRule(id);
      if (res.ok === true) {
        void load();
      } else {
        if (res.status === 404) {
          setActionError(t("notFound"));
        } else if (res.status === 403) {
          setActionError(t("forbidden"));
        } else {
          setActionError(t("actionError"));
        }
      }
    },
    [load, t],
  );

  const handleContinueDraft = useCallback(() => {
    if (draft == null || !draft.hasDraft) return;
    const step = resolveContinueStepState(draft.state);
    router.push(`/create/${step}`);
  }, [draft, router]);

  const handleRequestDeleteDraft = useCallback(() => {
    setActionError(null);
    setDraftDeleteOpen(true);
  }, []);

  const handleCloseDeleteDraftDialog = useCallback(() => {
    if (draftDeleteBusy) return;
    setDraftDeleteOpen(false);
  }, [draftDeleteBusy]);

  const handleConfirmDeleteDraft = useCallback(async () => {
    if (draftDeleteBusy) return;
    setActionError(null);
    setDraftDeleteBusy(true);
    clearAnonymousCreateFlowStorage();
    await deleteServerDraft();
    setDraftDeleteBusy(false);
    setDraftDeleteOpen(false);
    void load();
  }, [draftDeleteBusy, load]);

  const handleConfirmDeleteAccount = useCallback(async () => {
    setActionError(null);
    setAccountDeleteBusy(true);
    const res = await deleteAccount();
    setAccountDeleteBusy(false);
    if (res.ok) {
      setAccountDeleteOpen(false);
      setUser(null);
      setRules([]);
      setDraft(null);
      router.push("/");
      router.refresh();
      return;
    }
    setActionError(t("actionError"));
  }, [router, t]);

  /** `lg`+ layout; matches `--breakpoint-lg` in `app/tailwind.css`. */
  const isProfileLgUp = useMediaQuery("(min-width: 1024px)");
  /** `List` L + Bricolage section titles — Figma `22143:900247`; matches `--breakpoint-xl` (1440px). */
  const isProfileXlUp = useMediaQuery("(min-width: 1440px)");

  if (!sessionLoaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="font-inter text-sm text-[var(--color-content-default-secondary)]">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <ProfilePageSignedOutView
        profileLgUp={isProfileLgUp}
        onSignIn={() => openLogin({ nextPath: "/profile" })}
      />
    );
  }

  const showDraftCard = Boolean(
    draft && draft.hasDraft,
  );

  return (
    <ProfilePageView
      userEmail={user.email}
      ruleCardSize={isProfileLgUp ? "L" : "M"}
      profileLgUp={isProfileLgUp}
      profileListSize={isProfileXlUp ? "l" : "m"}
      rules={rules}
      rulesError={rulesError}
      draft={draft}
      showDraftCard={showDraftCard}
      ruleDeleteOpen={ruleDeleteTargetId !== null}
      ruleDeleteBusy={ruleDeleteBusy}
      draftDeleteOpen={draftDeleteOpen}
      draftDeleteBusy={draftDeleteBusy}
      accountDeleteOpen={accountDeleteOpen}
      accountDeleteBusy={accountDeleteBusy}
      actionError={actionError}
      profileSuccessMessage={profileSuccessMessage}
      emailChangeOpen={emailChangeOpen}
      emailChangeValue={emailChangeInput}
      onEmailChangeValueChange={(value) => setEmailChangeInput(value)}
      emailChangeBusy={emailChangeBusy}
      emailChangeRequestSent={emailChangeRequestSent}
      emailChangeModalError={emailChangeModalError}
      onDismissProfileSuccess={handleDismissProfileSuccess}
      onDismissActionError={handleDismissActionError}
      onDismissRulesError={handleDismissRulesError}
      onDismissEmailChangeModalError={handleDismissEmailChangeModalError}
      onOpenEmailChange={handleOpenEmailChange}
      onCloseEmailChange={handleCloseEmailChange}
      onSubmitEmailChange={handleSubmitEmailChange}
      onSignOut={handleSignOut}
      onDeleteRule={handleRequestDeleteRule}
      onCloseDeleteRule={handleCloseDeleteRuleDialog}
      onConfirmDeleteRule={handleConfirmDeleteRule}
      onDuplicateRule={handleDuplicateRule}
      onContinueDraft={handleContinueDraft}
      onDeleteDraft={handleRequestDeleteDraft}
      onCloseDeleteDraft={handleCloseDeleteDraftDialog}
      onConfirmDeleteDraft={handleConfirmDeleteDraft}
      onOpenDeleteAccount={() => {
        setActionError(null);
        setAccountDeleteOpen(true);
      }}
      onCloseDeleteAccount={() => setAccountDeleteOpen(false)}
      onConfirmDeleteAccount={handleConfirmDeleteAccount}
    />
  );
}
