"use client";

import { use, useEffect, useState } from "react";
import { TemplateReviewCard } from "../../../components/cards/TemplateReviewCard";
import { useTranslation } from "../../../contexts/MessagesContext";
import {
  fetchTemplateBySlug,
  type RuleTemplateDto,
} from "../../../../lib/create/fetchTemplates";
import messages from "../../../../messages/en/index";
import Alert from "../../../components/modals/Alert";
import {
  CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS,
  CreateFlowLockupCardStepShell,
} from "../../components/CreateFlowLockupCardStepShell";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";

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

  if (loading) {
    return (
      <CreateFlowStepShell variant="wideGrid" contentTopBelowMd="space-800">
        <div className="flex w-full shrink-0 items-center justify-start pb-16">
          <p className="text-[var(--color-content-default-secondary,#a3a3a3)]">
            {t("loading")}
          </p>
        </div>
      </CreateFlowStepShell>
    );
  }

  if (error || !template) {
    return (
      <CreateFlowStepShell variant="wideGrid" contentTopBelowMd="space-800">
        <div className="flex w-full max-w-[640px] shrink-0 flex-col gap-4 pb-8">
          <Alert
            type="banner"
            status="danger"
            title={t("errors.loadFailed")}
            description={error ?? t("errors.notFound")}
            className="w-full"
          />
        </div>
      </CreateFlowStepShell>
    );
  }

  return (
    <CreateFlowLockupCardStepShell
      lockupTitle={t("intro.title")}
      lockupDescription={t("intro.description")}
    >
      <TemplateReviewCard
        template={template}
        ruleCardClassName={CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS}
      />
    </CreateFlowLockupCardStepShell>
  );
}
