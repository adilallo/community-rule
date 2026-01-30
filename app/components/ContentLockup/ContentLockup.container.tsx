"use client";

import { memo } from "react";
import ContentLockupView from "./ContentLockup.view";
import type { ContentLockupProps, VariantStyle } from "./ContentLockup.types";

const ContentLockupContainer = memo<ContentLockupProps>(
  ({
    title,
    subtitle,
    description,
    ctaText,
    buttonClassName = "",
    variant = "hero",
    linkText,
    linkHref,
    alignment = "center",
    titleId,
  }) => {
    // Variant-specific styling
    const variantStyles: Record<string, VariantStyle> = {
      hero: {
        container:
          "flex flex-col gap-[var(--spacing-scale-006)] sm:gap-[var(--spacing-scale-012)] md:gap-[var(--spacing-scale-020)] lg:gap-[var(--spacing-scale-020)] relative z-10",
        textContainer:
          "flex flex-col md:gap-[var(--spacing-scale-004)] lg:gap-[var(--spacing-scale-008)] xl:gap-[var(--spacing-scale-020)]",
        titleGroup: "flex flex-col xl:gap-0",
        titleContainer:
          "flex gap-[var(--spacing-scale-008)] xl:gap-[var(--spacing-scale-010)] items-center",
        title:
          "font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] xl:text-[96px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]",
        subtitle:
          "font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] xl:text-[96px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]",
        description:
          "font-inter font-normal text-[18px] leading-[130%] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] text-[var(--color-content-inverse-primary)]",
        shape:
          "w-[27.2px] h-[27.2px] md:w-[34px] md:h-[34px] lg:w-[50px] lg:h-[50px]",
      },
      feature: {
        container: "flex flex-col gap-[var(--spacing-scale-012)] relative z-10",
        textContainer: "flex flex-col gap-[var(--spacing-scale-012)]",
        titleGroup: "flex flex-col gap-[var(--spacing-scale-012)]",
        titleContainer: "flex gap-[var(--spacing-scale-008)] items-center",
        title:
          "font-bricolage-grotesque font-medium text-[32px] leading-[130%] tracking-[0] text-[var(--color-content-default-primary)]",
        subtitle:
          "font-space-grotesk font-normal text-[20px] leading-[130%] tracking-[0] text-[var(--color-content-default-primary)]",
        description:
          "font-inter font-normal text-[16px] leading-[140%] lg:text-[18px] lg:leading-[150%] xl:text-[20px] xl:leading-[160%] text-[var(--color-content-secondary)]",
        shape:
          "w-[20px] h-[20px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px]",
      },
      learn: {
        container:
          "flex flex-col gap-[var(--spacing-scale-012)] relative z-10 pt-[var(--spacing-scale-016)] pb-[var(--spacing-scale-016)] px-[var(--spacing-scale-020)] sm:pt-[var(--spacing-scale-040)] sm:pb-0 md:pt-[var(--spacing-scale-056)] md:px-[var(--spacing-scale-032)] lg:pt-[var(--spacing-scale-056)] lg:px-[var(--spacing-scale-064)]",
        textContainer:
          "flex flex-col gap-[var(--spacing-scale-012)] md:gap-[var(--spacing-scale-016)]",
        titleGroup:
          "flex flex-col gap-[var(--spacing-scale-012)] md:gap-[var(--spacing-scale-016)] lg:gap-[var(--spacing-scale-008)]",
        titleContainer: "flex gap-[var(--spacing-scale-008)] items-center",
        title:
          "font-bricolage-grotesque font-medium text-[28px] leading-[36px] tracking-[0] md:text-[44px] md:leading-[110%] lg:text-[52px] text-[var(--color-content-default-primary)]",
        subtitle:
          "font-space-grotesk font-normal text-[16px] leading-[24px] tracking-[0] lg:text-[24px] lg:leading-[28px] text-[var(--color-content-default-primary)]",
        description:
          "font-inter font-normal text-[16px] leading-[140%] lg:text-[18px] lg:leading-[150%] xl:text-[20px] xl:leading-[160%] text-[var(--color-content-secondary)]",
        shape:
          "w-[20px] h-[20px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px]",
      },
      ask: {
        container: "flex flex-col gap-[var(--spacing-scale-008)] relative z-10",
        textContainer: "flex flex-col gap-[var(--spacing-scale-008)]",
        titleGroup: "flex flex-col gap-[var(--spacing-scale-008)]",
        titleContainer: "flex gap-[var(--spacing-scale-008)] items-center",
        title:
          "font-bricolage-grotesque font-medium text-[36px] leading-[110%] tracking-[0] md:text-[44px] md:leading-[110%] xl:text-[52px] xl:leading-[110%] text-[var(--color-content-default-brand-primary)]",
        subtitle:
          "font-inter font-normal text-[18px] leading-[130%] tracking-[0] md:text-[24px] md:leading-[32px] text-[var(--color-content-default-primary)]",
        shape:
          "w-[16px] h-[16px] md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px]",
      },
      "ask-inverse": {
        container: "flex flex-col gap-[var(--spacing-scale-008)] relative z-10",
        textContainer: "flex flex-col gap-[var(--spacing-scale-008)]",
        titleGroup: "flex flex-col gap-[var(--spacing-scale-008)]",
        titleContainer: "flex gap-[var(--spacing-scale-008)] items-center",
        title:
          "font-bricolage-grotesque font-medium text-[36px] leading-[110%] tracking-[0] md:text-[44px] md:leading-[110%] xl:text-[52px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]",
        subtitle:
          "font-inter font-normal text-[18px] leading-[130%] tracking-[0] md:text-[24px] md:leading-[32px] text-[var(--color-content-inverse-primary)]",
        shape:
          "w-[16px] h-[16px] md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px]",
      },
    };

    const styles = variantStyles[variant] || variantStyles.hero;

    return (
      <ContentLockupView
        title={title}
        subtitle={subtitle}
        description={description}
        ctaText={ctaText}
        buttonClassName={buttonClassName}
        variant={variant}
        linkText={linkText}
        linkHref={linkHref}
        alignment={alignment}
        titleId={titleId}
        styles={styles}
      />
    );
  },
);

ContentLockupContainer.displayName = "ContentLockup";

export default ContentLockupContainer;
