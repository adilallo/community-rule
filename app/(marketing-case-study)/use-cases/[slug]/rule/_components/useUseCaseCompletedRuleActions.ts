"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModal } from "../../../../../contexts/AuthModalContext";
import { useTranslation } from "../../../../../contexts/MessagesContext";
import {
  duplicateUseCaseTemplate,
  fetchAuthSession,
} from "../../../../../../lib/create/api";
import type { UseCaseDetailSlug } from "../../../../../../lib/useCaseSyntheticPost";
import type { UseCaseCompletedRuleFixture } from "../../../../../../lib/useCaseCompletedRule";

export type UseCaseCompletedRuleActionBanner = {
  key: string;
  status: "positive" | "danger";
  title: string;
  description?: string;
};

export function useUseCaseCompletedRuleActions({
  slug,
  fixture,
  setActionBanner,
}: {
  slug: UseCaseDetailSlug;
  fixture: UseCaseCompletedRuleFixture;
  setActionBanner: (_: UseCaseCompletedRuleActionBanner | null) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useAuthModal();
  const t = useTranslation("pages.useCasesCompletedRule.topNav");
  const [duplicateBusy, setDuplicateBusy] = useState(false);

  const copyPageLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setActionBanner({
        key: "shareCopied",
        status: "positive",
        title: t("shareLinkCopiedTitle"),
        description: t("shareLinkCopiedDescription"),
      });
    } catch {
      setActionBanner({
        key: "shareCopyFailed",
        status: "danger",
        title: t("shareCopyFailedTitle"),
        description: t("shareCopyFailedDescription"),
      });
    }
  }, [setActionBanner, t]);

  const mailtoPageLink = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const subject = encodeURIComponent(fixture.title);
    const body = encodeURIComponent(`${fixture.summary}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [fixture.summary, fixture.title]);

  const handleDuplicate = useCallback(async () => {
    if (duplicateBusy) return;

    setActionBanner(null);
    const { user } = await fetchAuthSession();
    if (!user) {
      openLogin({
        nextPath:
          pathname && pathname.length > 0
            ? pathname
            : `/use-cases/${slug}/rule`,
        backdropVariant: "blurredYellow",
      });
      return;
    }

    setDuplicateBusy(true);
    const res = await duplicateUseCaseTemplate(slug);
    setDuplicateBusy(false);

    if (res.ok === false) {
      if (res.status === 401) {
        openLogin({
          nextPath:
            pathname && pathname.length > 0
              ? pathname
              : `/use-cases/${slug}/rule`,
          backdropVariant: "blurredYellow",
        });
        return;
      }

      setActionBanner({
        key: "duplicateFailed",
        status: "danger",
        title: t("duplicateFailedTitle"),
        description:
          res.status === 404 ? t("duplicateNotFoundDescription") : res.error,
      });
      return;
    }

    router.push("/profile");
  }, [
    duplicateBusy,
    openLogin,
    pathname,
    router,
    setActionBanner,
    slug,
    t,
  ]);

  return {
    copyPageLink,
    mailtoPageLink,
    handleDuplicate,
  };
}
