"use client";

import Button from "./Button";

const ContentLockup = ({ title, subtitle, description, ctaText, ctaHref }) => {
  return (
    <div className="flex flex-col gap-[var(--spacing-scale-006)] sm:gap-[var(--spacing-scale-012)] md:gap-[var(--spacing-scale-020)] lg:gap-[var(--spacing-scale-020)] relative z-10">
      {/* Text content container */}
      <div className="flex flex-col md:gap-[var(--spacing-scale-004)] lg:gap-[var(--spacing-scale-008)] xl:gap-[var(--spacing-scale-020)]">
        {/* Title and subtitle group - no gap between them at xl */}
        <div className="flex flex-col xl:gap-0">
          {/* Title container */}
          <div className="flex gap-[var(--spacing-scale-008)] xl:gap-[var(--spacing-scale-010)] items-center">
            <h1 className="font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] xl:text-[96px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]">
              {title}
            </h1>
            <img
              src="/assets/Shapes_1.svg"
              alt="Decorative shapes"
              className="w-[27.2px] h-[27.2px] md:w-[34px] md:h-[34px] lg:w-[50px] lg:h-[50px]"
            />
          </div>

          {/* Subtitle */}
          <h2 className="font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] xl:text-[96px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]">
            {subtitle}
          </h2>
        </div>

        {/* Description - 20px gap from subtitle at xl */}
        <p className="font-inter font-[400] text-[18px] leading-[130%] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] text-[var(--color-content-inverse-primary)] pr-[var(--spacing-scale-032)] md:pr-[var(--spacing-scale-008)] lg:pr-[var(--spacing-scale-032)]">
          {description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex justify-start">
        {/* Small button for xsm and sm breakpoints */}
        <div className="block md:hidden">
          <Button variant="primary" size="small">
            {ctaText}
          </Button>
        </div>
        {/* Large button for md and lg breakpoints */}
        <div className="hidden md:block xl:hidden">
          <Button variant="primary" size="large">
            {ctaText}
          </Button>
        </div>
        {/* XLarge button for xl breakpoint */}
        <div className="hidden xl:block">
          <Button variant="primary" size="xlarge">
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentLockup;
