"use client";

import React from "react";
import Image from "next/image";
import QuoteDecor from "./QuoteDecor";

const QuoteBlock = ({ className = "" }) => {
  return (
    <div
      className={`md:py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-016)] lg:p-[var(--spacing-scale-064)] ${className}`}
    >
      <div
        className={`py-[var(--spacing-scale-064)] px-[var(--spacing-scale-020)] md:py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-048)] md:rounded-[var(--radius-measures-radius-medium)] lg:py-[var(--spacing-scale-064)] lg:pl-[120px] lg:pr-[320px] bg-[var(--color-surface-default-brand-darker-accent)] relative overflow-hidden`}
      >
        {/* DECORATIONS (behind content) */}
        <QuoteDecor
          className="pointer-events-none absolute z-0
                      left-0 top-0
                      w-full h-full"
        />

        <div className="flex flex-col gap-[var(--spacing-scale-024)] md:gap-[var(--spacing-scale-048)] lg:gap-[var(--spacing-scale-064)] xl:gap-[105px] relative z-10">
          <div className="flex flex-col gap-[var(--spacing-scale-020)] lg:gap-[var(--spacing-scale-018)] xl:gap-[var(--spacing-scale-032)]">
            <Image
              src="assets/Quote_Avatar.svg"
              alt="Quote Avatar"
              width={64}
              height={64}
              className="filter sepia md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] xl:w-[200px] xl:h-[200px]"
            />
            <blockquote>
              <p className="font-bricolage-grotesque font-normal text-[18px] leading-[120%] tracking-[0px] md:text-[36px] md:leading-[110%] md:tracking-[0px] lg:text-[52px] xl:text-[64px] text-[var(--color-content-inverse-primary)] -indent-[0.5em] relative before:content-['\201C'] after:content-['\201D'] before:mr-[0.05em] after:ml-[0.05em] before:[font-family:var(--font-bricolage-grotesque)] after:[font-family:var(--font-bricolage-grotesque)]">
                The rules of decision-making must be open and available to
                everyone, and this can happen only if they are formalized.
              </p>
            </blockquote>
          </div>
          <div className="flex flex-col gap-[var(--spacing-scale-008)] md:gap-[var(--spacing-scale-012)] xl:gap-[var(--spacing-scale-020)]">
            <p className="font-inter font-normal text-[12px] leading-[120%] tracking-[0.24px] md:text-[18px] md:leading-[120%] md:tracking-[0.24px] lg:text-[24px] xl:text-[32px] text-[var(--color-content-inverse-primary)] uppercase">
              Jo Freeman
            </p>
            <p className="font-inter font-normal text-[12px] leading-[120%] tracking-[0.24px] md:text-[18px] md:leading-[120%] md:tracking-[0.24px] lg:text-[24px] xl:text-[32px] text-[var(--color-content-inverse-primary)] uppercase -indent-[0.5em] relative before:content-['\201C'] after:content-['\201D'] before:mr-[0.05em] after:ml-[0.05em] before:[font-family:var(--font-inter)] after:[font-family:var(--font-inter)]">
              The Tyranny of Structurelessness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBlock;
