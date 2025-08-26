"use client";

import React, { useState } from "react";
import Image from "next/image";
import QuoteDecor from "./QuoteDecor";

const QuoteBlock = ({
  variant = "standard",
  className = "",
  quote = "The rules of decision-making must be open and available to everyone, and this can happen only if they are formalized.",
  author = "Jo Freeman",
  source = "The Tyranny of Structurelessness",
  avatarSrc = "assets/Quote_Avatar.svg",
  id,
  fallbackAvatarSrc = "assets/Quote_Avatar.svg", // Fallback avatar
  onError, // Error callback
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Variant configurations
  const variants = {
    compact: {
      container: "py-[var(--spacing-scale-032)] px-[var(--spacing-scale-016)]",
      card: "py-[var(--spacing-scale-032)] px-[var(--spacing-scale-016)] md:py-[var(--spacing-scale-040)] md:px-[var(--spacing-scale-024)] rounded-[var(--radius-measures-radius-small)]",
      gap: "gap-[var(--spacing-scale-016)] md:gap-[var(--spacing-scale-024)]",
      avatarGap: "gap-[var(--spacing-scale-012)]",
      avatar: "w-[48px] h-[48px] md:w-[64px] md:h-[64px]",
      quote: "text-[16px] leading-[120%] md:text-[20px] md:leading-[110%]",
      author: "text-[10px] leading-[120%] md:text-[12px]",
      source: "text-[10px] leading-[120%] md:text-[12px]",
      showDecor: false,
    },
    standard: {
      container:
        "md:py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-016)] lg:p-[var(--spacing-scale-064)]",
      card: "py-[var(--spacing-scale-064)] px-[var(--spacing-scale-020)] md:py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-048)] md:rounded-[var(--radius-measures-radius-medium)] lg:py-[var(--spacing-scale-064)] lg:pl-[120px] lg:pr-[320px]",
      gap: "gap-[var(--spacing-scale-024)] md:gap-[var(--spacing-scale-048)] lg:gap-[var(--spacing-scale-064)] xl:gap-[105px]",
      avatarGap:
        "gap-[var(--spacing-scale-020)] lg:gap-[var(--spacing-scale-018)] xl:gap-[var(--spacing-scale-032)]",
      avatar:
        "md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] xl:w-[200px] xl:h-[200px]",
      quote:
        "text-[18px] leading-[120%] md:text-[36px] md:leading-[110%] md:tracking-[0px] lg:text-[52px] xl:text-[64px]",
      author:
        "text-[12px] leading-[120%] md:text-[18px] md:leading-[120%] md:tracking-[0.24px] lg:text-[24px] xl:text-[32px]",
      source:
        "text-[12px] leading-[120%] md:text-[18px] md:leading-[120%] md:tracking-[0.24px] lg:text-[24px] xl:text-[32px]",
      showDecor: true,
    },
    extended: {
      container:
        "py-[var(--spacing-scale-048)] px-[var(--spacing-scale-024)] md:py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-080)] lg:px-[var(--spacing-scale-048)]",
      card: "py-[var(--spacing-scale-080)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-096)] md:px-[var(--spacing-scale-064)] md:rounded-[var(--radius-measures-radius-large)] lg:py-[var(--spacing-scale-112)] lg:pl-[160px] lg:pr-[400px]",
      gap: "gap-[var(--spacing-scale-032)] md:gap-[var(--spacing-scale-064)] lg:gap-[var(--spacing-scale-080)] xl:gap-[140px]",
      avatarGap:
        "gap-[var(--spacing-scale-032)] lg:gap-[var(--spacing-scale-040)] xl:gap-[var(--spacing-scale-048)]",
      avatar:
        "w-[80px] h-[80px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] xl:w-[240px] xl:h-[240px]",
      quote:
        "text-[20px] leading-[120%] md:text-[40px] md:leading-[110%] md:tracking-[0px] lg:text-[60px] xl:text-[72px]",
      author:
        "text-[14px] leading-[120%] md:text-[20px] md:leading-[120%] md:tracking-[0.24px] lg:text-[28px] xl:text-[36px]",
      source:
        "text-[14px] leading-[120%] md:text-[20px] md:leading-[120%] md:tracking-[0.24px] lg:text-[28px] xl:text-[36px]",
      showDecor: true,
    },
  };

  const config = variants[variant] || variants.standard;

  // Use provided ID or generate a stable one based on content
  const baseId = id || `quote-${author.toLowerCase().replace(/\s+/g, "-")}`;
  const quoteId = `${baseId}-content`;
  const authorId = `${baseId}-author`;

  // Error handling functions
  const handleImageError = (error) => {
    console.warn(
      `QuoteBlock: Failed to load avatar image for ${author}:`,
      error
    );
    setImageError(true);
    setImageLoading(false);

    // Call error callback if provided
    if (onError) {
      onError({
        type: "image_load_error",
        message: `Failed to load avatar for ${author}`,
        author,
        avatarSrc,
        error,
      });
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Validate required props
  if (!quote || !author) {
    console.error("QuoteBlock: Missing required props (quote or author)");
    if (onError) {
      onError({
        type: "missing_props",
        message: "QuoteBlock requires quote and author props",
        quote: !!quote,
        author: !!author,
      });
    }
    return null; // Don't render if missing required props
  }

  // Determine which avatar to use
  const currentAvatarSrc = imageError ? fallbackAvatarSrc : avatarSrc;

  return (
    <section
      className={`${config.container} ${className}`}
      aria-labelledby={quoteId}
      role="region"
    >
      <div
        className={`${config.card} bg-[var(--color-surface-default-brand-darker-accent)] relative overflow-hidden`}
      >
        {/* DECORATIONS (behind content) */}
        {config.showDecor && (
          <QuoteDecor
            className="pointer-events-none absolute z-0
                        left-0 top-0
                        w-full h-full"
            aria-hidden="true"
          />
        )}

        <div className={`flex flex-col ${config.gap} relative z-10`}>
          <div className={`flex flex-col ${config.avatarGap}`}>
            {/* Avatar with error handling */}
            <div className="relative">
              <Image
                src={currentAvatarSrc}
                alt={`Portrait of ${author}`}
                width={64}
                height={64}
                className={`filter sepia ${
                  config.avatar
                } transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />

              {/* Loading state */}
              {imageLoading && (
                <div
                  className={`absolute inset-0 bg-gray-200 animate-pulse rounded-full ${config.avatar}`}
                />
              )}

              {/* Error state - show initials */}
              {imageError && !imageLoading && (
                <div
                  className={`flex items-center justify-center bg-gray-300 rounded-full ${config.avatar} text-gray-600 font-bold`}
                >
                  <span className="text-sm md:text-base lg:text-lg xl:text-xl">
                    {author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <blockquote
              id={quoteId}
              aria-labelledby={authorId}
              className="relative"
            >
              <p
                className={`font-bricolage-grotesque font-normal ${config.quote} text-[var(--color-content-inverse-primary)] -indent-[0.5em] relative before:content-['\\201C'] after:content-['\\201D'] before:mr-[0.05em] after:ml-[0.05em] before:[font-family:var(--font-bricolage-grotesque)] after:[font-family:var(--font-bricolage-grotesque)]`}
              >
                {quote}
              </p>
            </blockquote>
          </div>
          <footer className="flex flex-col gap-[var(--spacing-scale-008)] md:gap-[var(--spacing-scale-012)] xl:gap-[var(--spacing-scale-020)]">
            <cite
              id={authorId}
              className={`font-inter font-normal ${config.author} text-[var(--color-content-inverse-primary)] uppercase not-italic`}
            >
              {author}
            </cite>
            {source && (
              <p
                className={`font-inter font-normal ${config.source} text-[var(--color-content-inverse-primary)] uppercase -indent-[0.5em] relative before:content-['\\201C'] after:content-['\\201D'] before:mr-[0.05em] after:ml-[0.05em] before:[font-family:var(--font-inter)] after:[font-family:var(--font-inter)]`}
              >
                {source}
              </p>
            )}
          </footer>
        </div>
      </div>
    </section>
  );
};

export default QuoteBlock;
