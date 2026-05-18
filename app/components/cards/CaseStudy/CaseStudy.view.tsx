"use client";

import Image from "next/image";
import { memo } from "react";
import type { CaseStudyProps } from "./CaseStudy.types";

const SURFACE_CLASS: Record<CaseStudyProps["surface"], string> = {
  lavender: "bg-[var(--color-surface-invert-brand-lavender)]",
  neutral: "bg-[var(--color-surface-invert-secondary)]",
  rose: "bg-[var(--color-surface-invert-brand-red)]",
};

/** Default art per tile: PNG composites (FNB/BCSM) or vector Mutual Aid logo. */
const SURFACE_ART: Record<CaseStudyProps["surface"], string> = {
  lavender: "/assets/case-study/case-study-mutual-aid.svg",
  neutral: "/assets/use-cases/case-study-food-not-bombs.png",
  rose: "/assets/use-cases/case-study-boulder-county-street-medics.png",
};

/** Figma: ~23px corner (“Card / CaseStudy” shells). */
const CASE_TILE_RADIUS_CLASS = "rounded-[23.093px]";

function CaseStudyView({
  surface,
  imageAlt = "",
  visual,
  className = "",
}: CaseStudyProps) {
  return (
    <div
      data-figma-node="21993-32352"
      className={`relative flex h-[305px] w-[305px] shrink-0 overflow-hidden ${CASE_TILE_RADIUS_CLASS} ${SURFACE_CLASS[surface]} ${className}`.trim()}
    >
      {visual ? (
        <div className="flex size-full items-center justify-center p-2">{visual}</div>
      ) : (
        <Image
          src={SURFACE_ART[surface]}
          alt={imageAlt}
          width={305}
          height={305}
          unoptimized={
            SURFACE_ART[surface].endsWith(".svg") ? true : undefined
          }
          className={`pointer-events-none select-none ${
            surface === "lavender" ? "object-contain object-center" : "object-cover"
          }`}
          draggable={false}
        />
      )}
    </div>
  );
}

CaseStudyView.displayName = "CaseStudyView";

export default memo(CaseStudyView);
