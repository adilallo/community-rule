"use client";

import { memo } from "react";
import { logger } from "../../../lib/logger";
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
  const handleTemplateClick = (templateName: string) => {
    // Basic analytics tracking
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "template_click", {
          template_name: templateName,
        });
      }
      if (window.analytics) {
        window.analytics.track("Template Clicked", {
          templateName: templateName,
        });
      }
    }
    logger.debug(`${templateName} template clicked`);
  };

  return <RuleStackView className={className} onTemplateClick={handleTemplateClick} />;
});

RuleStackContainer.displayName = "RuleStack";

export default RuleStackContainer;
