"use client";

import { useId, useMemo } from "react";
import Button from "../../../components/buttons/Button";
import RuleCard from "../../../components/cards/RuleCard";
import List from "../../../components/layout/List";
import type { ListItem, ListSize } from "../../../components/layout/List";
import Dialog from "../../../components/modals/Dialog";
import HeaderLockup from "../../../components/type/HeaderLockup";
import { useTranslation } from "../../../contexts/MessagesContext";
import type { CreateFlowState } from "../../create/types";
import type {
  MyPublishedRule,
  ServerDraftForProfile,
} from "../../../../lib/create/api";

function draftBodyTextFromState(
  state: CreateFlowState,
): string | undefined {
  const ctx = state.communityContext?.trim();
  if (ctx) return ctx;
  const summary = state.summary?.trim();
  if (summary) return summary;
  return undefined;
}

export type ProfilePageViewProps = {
  userEmail: string;
  /** `M` below `lg` (1024px); `L` at `lg`+ per Figma Card / Rule. Breakpoints: `md` (640px) → `lg` (1024px) only. */
  ruleCardSize: "M" | "L";
  /** `true` at `lg` (1024px)+ — welcome uses {@link HeaderLockup} size `L` per `21962:17220`. */
  profileLgUp: boolean;
  /** `m` = {@link List} M; `l` = List L at `xl` per Figma `22143:900256`. */
  profileListSize: Extract<ListSize, "m" | "l">;
  rules: MyPublishedRule[];
  rulesError: boolean;
  draft: ServerDraftForProfile | null;
  showDraftCard: boolean;
  ruleDeleteOpen: boolean;
  ruleDeleteBusy: boolean;
  draftDeleteOpen: boolean;
  draftDeleteBusy: boolean;
  accountDeleteOpen: boolean;
  accountDeleteBusy: boolean;
  actionError: string | null;
  onSignOut: () => void;
  onDeleteRule: (id: string) => void;
  onCloseDeleteRule: () => void;
  onConfirmDeleteRule: () => void;
  onDuplicateRule: (id: string) => void;
  onContinueDraft: () => void;
  onDeleteDraft: () => void;
  onCloseDeleteDraft: () => void;
  onConfirmDeleteDraft: () => void;
  onOpenDeleteAccount: () => void;
  onCloseDeleteAccount: () => void;
  onConfirmDeleteAccount: () => void;
};

/**
 * Figma: Inter 20/28 from `md` to `lg`+ (e.g. `21962:17224`); at `xl` Bricolage 28/36 (`22143:900251`, `22143:900255` — `Medium/Heading`);
 * mobile: smaller Bricolage.
 */
const profileSectionHeadingClass =
  "font-bricolage text-base font-bold leading-[22px] text-[var(--color-content-default-primary)] md:font-inter md:text-xl md:font-bold md:leading-7 xl:font-bricolage-grotesque xl:font-bold xl:text-[28px] xl:leading-9";

/**
 * Sticky `top` for page content below the product {@link TopNav} (standard variant).
 * Must match `TopNav.view.tsx`: nav `h` 40px → `lg` 84px → `xl` 88px, plus `header` `border-b` (+1px).
 */
const stickyBelowTopNavTopClass =
  "top-[41px] lg:top-[85px] xl:top-[89px]";

export type ProfilePageSignedOutViewProps = {
  onSignIn: () => void;
  /** `min-width: 1024px` — welcome uses {@link HeaderLockup} `L` per Figma `21962:17220`. */
  profileLgUp: boolean;
};

/**
 * Signed-out profile: same shell as {@link ProfilePageView}
 * (Figma mobile `22143:900762`, md `22143:900534`, lg `21962:17220` via {@link HeaderLockup}).
 */
