"use client";

import { memo } from "react";
import ContentLockup from "./ContentLockup";
import Button from "./Button";
import { useAnalytics } from "../hooks";

interface AskOrganizerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  variant?: "centered" | "left-aligned" | "compact" | "inverse";
  onContactClick?: (_data: {
    event: string;
    component: string;
    variant: string;
    buttonText: string;
    buttonHref: string;
    timestamp: string;
  }) => void;
}

const AskOrganizer = memo<AskOrganizerProps>(
  ({
    title,
    subtitle,
    description,
    buttonText = "Ask an organizer",
    buttonHref = "#",
    className = "",
    variant = "centered",
    onContactClick,
  }) => {
    const { trackEvent, trackCustomEvent } = useAnalytics();

    // Analytics tracking for contact button clicks
    const handleContactClick = (
      _event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      // Track with standard analytics
      trackEvent({
        event: "contact_button_click",
        category: "engagement",
        label: "ask_organizer",
        component: "AskOrganizer",
        variant,
      });

      // Also call custom callback if provided
      trackCustomEvent(
        "contact_button_click",
        {
          component: "AskOrganizer",
          variant,
          buttonText,
          buttonHref,
        },
        onContactClick,
      );
    };

    // Variant-specific styling
    const variantStyles: Record<
      string,
      { container: string; buttonContainer: string }
    > = {
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

    const labelledBy = title ? "ask-organizer-headline" : undefined;

    return (
      <section
        className={`${sectionPadding} ${className}`}
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : "Ask an organizer"}
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
            titleId={labelledBy}
          />

          {/* Button */}
          <div className={styles.buttonContainer}>
            <Button
              href={buttonHref}
              size="large"
              variant={variant === "inverse" ? "primary" : "default"}
              className="xl:!px-[var(--spacing-scale-020)] xl:!py-[var(--spacing-scale-012)] xl:!text-[24px] xl:!leading-[28px]"
              onClick={handleContactClick}
              ariaLabel={`${buttonText} - Contact an organizer for help`}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </section>
    );
  },
);

AskOrganizer.displayName = "AskOrganizer";

export default AskOrganizer;
