"use client";

import { memo } from "react";
import type { ComponentType, SVGProps } from "react";
import MutualAidArt from "../../../../public/assets/case-study/case-study-mutual-aid.svg";
import FoodNotBombsArt from "../../../../public/assets/case-study/case-study-food-not-bombs.svg";
import BoulderCountyStreetMedicsArt from "../../../../public/assets/case-study/case-study-boulder-county-street-medics.svg";
import type { CaseStudyProps } from "./CaseStudy.types";

const SURFACE_CLASS: Record<CaseStudyProps["surface"], string> = {
  lavender: "bg-[var(--color-surface-invert-brand-lavender)]",
  neutral: "bg-[var(--color-surface-invert-secondary)]",
  rose: "bg-[var(--color-surface-invert-brand-red)]",
};

/**
 * Inline SVGR components avoid the network round-trip the prior `next/image`
 * version required, so the illustration paints with the colored tile shell.
 */
const SURFACE_ART: Record<
  CaseStudyProps["surface"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  lavender: MutualAidArt,
  neutral: FoodNotBombsArt,
  rose: BoulderCountyStreetMedicsArt,
};

const SURFACE_ART_DATA_KEY: Record<CaseStudyProps["surface"], string> = {
  lavender: "case-study-mutual-aid",
  neutral: "case-study-food-not-bombs",
  rose: "case-study-boulder-county-street-medics",
};

/** Figma: ~23px corner (“Card / CaseStudy” shells). */
const CASE_TILE_RADIUS_CLASS = "rounded-[23.093px]";

function CaseStudyView({
  surface,
  imageAlt = "",
  visual,
  className = "",
}: CaseStudyProps) {
  const Art = SURFACE_ART[surface];
  return (
    <div
      data-figma-node="21993-32352"
      className={`relative h-[305px] w-[305px] shrink-0 overflow-hidden ${CASE_TILE_RADIUS_CLASS} ${SURFACE_CLASS[surface]} ${className}`.trim()}
    >
      {visual ? (
        <div className="flex size-full items-center justify-center p-2">{visual}</div>
      ) : (
        <div className="absolute inset-0">
          <Art
            role="img"
            aria-label={imageAlt}
            data-case-study-art={SURFACE_ART_DATA_KEY[surface]}
            width="100%"
            height="100%"
            className="pointer-events-none block select-none"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      )}
    </div>
  );
}

CaseStudyView.displayName = "CaseStudyView";

export default memo(CaseStudyView);