export function ProfilePageSignedOutView({
  onSignIn,
  profileLgUp,
}: ProfilePageSignedOutViewProps) {
  const t = useTranslation("pages.profile");
  const titleId = useId();

  return (
    <div className="w-full bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)]">
      <div className="flex flex-col gap-6 px-4 pt-4 pb-4 md:px-8 lg:gap-10 lg:px-16">
        <header
          className={
            profileLgUp
              ? `sticky z-10 bg-[var(--color-surface-default-primary)] ${stickyBelowTopNavTopClass}`
              : `flex flex-col gap-1 py-3 md:sticky md:top-[41px] md:z-10 md:bg-[var(--color-surface-default-primary)]`
          }
        >
          {profileLgUp ? (
            <HeaderLockup
              titleId={titleId}
              title={t("pageTitle")}
              description={t("signInPrompt")}
              size="L"
              justification="left"
            />
          ) : (
            <>
              <h1
                id={titleId}
                className="font-inter text-xl font-bold leading-7 text-[var(--color-content-default-primary)] md:font-bricolage-grotesque md:text-[28px] md:font-bold md:leading-[36px]"
              >
                {t("pageTitle")}
              </h1>
              <p className="max-w-[640px] font-inter text-sm font-normal leading-5 text-[var(--color-content-default-tertiary)] md:text-base md:leading-6">
                {t("signInPrompt")}
              </p>
            </>
          )}
        </header>
        <Button
          type="button"
          size="small"
          buttonType="filled"
          palette="default"
          className="self-start"
          onClick={onSignIn}
        >
          {t("signInCta")}
        </Button>
      </div>
    </div>
  );
}

/**
 * Figma: mobile `22143:900762`; tablet `md` `22143:900534` (`@theme --breakpoint-md` 640px);
 * desktop `lg` `21962:17220` (`@theme --breakpoint-lg` 1024px);
 * `xl` `22143:900247` (same content spacing as lg; list + section type at `xl` — `List` L `21844:4405`).
 */
