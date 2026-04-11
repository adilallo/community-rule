"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { logger } from "../../../../lib/logger";
import { RuleStackView } from "./RuleStack.view";
import type { RuleStackProps } from "./RuleStack.types";

declare global {
  interface Window {
    gtag?: (
      _command: string,
      _eventName: string,
      _params?: Record<string, unknown>,
    ) => void;
    analytics?: {
      track: (_eventName: string, _params?: Record<string, unknown>) => void;
    };
  }
}

const RuleStackContainer = memo<RuleStackProps>(({ className = "" }) => {
  const router = useRouter();

  const handleTemplateClick = (slug: string) => {
    // Basic analytics tracking
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "template_click", {
          template_slug: slug,
        });
      }
      if (window.analytics) {
        window.analytics.track("Template Clicked", {
          templateSlug: slug,
        });
      }
    }
    logger.debug(`${slug} template clicked`);
    router.push(`/create/review-template/${encodeURIComponent(slug)}`);
  };

  return (
    <RuleStackView
      className={className}
      onTemplateClick={handleTemplateClick}
    />
  );
});

RuleStackContainer.displayName = "RuleStack";

export default RuleStackContainer;
