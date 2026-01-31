"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslation } from "../../contexts/MessagesContext";
import QuoteDecor from "../QuoteDecor";
import type { QuoteBlockViewProps } from "./QuoteBlock.types";

function QuoteBlockView({
  className,
  quote,
  author,
  source,
  quoteId,
  authorId,
  config,
  imageError,
  imageLoading,
  currentAvatarSrc,
  onImageLoad,
  onImageError,
}: QuoteBlockViewProps) {
  const t = useTranslation("quoteBlock");
  const avatarAlt = t("avatarAlt").replace("{author}", author);

  return (
    <section
      className={`${config.container} ${className}`}
      aria-labelledby={quoteId}
      role="region"
    >
      <div
        className={`${config.card} bg-[var(--color-surface-default-brand-darker-accent)] relative overflow-hidden`}
      >
        {/* Background with noise texture */}
        <div
          className="absolute inset-0 bg-[var(--color-surface-default-brand-darker-accent)]"
          style={{
            filter:
              'url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="grain" filterUnits="objectBoundingBox" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" seed="7" stitchTiles="stitch" result="noise"/><feColorMatrix in="noise" result="softNoise" type="matrix" values="0.8 0 0 0 0.3 0 0.6 0 0 0.2 0 0 1.0 0 0.4 0 0 0 0.25 0"/><feComposite in="softNoise" in2="SourceAlpha" operator="in" result="maskedNoise"/><feBlend in="SourceGraphic" in2="maskedNoise" mode="multiply"/></filter></defs></svg>#grain\')',
          }}
        />

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
              {!imageError ? (
                <Image
                  src={currentAvatarSrc}
                  alt={avatarAlt}
                  width={64}
                  height={64}
                  className={`filter sepia ${
                    config.avatar
                  } transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  loading="lazy"
                  onError={onImageError}
                  onLoad={onImageLoad}
                />
              ) : null}

              {/* Loading state */}
              {imageLoading && !imageError && (
                <div
                  className={`absolute inset-0 bg-gray-200 animate-pulse rounded-full ${config.avatar}`}
                />
              )}

              {/* Error state - show initials */}
              {imageError && (
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
                data-qopen="&ldquo;"
                data-qclose="&rdquo;"
                className={[
                  "font-bricolage-grotesque font-normal",
                  config.quote,
                  "text-[var(--color-content-inverse-primary)]",
                  // give space for the hanging open-quote so it's not clipped:
                  "pl-[0.6em] -indent-[0.6em]",
                  // inject quotes
                  "relative before:content-[attr(data-qopen)] after:content-[attr(data-qclose)]",
                  // lock quote glyphs to your display face
                  "before:[font-family:var(--font-bricolage-grotesque)]",
                  "after:[font-family:var(--font-bricolage-grotesque)]",
                ].join(" ")}
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
                data-qopen="&ldquo;"
                data-qclose="&rdquo;"
                className={[
                  "font-inter font-normal",
                  config.source,
                  "text-[var(--color-content-inverse-primary)] uppercase",
                  "pl-[0.6em] -indent-[0.6em]",
                  "relative before:content-[attr(data-qopen)] after:content-[attr(data-qclose)]",
                  "before:[font-family:var(--font-inter)] after:[font-family:var(--font-inter)]",
                ].join(" ")}
              >
                {source}
              </p>
            )}
          </footer>
        </div>
      </div>
    </section>
  );
}

QuoteBlockView.displayName = "QuoteBlockView";

export default memo(QuoteBlockView);
