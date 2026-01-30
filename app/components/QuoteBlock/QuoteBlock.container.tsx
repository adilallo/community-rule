"use client";

import { memo, useState, useId } from "react";
import { logger } from "../../lib/logger";
import QuoteBlockView from "./QuoteBlock.view";
import type { QuoteBlockProps } from "./QuoteBlock.types";

const QuoteBlockContainer = memo<QuoteBlockProps>(
  ({
    quote,
    author,
    authorRole,
    authorImage,
    variant = "default",
    className = "",
  }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const quoteId = useId();

    // Variant configuration
    const variantConfig = {
      default: {
        container:
          "py-[var(--spacing-scale-032)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-064)]",
        quote: "text-[var(--color-content-default-primary)]",
        author: "text-[var(--color-content-default-secondary)]",
        authorRole: "text-[var(--color-content-default-tertiary)]",
      },
      inverse: {
        container:
          "py-[var(--spacing-scale-032)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-064)] bg-[var(--color-surface-inverse-primary)]",
        quote: "text-[var(--color-content-inverse-primary)]",
        author: "text-[var(--color-content-inverse-secondary)]",
        authorRole: "text-[var(--color-content-inverse-tertiary)]",
      },
      compact: {
        container:
          "py-[var(--spacing-scale-016)] px-[var(--spacing-scale-016)] md:py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-032)]",
        quote: "text-[var(--color-content-default-primary)]",
        author: "text-[var(--color-content-default-secondary)]",
        authorRole: "text-[var(--color-content-default-tertiary)]",
      },
    };

    const config = variantConfig[variant];

    const containerClasses = `
      relative
      flex
      flex-col
      gap-[var(--spacing-scale-024)]
      ${config.container}
    `
      .trim()
      .replace(/\s+/g, " ");

    const quoteClasses = `
      text-[18px]
      md:text-[24px]
      leading-[28px]
      md:leading-[36px]
      font-medium
      ${config.quote}
    `
      .trim()
      .replace(/\s+/g, " ");

    const authorClasses = `
      text-[14px]
      md:text-[16px]
      leading-[20px]
      md:leading-[24px]
      font-semibold
      not-italic
      ${config.author}
    `
      .trim()
      .replace(/\s+/g, " ");

    const authorRoleClasses = `
      text-[12px]
      md:text-[14px]
      leading-[16px]
      md:leading-[20px]
      font-normal
      ${config.authorRole}
    `
      .trim()
      .replace(/\s+/g, " ");

    const imageContainerClasses = `
      w-[var(--measures-sizing-048)]
      h-[var(--measures-sizing-048)]
      rounded-full
      overflow-hidden
      shrink-0
    `
      .trim()
      .replace(/\s+/g, " ");

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
      logger.warn("QuoteBlock: Failed to load author image", {
        authorImage,
        author,
      });
    };

    return (
      <QuoteBlockView
        quoteId={quoteId}
        quote={quote}
        author={author}
        authorRole={authorRole}
        authorImage={authorImage}
        variant={variant}
        className={className}
        imageError={imageError}
        imageLoading={imageLoading}
        containerClasses={containerClasses}
        quoteClasses={quoteClasses}
        authorClasses={authorClasses}
        authorRoleClasses={authorRoleClasses}
        imageContainerClasses={imageContainerClasses}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />
    );
  },
);

QuoteBlockContainer.displayName = "QuoteBlock";

export default QuoteBlockContainer;