export function ProfilePageView({
  userEmail,
  ruleCardSize,
  profileLgUp,
  profileListSize,
  rules,
  rulesError,
  draft,
  showDraftCard,
  ruleDeleteOpen,
  ruleDeleteBusy,
  draftDeleteOpen,
  draftDeleteBusy,
  accountDeleteOpen,
  accountDeleteBusy,
  actionError,
  onSignOut,
  onDeleteRule,
  onCloseDeleteRule,
  onConfirmDeleteRule,
  onDuplicateRule,
  onContinueDraft,
  onDeleteDraft,
  onCloseDeleteDraft,
  onConfirmDeleteDraft,
  onOpenDeleteAccount,
  onCloseDeleteAccount,
  onConfirmDeleteAccount,
}: ProfilePageViewProps) {
  const t = useTranslation("pages.profile");
  const titleId = useId();
  const welcomeTitle = t("welcomeTitle").replace(/\{\{name\}\}/g, userEmail);
  const welcomeBody =
    rules.length > 0 ? t("welcomeBodyFirstRule") : t("welcomeBodyNoRules");

  const profileOptionsItems = useMemo((): ListItem[] => {
    return [
      {
        id: "create-custom",
        title: t("optionCreateCustom"),
        description: "",
        href: "/create",
        leadingIcon: "edit",
        showDescription: false,
      },
      {
        id: "create-template",
        title: t("optionCreateTemplate"),
        description: "",
        href: "/templates?fromFlow=1",
        leadingIcon: "content_copy",
        showDescription: false,
      },
      {
        id: "logout",
        title: t("optionLogout"),
        description: "",
        onClick: onSignOut,
        leadingIcon: "log_out",
        showDescription: false,
      },
      {
        id: "change-email",
        title: t("optionChangeEmail"),
        description: "",
        leadingIcon: "mail",
        variant: "muted",
        showDescription: false,
      },
      {
        id: "delete-account",
        title: t("deleteAccount"),
        description: "",
        onClick: onOpenDeleteAccount,
        leadingIcon: "warning",
        variant: "danger",
        showDescription: false,
      },
    ];
  }, [t, onSignOut, onOpenDeleteAccount]);

  const ruleCardShellClass =
    "w-full !max-w-full cursor-default !gap-3 !rounded-[12px] shadow-[0_0_48px_rgba(0,0,0,0.1)] lg:!rounded-[24px] lg:shadow-[0_0_24px_rgba(0,0,0,0.1)]";

  return (
    <>
      <div className="w-full bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)]">
        <div className="flex flex-col gap-6 px-4 pt-4 pb-4 md:px-8 lg:gap-10 lg:px-16">
          <header
            className={
              profileLgUp
                ? `lg:sticky lg:z-10 lg:bg-[var(--color-surface-default-primary)] lg:top-[85px] xl:top-[89px]`
                : `flex flex-col gap-1 py-3 md:sticky md:top-[41px] md:z-10 md:bg-[var(--color-surface-default-primary)]`
            }
          >
            {profileLgUp ? (
              <HeaderLockup
                titleId={titleId}
                title={welcomeTitle}
                description={welcomeBody}
                size="L"
                justification="left"
              />
            ) : (
              <>
                <h1
                  id={titleId}
                  className="font-inter text-xl font-bold leading-7 text-[var(--color-content-default-primary)] md:font-bricolage-grotesque md:text-[28px] md:font-bold md:leading-[36px]"
                >
                  {welcomeTitle}
                </h1>
                <p className="max-w-[640px] font-inter text-sm font-normal leading-5 text-[var(--color-content-default-tertiary)] md:text-base md:leading-6">
                  {welcomeBody}
                </p>
              </>
            )}
          </header>

          {actionError ? (
            <p
              className="rounded-lg border border-[var(--color-border-default-secondary)] bg-[var(--color-surface-default-tertiary)] px-4 py-3 font-inter text-sm text-[var(--color-content-default-primary)]"
              role="alert"
            >
              {actionError}
            </p>
          ) : null}

          {rulesError ? (
            <p className="font-inter text-sm text-[var(--color-content-default-tertiary)]">
              {t("actionError")}
            </p>
          ) : null}

          <div className="flex flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-start lg:gap-8">
            <section
              className="flex min-w-0 w-full flex-col gap-3 lg:min-w-0 lg:flex-1 lg:gap-6"
              aria-labelledby="profile-rules-heading"
            >
              <h2
                id="profile-rules-heading"
                className={profileSectionHeadingClass}
                style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}
              >
                {t("yourRulesHeading")}
              </h2>
              <div className="flex flex-col gap-3">
                {showDraftCard && draft?.hasDraft ? (
                  <RuleCard
                    title={(() => {
                      const raw = draft.state.title;
                      const s = typeof raw === "string" ? raw.trim() : "";
                      return s || t("draftHeading");
                    })()}
                    description={draftBodyTextFromState(draft.state)}
                    expanded
                    size={ruleCardSize}
                    hasBottomLinks
                    bottomStatusLabel={t("draftInProgressBadge")}
                    bottomLinks={[
                      {
                        id: "continue",
                        label: t("continueDraft"),
                        onClick: onContinueDraft,
                      },
                      {
                        id: "delete-draft",
                        label: t("deleteRule"),
                        onClick: onDeleteDraft,
                      },
                    ]}
                    communityInitials={(() => {
                      const raw = draft.state.title;
                      const s = typeof raw === "string" ? raw.trim() : "";
                      return s.charAt(0).toUpperCase() || "·";
                    })()}
                    backgroundColor="bg-[var(--color-surface-invert-brand-teal)]"
                    className={ruleCardShellClass}
                  />
                ) : null}
                {rules.map((rule) => (
                  <RuleCard
                    key={rule.id}
                    title={rule.title}
                    description={rule.summary ?? undefined}
                    expanded
                    size={ruleCardSize}
                    hasBottomLinks
                    bottomLinks={[
                      {
                        id: "view",
                        label: t("viewPublic"),
                        href: `/create/completed?ruleId=${encodeURIComponent(rule.id)}`,
                      },
                      {
                        id: "dup",
                        label: t("duplicate"),
                        onClick: () => onDuplicateRule(rule.id),
                      },
                      {
                        id: "del",
                        label: t("deleteRule"),
                        onClick: () => onDeleteRule(rule.id),
                      },
                    ]}
                    communityInitials={
                      rule.title.trim().charAt(0).toUpperCase() || "·"
                    }
                    backgroundColor="bg-[var(--color-surface-invert-brand-teal)]"
                    className={ruleCardShellClass}
                  />
                ))}
              </div>
              {rules.length === 0 && !rulesError && !showDraftCard ? (
                <p className="font-inter text-sm text-[var(--color-content-default-tertiary)]">
                  {t("yourRulesEmpty")}
                </p>
              ) : null}
            </section>

            <section
              className="flex min-w-0 w-full flex-col gap-3 lg:min-w-0 lg:flex-1 lg:gap-6"
              aria-labelledby="profile-options-heading"
            >
              <h2
                id="profile-options-heading"
                className={profileSectionHeadingClass}
                style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}
              >
                {t("yourOptionsHeading")}
              </h2>
              <nav aria-label={t("yourOptionsHeading")}>
                <List
                  items={profileOptionsItems}
                  size={profileListSize}
                  topDivider
                  leadingIcon="edit"
                />
              </nav>
            </section>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={ruleDeleteOpen}
        onClose={() => {
          if (!ruleDeleteBusy) onCloseDeleteRule();
        }}
        backdropVariant="blurredYellow"
        title={t("deleteRuleModalTitle")}
        description={t("deleteRuleModalBody")}
        footer={
          <>
            <Button
              type="button"
              size="medium"
              buttonType="outline"
              palette="default"
              onClick={onCloseDeleteRule}
              disabled={ruleDeleteBusy}
            >
              {t("deleteRuleCancel")}
            </Button>
            <Button
              type="button"
              size="medium"
              buttonType="filled"
              palette="default"
              onClick={onConfirmDeleteRule}
              disabled={ruleDeleteBusy}
            >
              {t("deleteRuleConfirmCta")}
            </Button>
          </>
        }
      />

      <Dialog
        isOpen={draftDeleteOpen}
        onClose={() => {
          if (!draftDeleteBusy) onCloseDeleteDraft();
        }}
        backdropVariant="blurredYellow"
        title={t("deleteDraftModalTitle")}
        description={t("deleteDraftModalBody")}
        footer={
          <>
            <Button
              type="button"
              size="medium"
              buttonType="outline"
              palette="default"
              onClick={onCloseDeleteDraft}
              disabled={draftDeleteBusy}
            >
              {t("deleteDraftCancel")}
            </Button>
            <Button
              type="button"
              size="medium"
              buttonType="filled"
              palette="default"
              onClick={onConfirmDeleteDraft}
              disabled={draftDeleteBusy}
            >
              {t("deleteDraftConfirmCta")}
            </Button>
          </>
        }
      />

      <Dialog
        isOpen={accountDeleteOpen}
        onClose={() => {
          if (!accountDeleteBusy) onCloseDeleteAccount();
        }}
        backdropVariant="blurredYellow"
        title={t("deleteAccountModalTitle")}
        description={t("deleteAccountModalBody")}
        footer={
          <>
            <Button
              type="button"
              size="medium"
              buttonType="outline"
              palette="default"
              onClick={onCloseDeleteAccount}
              disabled={accountDeleteBusy}
            >
              {t("deleteAccountCancel")}
            </Button>
            <Button
              type="button"
              size="medium"
              buttonType="filled"
              palette="default"
              onClick={onConfirmDeleteAccount}
              disabled={accountDeleteBusy}
            >
              {t("deleteAccountConfirm")}
            </Button>
          </>
        }
      />
    </>
  );
}
