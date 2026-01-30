"use client";

import { memo } from "react";
import { RuleCardView } from "./RuleCard.view";
import type { RuleCardProps } from "./RuleCard.types";

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

const RuleCardContainer = memo<RuleCardProps>(
  ({
    title,
    description,
    icon,
    backgroundColor = "bg-[var(--color-community-teal-100)]",
    className = "",
    onClick,
  }) => {
    const handleClick = () => {
      // Basic analytics event tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "template_selected", {
          template_name: title,
          template_type: "governance_pattern",
        });
      }

      // Custom analytics event for other tracking systems
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("Template Selected", {
          templateName: title,
          templateType: "governance_pattern",
        });
      }

      if (onClick) onClick();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <RuleCardView
        title={title}
        description={description}
        icon={icon}
        backgroundColor={backgroundColor}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

RuleCardContainer.displayName = "RuleCard";

export default RuleCardContainer;
