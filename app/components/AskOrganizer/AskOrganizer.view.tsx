"use client";

import { useTranslation } from "../../contexts/MessagesContext";
import ContentLockup from "../ContentLockup";
import Button from "../Button";
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
        <div className={buttonContainerClass}>
          <Button
            href={buttonHref}
            size="large"
            variant={variant === "inverse" ? "primary" : "default"}
            className="xl:!px-[var(--spacing-scale-020)] xl:!py-[var(--spacing-scale-012)] xl:!text-[24px] xl:!leading-[28px]"
            onClick={onContactClick}
            ariaLabel={ariaLabel}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default AskOrganizerView;
