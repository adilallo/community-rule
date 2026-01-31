"use client";

import { memo } from "react";
import { useTranslation } from "../../contexts/MessagesContext";
import { useAnalytics } from "../../hooks";
import AskOrganizerView from "./AskOrganizer.view";
import type {
  AskOrganizerProps,
  AskOrganizerVariant,
} from "./AskOrganizer.types";

const VARIANT_STYLES: Record<
  AskOrganizerVariant,
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

const AskOrganizerContainer = memo<AskOrganizerProps>(
  ({
    title,
    subtitle,
    description,
    buttonText,
    buttonHref,
    className = "",
    variant = "centered",
    onContactClick,
  }) => {
    const t = useTranslation();
    const defaultButtonText = buttonText ?? t("askOrganizer.buttonText");
    const defaultButtonHref = buttonHref ?? t("askOrganizer.buttonHref");
    const { trackEvent, trackCustomEvent } = useAnalytics();

    const resolvedVariant: AskOrganizerVariant = variant ?? "centered";
    const styles = VARIANT_STYLES[resolvedVariant] ?? VARIANT_STYLES.centered;

    const sectionPadding =
      resolvedVariant === "compact"
        ? "py-[var(--spacing-scale-016)] px-[var(--spacing-scale-016)] md:py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-032)]"
        : "py-[var(--spacing-scale-032)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-096)] md:px-[var(--spacing-scale-064)]";

    const contentGap =
      resolvedVariant === "compact"
        ? "gap-[var(--spacing-scale-020)]"
        : "gap-[var(--spacing-scale-040)]";

    const labelledBy = title ? "ask-organizer-headline" : undefined;

    const handleContactClick = (
      event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      trackEvent({
        event: "contact_button_click",
        category: "engagement",
        label: "ask_organizer",
        component: "AskOrganizer",
        variant: resolvedVariant,
      });

      trackCustomEvent(
        "contact_button_click",
        {
          component: "AskOrganizer",
          variant: resolvedVariant,
          buttonText: defaultButtonText,
          buttonHref: defaultButtonHref,
        },
        onContactClick as
          | ((_data: Record<string, unknown>) => void)
          | undefined,
      );

      // Preserve existing button behavior (no preventDefault here)
      // while still tracking analytics.
      return event;
    };

    return (
      <AskOrganizerView
        title={title}
        subtitle={subtitle}
        description={description}
        buttonText={defaultButtonText}
        buttonHref={defaultButtonHref}
        className={className}
        sectionPadding={sectionPadding}
        contentGap={`${contentGap} ${styles.container}`}
        buttonContainerClass={styles.buttonContainer}
        variant={resolvedVariant}
        labelledBy={labelledBy}
        onContactClick={handleContactClick}
      />
    );
  },
);

AskOrganizerContainer.displayName = "AskOrganizer";

export default AskOrganizerContainer;
