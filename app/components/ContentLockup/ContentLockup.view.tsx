"use client";

import { memo } from "react";
import Button from "../Button";
import { getAssetPath } from "../../../lib/assetUtils";
import type { ContentLockupViewProps } from "./ContentLockup.types";

function ContentLockupView({
  title,
  subtitle,
  description,
  ctaText,
  buttonClassName,
  variant,
  linkText,
  linkHref,
  alignment,
  titleId,
  styles,
}: ContentLockupViewProps) {
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
            {title ? (
              <h1 id={titleId} className={styles.title}>
                {title}
              </h1>
            ) : null}
          </div>
          {subtitle ? <h2 className={styles.subtitle}>{subtitle}</h2> : null}
        </div>
      ) : (
        /* Full structure for other variants */
        <div className={styles.textContainer}>
          {/* Title and subtitle group */}
          <div className={styles.titleGroup}>
            {/* Title container */}
            <div className={styles.titleContainer}>
              {title ? (
                <h1 id={titleId} className={styles.title}>
                  {title}
                </h1>
              ) : null}
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
            {subtitle ? <h2 className={styles.subtitle}>{subtitle}</h2> : null}
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
}

ContentLockupView.displayName = "ContentLockupView";

export default memo(ContentLockupView);
