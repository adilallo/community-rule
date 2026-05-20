"use client";

import { memo, useCallback, useState } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import { useAnalytics } from "../../../hooks";
import AskOrganizerInquiryModal from "../../modals/AskOrganizerInquiry";
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
  "use-case-detail": {
    container: "w-full text-center",
    buttonContainer: "flex w-full justify-center",
  },
};

/** Figma **Section/AskOrganizer** — baseline default [17487:12288](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17487-12288&m=dev), inverse [19189:8140](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=19189-8140&m=dev); md+ [16306:14995](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=16306-14995&m=dev). Use-case detail instance: [22015:42624](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22015-42624&m=dev). */
const AskOrganizerContainer = memo<AskOrganizerProps>(
  ({
    title,
    subtitle,
    description,
    buttonText,
    buttonHref,
    className = "",
    variant: variantProp = "centered",
    onContactClick,
  }) => {
    const variant = variantProp;
    const t = useTranslation();
    const defaultButtonText = buttonText ?? t("askOrganizer.buttonText");
    const analyticsHref = buttonHref ?? "modal";
    const { trackEvent, trackCustomEvent } = useAnalytics();
    const [inquiryOpen, setInquiryOpen] = useState(false);

    const resolvedVariant: AskOrganizerVariant = variant ?? "centered";
    const styles = VARIANT_STYLES[resolvedVariant] ?? VARIANT_STYLES.centered;

    const sectionPadding =
      resolvedVariant === "compact"
        ? "py-[var(--spacing-scale-016)] px-[var(--spacing-scale-016)] md:py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-032)]"
        : resolvedVariant === "use-case-detail" || resolvedVariant === "inverse"
          ? "w-full py-[var(--spacing-scale-032)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-096)] md:px-[var(--spacing-scale-064)]"
          : "py-[var(--spacing-scale-040)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-096)] md:px-[var(--spacing-scale-064)]";

    const contentGap =
      resolvedVariant === "compact"
        ? "gap-[var(--spacing-scale-020)]"
        : resolvedVariant === "use-case-detail"
          ? "gap-[var(--spacing-scale-040)]"
          : "gap-[var(--spacing-scale-040)]";

    const labelledBy = title ? "ask-organizer-headline" : undefined;

    const handleContactClick = (
      event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      if (buttonHref) {
        // Legacy link CTA: do not intercept navigation.
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
            buttonHref: analyticsHref,
          },
          onContactClick as
            | ((_data: Record<string, unknown>) => void)
            | undefined,
        );
        return event;
      }

      event.preventDefault();
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
          buttonHref: analyticsHref,
        },
        onContactClick as
          | ((_data: Record<string, unknown>) => void)
          | undefined,
      );

      setInquiryOpen(true);
      return event;
    };

    const closeInquiry = useCallback(() => {
      setInquiryOpen(false);
    }, []);

    return (
      <>
        <AskOrganizerView
          title={title}
          subtitle={subtitle}
          description={description}
          buttonText={defaultButtonText}
          buttonHref={buttonHref}
          className={className}
          sectionPadding={sectionPadding}
          contentGap={`${contentGap} ${styles.container}`}
          buttonContainerClass={styles.buttonContainer}
          variant={resolvedVariant}
          labelledBy={labelledBy}
          onContactClick={handleContactClick}
        />
        <AskOrganizerInquiryModal isOpen={inquiryOpen} onClose={closeInquiry} />
      </>
    );
  },
);

AskOrganizerContainer.displayName = "AskOrganizer";

export default AskOrganizerContainer;
