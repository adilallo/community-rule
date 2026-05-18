"use client";

import Image from "next/image";
import { memo } from "react";
import { getAssetPath } from "../../../../lib/assetUtils";
import AssetIcon from "../../asset/icon";
import Button from "../../buttons/Button";
import type { TripleStepViewProps } from "./TripleStep.types";

const TRIPLE_STEP_NUMERIC_ICONS = [
  "numeric_1_circle",
  "numeric_2_circle",
  "numeric_3_circle",
] as const;

function TripleStepView({
  heading,
  steps,
  ctaText,
  ctaHref,
  headingId,
  className = "",
}: TripleStepViewProps) {
  /** Decorative column art — `public/assets/shapes/triple-step.svg` (288×576 viewBox). */
  const shapeSrc = getAssetPath("assets/shapes/triple-step.svg");

  return (
    <section
      data-figma-node="22084-859405"
      aria-labelledby={headingId}
      className={`bg-transparent p-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-048)] lg:px-[var(--spacing-scale-064)] lg:py-[var(--spacing-scale-048)] ${className}`.trim()}
    >
      <div className="mx-auto grid w-full min-w-0 max-w-[560px] grid-cols-1 gap-[var(--spacing-scale-032)] md:max-w-[1400px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-stretch md:gap-[var(--spacing-scale-060)] lg:items-center">
        <div className="flex w-full min-w-0 flex-col gap-[var(--spacing-scale-040)] break-words md:self-start lg:self-center">
          <h2
            id={headingId}
            className="font-bricolage-grotesque text-[length:var(--text-medium-heading)] font-bold leading-[length:var(--text-medium-heading--line-height)] text-[var(--color-content-default-primary)] md:text-[length:var(--text-large-heading)] md:leading-[length:var(--text-large-heading--line-height)]"
          >
            {heading}
          </h2>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-start gap-[var(--spacing-scale-016)]"
            >
              <AssetIcon
                name={
                  TRIPLE_STEP_NUMERIC_ICONS[Math.min(index, 2)]
                }
                size={32}
                className="shrink-0"
              />
              <div className="flex min-w-0 flex-col gap-1 text-[var(--color-content-default-primary)]">
                <p className="font-bricolage-grotesque text-[18px] font-medium leading-[22px]">
                  {step.title}
                </p>
                <p className="font-inter text-[length:var(--text-small-paragraph)] font-normal leading-[length:var(--text-small-paragraph--line-height)]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <Button
              href={ctaHref}
              buttonType="outline"
              palette="default"
              size="medium"
              className="max-md:!px-[var(--spacing-scale-012)] max-md:!py-[var(--spacing-scale-010)] max-md:!text-[14px] max-md:!leading-[18px] md:!p-[var(--spacing-scale-012)] md:!text-[16px] md:!leading-5 md:!gap-[var(--spacing-scale-006)]"
            >
              {ctaText}
            </Button>
          </div>
        </div>
        <div
          className="hidden min-h-0 min-w-0 w-full md:flex md:items-center md:justify-center"
          aria-hidden
        >
          <Image
            src={shapeSrc}
            alt=""
            width={288}
            height={576}
            unoptimized
            className="pointer-events-none h-auto w-full max-w-full min-w-0 select-none object-contain"
          />
        </div>
      </div>
    </section>
  );
}

TripleStepView.displayName = "TripleStepView";

export default memo(TripleStepView);
