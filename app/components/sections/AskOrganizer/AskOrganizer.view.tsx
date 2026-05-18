"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import ContentLockup from "../../type/ContentLockup";
import Button from "../../buttons/Button";
import type { AskOrganizerViewProps } from "./AskOrganizer.types";

function AskOrganizerView({
  title,
  subtitle,
  description,
  buttonText,
  buttonHref,
  className,
  sectionPadding,
  contentGap,
  buttonContainerClass,
  variant,
  labelledBy,
  onContactClick,
}: AskOrganizerViewProps) {
  const t = useTranslation();
  const ariaLabel = t("askOrganizer.ariaLabel");

  return (
    <section
      className={`${sectionPadding} ${className}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      tabIndex={-1}
      data-figma-node="18116-15960"
    >
      <div className={`flex flex-col ${contentGap}`}>
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
        <div
          className={`${buttonContainerClass} flex-wrap gap-y-[var(--spacing-scale-016)]`}
        >
          <Button
            {...(buttonHref ? { href: buttonHref } : {})}
            size="large"
            buttonType="filled"
            palette={variant === "inverse" ? "inverse" : "default"}
            className="!px-[var(--spacing-scale-016)] !py-[var(--spacing-scale-012)]"
            onClick={onContactClick}
            ariaLabel={ariaLabel}
            data-testid="ask-organizer-cta"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default AskOrganizerView;
