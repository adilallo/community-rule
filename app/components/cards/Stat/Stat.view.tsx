"use client";

import { memo } from "react";
import Shapes from "../../asset/Shapes";
import type { StatViewProps } from "./Stat.types";

/**
 * Figma: "Card / Stat" (21598-18215). Full width of grid column at desktop.
 */
function StatView({
  value,
  label,
  asOf,
  shapeVariant,
  className = "",
}: StatViewProps) {
  return (
    <article
      className={`relative flex h-auto min-h-[182px] w-full flex-col items-start justify-between rounded-[var(--radius-measures-radius-xlarge,20px)] bg-[var(--color-surface-invert-primary,white)] px-[var(--spacing-scale-024)] py-[var(--spacing-scale-032)] sm:h-[170px] sm:min-h-0 sm:p-[var(--spacing-scale-024)] ${className}`.trim()}
    >
      <div className="relative flex w-full flex-col items-start">
        <div className="relative flex items-center">
          <Shapes
            variant={shapeVariant}
            className="absolute -left-[11px] -top-[21px] size-[80px] rotate-[15deg] opacity-90"
          />
          <p className="relative font-bricolage-grotesque text-[40px] font-bold leading-[52px] text-[var(--color-content-invert-primary,black)]">
            {value}
          </p>
        </div>
        <p className="font-inter text-[14px] font-normal leading-5 text-[var(--color-content-invert-primary,black)]">
          {label}
        </p>
      </div>
      {asOf ? (
        <p className="w-full font-inter text-[10px] font-normal leading-[14px] text-[var(--color-content-invert-tertiary,#2d2d2d)]">
          {asOf}
        </p>
      ) : null}
    </article>
  );
}

StatView.displayName = "StatView";

export default memo(StatView);
