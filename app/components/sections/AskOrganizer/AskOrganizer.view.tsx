"use client";

import ContentLockup from "../../type/ContentLockup";
import Button from "../../buttons/Button";
import type { AskOrganizerViewProps } from "./AskOrganizer.types";

function AskOrganizerView({
  title,
  subtitle,
  description,
  buttonText,
  ctaAriaLabel,
  className,
  sectionPadding,
  contentGap,
  buttonContainerClass,
  variant,
  labelledBy,
  onContactClick,
}: AskOrganizerViewProps) {
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
      aria-label={labelledBy ? undefined : ctaAriaLabel}
      tabIndex={-1}
      data-figma-node={isUseCaseDetail ? "22015-42624" : "18116-15960"}
    >
      <div
        className={`mx-auto flex w-full min-w-0 max-w-[1280px] flex-col md:min-w-[358px] ${contentGap} ${isUseCaseDetail ? "items-center" : ""}`}
      >
        <ContentLockup
          title={title}
          subtitle={subtitle}
          description={description}
          variant={lockupVariant}
          alignment={lockupAlignment}
          titleId={labelledBy}
        />

        <div
          className={`${buttonContainerClass} flex-wrap gap-y-[var(--spacing-scale-016)]`}
        >
          <Button
            size="small"
            buttonType="filled"
            palette={buttonPalette}
            className="!px-[var(--spacing-scale-010)] md:!px-[var(--spacing-scale-016)] md:!py-[var(--spacing-scale-012)] md:!text-[16px] md:!leading-[20px]"
            onClick={onContactClick}
            ariaLabel={ctaAriaLabel}
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
