"use client";

import Button from "./Button";

const ContentLockup = ({ title, subtitle, description, ctaText, ctaHref }) => {
  return (
    <div className="flex flex-col gap-[var(--spacing-scale-006)] sm:gap-[var(--spacing-scale-012)] md:gap-[var(--spacing-scale-020)] lg:gap-[var(--spacing-scale-020)] relative z-10">
      {/* Text content container */}
      <div className="flex flex-col">
        {/* Title container */}
        <div className="flex gap-[var(--spacing-scale-008)] items-center">
          <h1 className="font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] text-[var(--color-content-inverse-primary)]">
            {title}
          </h1>
          <img
            src="/assets/Shapes_1.svg"
            alt="Decorative shapes"
            className="w-[27.2px] h-[27.2px] md:w-[34px] md:h-[34px] lg:w-[50px] lg:h-[50px]"
          />
        </div>

        {/* Subtitle */}
        <h2 className="font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] text-[var(--color-content-inverse-primary)]">
          {subtitle}
        </h2>

        {/* Description */}
        <p className="font-inter font-[400] text-[18px] leading-[130%] lg:text-[24px] lg:leading-[32px] text-[var(--color-content-inverse-primary)] pr-[var(--spacing-scale-032)] md:pr-[var(--spacing-scale-008)] lg:pr-[var(--spacing-scale-032)]">
          {description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex justify-start">
        <Button variant="primary" size="small">
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default ContentLockup;
