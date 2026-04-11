"use client";

import { use, useEffect, useState } from "react";
import HeaderLockup from "../../../components/type/HeaderLockup";
import { TemplateReviewCard } from "../../../components/cards/TemplateReviewCard";
import { useTranslation } from "../../../contexts/MessagesContext";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import {
  fetchTemplateBySlug,
  type RuleTemplateDto,
} from "../../../../lib/create/fetchTemplates";
import messages from "../../../../messages/en/index";
import Alert from "../../../components/modals/Alert";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Template review: same responsive grid and RuleCard chrome as final-review;
 * copy from Figma 22142-898702 (intro + dynamic card from API).
 */
export default function ReviewTemplatePage({ params }: PageProps) {
  const { slug: rawSlug } = use(params);
  const slug = decodeURIComponent(rawSlug);
  const t = useTranslation("create.templateReview");

  const [template, setTemplate] = useState<RuleTemplateDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- match final-review: defer breakpoint until mount
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
      const result = await fetchTemplateBySlug(slug);
      if (cancelled) return;
      if (result === null) {
        setError(messages.create.templateReview.errors.notFound);
        setTemplate(null);
      } else if ("error" in result) {
        setError(result.error);
        setTemplate(null);
      } else {
        setTemplate(result);
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const showDesktopLayout = !isMounted || isMdOrLarger;

  if (loading) {
    return (
      <div className="flex w-full max-w-[1280px] shrink-0 items-center justify-center px-5 py-16 md:px-12">
        <p className="text-[var(--color-content-default-secondary,#a3a3a3)]">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex w-full max-w-[640px] shrink-0 flex-col gap-4 px-5 py-8 md:px-12">
        <Alert
          type="banner"
          status="danger"
          title={t("errors.loadFailed")}
          description={error ?? t("errors.notFound")}
          className="w-full"
        />
      </div>
    );
  }

  if (showDesktopLayout) {
    return (
      <div className="w-full max-w-[1280px] shrink-0 px-5 md:px-12">
        <div className="flex w-full flex-col gap-4 min-w-0 sm:grid sm:grid-cols-2 sm:gap-[var(--measures-spacing-1200,48px)]">
          <div className="min-w-0 flex flex-col justify-center">
            <HeaderLockup
              title={t("intro.title")}
              description={t("intro.description")}
              justification="left"
              size="L"
            />
          </div>
          <div className="min-w-0 w-full flex flex-col items-stretch">
            <TemplateReviewCard
              template={template}
              ruleCardClassName="rounded-[24px] !max-w-full !w-full min-w-0"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-5 min-w-0">
      <div className="flex flex-col gap-4 w-full max-w-[639px]">
        <HeaderLockup
          title={t("intro.title")}
          description={t("intro.description")}
          justification="left"
          size="M"
        />
        <TemplateReviewCard
          template={template}
          ruleCardClassName="w-full rounded-[12px] p-4"
        />
      </div>
    </div>
  );
}
