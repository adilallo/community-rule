"use client";

import { memo } from "react";
import { RuleView } from "./Rule.view";
import type { RuleProps } from "./Rule.types";

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

/**
 * Figma: "Card / Rule" — e.g. profile `22143:900771` when **Has bottom link** is on
 * (`hasBottomLinks` + `bottomLinks` / optional `bottomStatusLabel`).
 */
const RuleContainer = memo<RuleProps>(
  ({
    title,
    description,
    icon,
    backgroundColor = "bg-[var(--color-community-teal-100)]",
    className = "",
    onClick,
    expanded = false,
    size: sizeProp,
    categories,
    logoUrl,
    logoAlt,
    communityInitials,
    hideCategoryAddButton = false,
    hasBottomLinks = false,
    bottomStatusLabel,
    bottomLinks,
  }) => {
    const size = sizeProp ?? "L";

    const handleClick = () => {
      if (hasBottomLinks) return;
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
      if (hasBottomLinks) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <RuleView
        title={title}
        description={description}
        icon={icon}
        backgroundColor={backgroundColor}
        className={className}
        onClick={hasBottomLinks ? undefined : handleClick}
        onKeyDown={hasBottomLinks ? undefined : handleKeyDown}
        expanded={expanded}
        size={size}
        categories={categories}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        communityInitials={communityInitials}
        hideCategoryAddButton={hideCategoryAddButton}
        hasBottomLinks={hasBottomLinks}
        bottomStatusLabel={bottomStatusLabel}
        bottomLinks={bottomLinks}
      />
    );
  },
);

RuleContainer.displayName = "Rule";

export default RuleContainer;
