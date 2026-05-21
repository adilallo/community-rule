"use client";

import { memo } from "react";
import { ASSETS, getAssetPath } from "../../../../lib/assetUtils";
import Button from "../../buttons/Button";
import ContentLockup from "../../type/ContentLockup";
import type { BookViewProps } from "./Book.types";

/**
 * Figma: "Sections / Book" outer **22135:889706** (1440+: **Content Card Horizontal** 22135:890130): card `max-width` **1280px**, inner padding **scale/048**, gutter **scale/032** (`Content Lockup`: Small/Display 32 lh 1.1 Medium; body X Large / Paragraph **24 lh 32**). Section inset lg **scale/160** / **064** unchanged.
 */
function BookView({
  title,
  description,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt,
  headingId,
  className = "",
}: BookViewProps) {
  const coverSrc = imageSrc ?? getAssetPath(ASSETS.COMMUNITYRULES_COVER);

  return (
    <section
      aria-labelledby={headingId}
      className={`px-[var(--spacing-scale-008)] py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-160)] lg:py-[var(--spacing-scale-064)] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <div className="flex w-full flex-col items-center gap-[var(--spacing-scale-032)] rounded-[var(--radius-measures-radius-xlarge,20px)] bg-[#171717] p-[var(--spacing-scale-048)] shadow-[0_0_48px_rgba(0,0,0,0.1)] md:flex-row md:items-center lg:gap-[var(--spacing-scale-040)] lg:p-[var(--spacing-scale-064)] xl:mx-auto xl:max-w-[1280px] xl:gap-[var(--spacing-scale-032)] xl:p-[var(--spacing-scale-048)]">
          <div className="relative aspect-[375/580] w-full shrink-0 overflow-hidden rounded-[4px] shadow-[0_0_24px_rgba(0,0,0,0.25)] md:aspect-auto md:h-[495px] md:w-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- marketing cover art */}
            <img
              src={coverSrc}
              alt={imageAlt ?? ""}
              className="size-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-scale-016)] lg:gap-[var(--spacing-scale-024)] xl:gap-[var(--spacing-scale-020)]">
            <ContentLockup
              variant="book"
              alignment="left"
              titleId={headingId}
              title={title}
              description={description}
            />
            <Button
              buttonType="filled"
              palette="default"
              size="small"
              href={buttonHref}
              className="self-start"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

BookView.displayName = "BookView";

export default memo(BookView);
