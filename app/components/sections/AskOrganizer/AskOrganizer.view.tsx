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
  const isUseCaseDetail = variant === "use-case-detail";
  const lockupVariant =
    variant === "inverse" || isUseCaseDetail ? "ask-inverse" : "ask";
  const lockupAlignment =
    variant === "left-aligned" ? "left" : "center";
  const buttonPalette =
    variant === "inverse" || isUseCaseDetail ? "inverse" : "default";

  return (
    <section
      className={`${sectionPadding} ${className}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      tabIndex={-1}
      data-figma-node={isUseCaseDetail ? "22015-42624" : "18116-15960"}
    >
      <div
        className={`mx-auto flex w-full min-w-[358px] max-w-[1280px] flex-col ${contentGap} ${isUseCaseDetail ? "items-center" : ""}`}
      >
        {/* Content Lockup */}
        <ContentLockup
          title={title}
          subtitle={subtitle}
          description={description}
          variant={lockupVariant}
          alignment={lockupAlignment}
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
            palette={buttonPalette}
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
