"use client";

import React from "react";
import ContentLockup from "./ContentLockup";
import Button from "./Button";

const AskOrganizer = ({
  title,
  subtitle,
  description,
  buttonText = "Ask an organizer",
  buttonHref = "#",
  className = "",
  variant = "centered", // centered, left-aligned, compact
  onContactClick, // Analytics callback
}) => {
  // Analytics tracking for contact button clicks
  const handleContactClick = (event) => {
    // Track contact button interaction
    if (onContactClick) {
      onContactClick({
        event: "contact_button_click",
        component: "AskOrganizer",
        variant,
        buttonText,
        buttonHref,
        timestamp: new Date().toISOString(),
      });
    }

    // Additional analytics tracking (can be expanded)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "contact_button_click", {
        event_category: "engagement",
        event_label: "ask_organizer",
        value: 1,
      });
    }
  };

  // Variant-specific styling
  const variantStyles = {
    centered: {
      container: "text-center",
      buttonContainer: "flex justify-center",
    },
    "left-aligned": {
      container: "text-left",
      buttonContainer: "flex justify-start",
    },
    compact: {
      container: "text-center",
      buttonContainer: "flex justify-center",
    },
    inverse: {
      container: "text-center",
      buttonContainer: "flex justify-center",
    },
  };

  const styles = variantStyles[variant] || variantStyles.centered;

  // Section padding based on variant
  const sectionPadding =
    variant === "compact"
      ? "py-[var(--spacing-scale-016)] px-[var(--spacing-scale-016)] md:py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-032)]"
      : "py-[var(--spacing-scale-032)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-096)] md:px-[var(--spacing-scale-064)]";

  // Gap between content and button based on variant
  const contentGap =
    variant === "compact"
      ? "gap-[var(--spacing-scale-020)]"
      : "gap-[var(--spacing-scale-040)]";

  return (
    <section
      className={`${sectionPadding} ${className}`}
      aria-labelledby="ask-organizer-headline"
      role="region"
      tabIndex={-1}
    >
      <div className={`flex flex-col ${contentGap} ${styles.container}`}>
        {/* Content Lockup */}
        <ContentLockup
          title={title}
          subtitle={subtitle}
          description={description}
          variant={variant === "inverse" ? "ask-inverse" : "ask"}
          alignment={variant === "left-aligned" ? "left" : "center"}
        />

        {/* Button */}
        <div className={styles.buttonContainer}>
          <Button
            href={buttonHref}
            size="large"
            variant={variant === "inverse" ? "primary" : "default"}
            className="xl:!px-[var(--spacing-scale-020)] xl:!py-[var(--spacing-scale-012)] xl:!text-[24px] xl:!leading-[28px]"
            onClick={handleContactClick}
            aria-label={`${buttonText} - Contact an organizer for help`}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AskOrganizer;
