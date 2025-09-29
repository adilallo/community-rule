"use client";

import Button from "./Button";
import { getAssetPath } from "../../lib/assetUtils";

const ContentLockup = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  buttonClassName = "",
  variant = "hero",
  linkText,
  linkHref,
  alignment = "center", // center, left
}) => {
  // Variant-specific styling
  const variantStyles = {
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
      container: "flex flex-col gap-[var(--spacing-scale-012)] relative z-10",
      textContainer: "flex flex-col gap-[var(--spacing-scale-012)]",
      titleGroup: "flex flex-col gap-[var(--spacing-scale-012)]",
      titleContainer: "flex gap-[var(--spacing-scale-008)] items-center",
      title:
        "font-bricolage-grotesque font-medium text-[28px] leading-[36px] tracking-[0] text-[var(--color-content-default-primary)]",
      subtitle:
        "font-space-grotesk font-normal text-[16px] leading-[24px] tracking-[0] text-[var(--color-content-default-primary)]",
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
    <div className={styles.container}>
      {variant === "ask" || variant === "ask-inverse" ? (
        /* Simplified structure for ask variant */
        <div
          className={`${styles.titleGroup} ${
            alignment === "left" ? "text-left" : "text-center"
          }`}
        >
          <div
            className={`${styles.titleContainer} ${
              alignment === "left" ? "justify-start" : "justify-center"
            }`}
          >
            <h1 className={styles.title}>{title}</h1>
          </div>
          <h2 className={styles.subtitle}>{subtitle}</h2>
        </div>
      ) : (
        /* Full structure for other variants */
        <div className={styles.textContainer}>
          {/* Title and subtitle group */}
          <div className={styles.titleGroup}>
            {/* Title container */}
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{title}</h1>
              {variant === "hero" && (
                <img
                  src={getAssetPath("assets/Shapes_1.svg")}
                  alt=""
                  className={styles.shape}
                  role="presentation"
                />
              )}
            </div>

            {/* Subtitle */}
            <h2 className={styles.subtitle}>{subtitle}</h2>
          </div>

          {/* Description */}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      {/* Link for feature variant */}
      {variant === "feature" && linkText && (
        <a
          href={linkHref || "#"}
          className="font-inter font-medium text-[16px] leading-[20px] underline text-[var(--color-content-default-primary)] hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-surface-default-brand-royal)] focus:ring-offset-2 focus:ring-offset-[#171717] rounded-sm px-1 py-0.5"
        >
          {linkText}
        </a>
      )}

      {/* CTA Button */}
      {ctaText && (
        <div className="flex justify-start">
          {/* Small button for xsm and sm breakpoints */}
          <div className="block md:hidden">
            <Button variant="primary" size="small">
              {ctaText}
            </Button>
          </div>
          {/* Large button for md and lg breakpoints */}
          <div className="hidden md:block xl:hidden">
            <Button variant="primary" size="large" className={buttonClassName}>
              {ctaText}
            </Button>
          </div>
          {/* XLarge button for xl breakpoint */}
          <div className="hidden xl:block">
            <Button variant="primary" size="xlarge">
              {ctaText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLockup;
