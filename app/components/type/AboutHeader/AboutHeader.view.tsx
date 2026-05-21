"use client";

import { memo } from "react";
import { ASSETS, getAssetPath, vectorMarkPath } from "../../../../lib/assetUtils";
import ContentLockup from "../ContentLockup";
import type { AboutHeaderViewProps } from "./AboutHeader.types";

function assetRelativeForInlineIcon(icon: "arrow" | "about"): string {
  return icon === "arrow" ? ASSETS.LOGO : vectorMarkPath("about");
}

/**
 * Figma: "Type / AboutHeader" (22135-889654).
 */
function AboutHeaderView({
  segments,
  titleId,
  className = "",
}: AboutHeaderViewProps) {
  return (
    <section
      className={`bg-black px-[var(--spacing-scale-020)] py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-064)] md:py-[var(--spacing-scale-032)] ${className}`.trim()}
    >
      <ContentLockup
        variant="about"
        alignment="left"
        titleId={titleId}
        titleContent={segments.map((segment, index) => {
          if (segment.type === "word") {
            return (
              <span key={`${segment.text}-${index}`} className="whitespace-nowrap">
                {segment.text}
              </span>
            );
          }

          return (
            <span
              key={`${segment.icon}-${index}`}
              className={
                segment.icon === "arrow"
                  ? "inline-flex h-[0.92em] min-h-[24px] max-h-[52px] shrink-0 items-center self-center md:max-h-[64px]"
                  : "inline-flex size-[29px] shrink-0 items-center justify-center md:size-[80px]"
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative inline vector */}
              <img
                src={getAssetPath(assetRelativeForInlineIcon(segment.icon))}
                alt=""
                className={
                  segment.icon === "arrow"
                    ? "h-full w-auto max-w-[4.75rem] object-contain md:max-w-[6rem]"
                    : "size-full object-contain"
                }
                role="presentation"
              />
            </span>
          );
        })}
      />
    </section>
  );
}

AboutHeaderView.displayName = "AboutHeaderView";

export default memo(AboutHeaderView);
