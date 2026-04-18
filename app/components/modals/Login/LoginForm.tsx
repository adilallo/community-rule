"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "../../../contexts/MessagesContext";
import Button from "../../buttons/Button";
import TextInput from "../../controls/TextInput";
import ContentLockup from "../../type/ContentLockup";
import { requestMagicLink } from "../../../../lib/create/api";
import { safeInternalPath } from "../../../../lib/safeInternalPath";
import { setTransferPendingFlag } from "../../../(app)/create/utils/anonymousDraftStorage";

/** Mail icon for login modal (inline SVG; same pattern as InfoMessageBox ExclamationIconInline). */
function MailIconInline() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden
      data-name="Asset / Icon / mail"
    >
      <path
        fill="#000000"
        d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"
      />
      <path
        fill="#000000"
        d="M22.5 6.908V6.75A2.25 2.25 0 0 0 20.25 4.5h-16.5A2.25 2.25 0 0 0 1.5 6.75v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"
      />
    </svg>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginFormVariant = "default" | "saveProgress";

export type LoginFormProps = {
  variant?: LoginFormVariant;
  /** Overrides URL `next` for `requestMagicLink` (e.g. create-flow exit modal). */
  magicLinkNextPath?: string;
};

export default function LoginForm({
  variant = "default",
  magicLinkNextPath,
}: LoginFormProps) {
  const t = useTranslation("pages.login");
  const tFooter = useTranslation("footer");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formAlertId = useId();
  const emailErrorId = useId();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  const nextParam = searchParams.get("next");
  const errorParam = searchParams.get("error");

  const isSaveProgress = variant === "saveProgress";

  /** Drop `error` from the URL so URL-driven messages don’t linger after a new attempt. */
  const stripErrorQuery = useCallback(() => {
    if (!searchParams.get("error")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const sendLink = useCallback(async () => {
    stripErrorQuery();
    setEmailError("");
    setFormError("");
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError(t("errors.emailInvalid"));
      return;
    }
    setSubmitting(true);
    try {
      const rawNext = magicLinkNextPath ?? nextParam;
      const nextPath = safeInternalPath(rawNext);
      const result = await requestMagicLink(trimmed, nextPath);
      if (result.ok === false) {
        if (result.retryAfterMs != null && result.retryAfterMs > 0) {
          const seconds = Math.ceil(result.retryAfterMs / 1000);
          setFormError(
            t("errors.rateLimited").replace("{seconds}", String(seconds)),
          );
        } else {
          setFormError(result.error || t("errors.generic"));
        }
        return;
      }
      if (isSaveProgress || nextPath.includes("syncDraft=1")) {
        setTransferPendingFlag();
      }
      setEmail(trimmed);
      setSent(true);
    } catch {
      setFormError(t("errors.network"));
    } finally {
      setSubmitting(false);
    }
  }, [
    email,
    isSaveProgress,
    magicLinkNextPath,
    nextParam,
    stripErrorQuery,
    t,
  ]);

  const urlErrorMessage =
    errorParam === "expired_link"
      ? t("errors.expiredLink")
      : errorParam === "invalid_link" || errorParam === "server"
        ? errorParam === "server"
          ? t("errors.serverError")
          : t("errors.invalidLink")
        : "";

  const titleId = "login-modal-heading";

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex flex-col gap-3">
        <div
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            isSaveProgress
              ? "bg-[#fefcc9]"
              : "bg-[var(--color-surface-inverse-brand-primary)]"
          }`}
        >
          <MailIconInline />
        </div>
        <ContentLockup
          titleId={titleId}
          title={
            sent
              ? t("successTitle")
              : isSaveProgress
                ? t("saveProgressTitle")
                : t("title")
          }
          description={
            sent
              ? t("successBody")
              : isSaveProgress
                ? t("saveProgressSubtitle")
                : t("subtitle")
          }
          variant="login"
          alignment="left"
        />
      </div>

      {urlErrorMessage ? (
        <p
          role="alert"
          aria-live="polite"
          className="text-center font-inter text-[14px] leading-[20px] text-[var(--color-border-default-utility-negative)]"
        >
          {urlErrorMessage}
        </p>
      ) : null}

      {formError ? (
        <p
          id={formAlertId}
          role="alert"
          aria-live="polite"
          className="font-inter text-[14px] leading-[20px] text-[var(--color-border-default-utility-negative)]"
        >
          {formError}
        </p>
      ) : null}

      {!sent ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void sendLink();
          }}
          noValidate
        >
          <TextInput
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              stripErrorQuery();
            }}
            disabled={submitting}
            error={Boolean(emailError)}
            showHelpIcon
          />
          {emailError ? (
            <p
              id={emailErrorId}
              role="alert"
              aria-live="polite"
              className="font-inter text-[14px] text-[var(--color-border-default-utility-negative)]"
            >
              {emailError}
            </p>
          ) : null}
          <Button
            type="submit"
            size="large"
            buttonType="filled"
            palette="default"
            disabled={submitting}
            className="w-full !justify-center text-center px-[var(--spacing-scale-016)] py-[var(--spacing-scale-012)]"
          >
            {t("sendMagicLink")}
          </Button>
          <p className="text-center font-inter text-[14px] leading-[20px] text-[var(--color-content-default-tertiary)]">
            {t("legalPrefix")}
            <Link
              href="#"
              className="text-[var(--color-content-default-tertiary)] underline decoration-solid underline-offset-2"
            >
              {tFooter("legal.termsOfService")}
            </Link>
            {t("legalAnd")}
            <Link
              href="#"
              className="text-[var(--color-content-default-tertiary)] underline decoration-solid underline-offset-2"
            >
              {tFooter("legal.privacyPolicy")}
            </Link>
            {t("legalSuffix")}
          </p>
        </form>
      ) : null}
    </div>
  );
}
