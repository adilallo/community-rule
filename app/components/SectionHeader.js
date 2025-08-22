"use client";

const SectionHeader = ({ title, subtitle, titleLg, variant = "default" }) => {
  return (
    <div className="flex flex-col gap-1 w-full lg:flex-row lg:justify-between lg:items-start xl:gap-[var(--spacing-scale-024)]">
      {/* Title Container - Left side (lg breakpoint) */}
      <div className="lg:w-[369px] lg:h-[var(--spacing-scale-120)] lg:flex lg:items-center xl:w-[452px] xl:h-[156px] xl:flex xl:items-center">
        <h2
          className={
            variant === "small"
              ? "font-bricolage-grotesque font-bold text-medium-heading text-[var(--color-content-default-primary)]"
              : "font-bricolage-grotesque font-bold text-medium-heading sm:text-large-heading lg:text-large-heading lg:w-[369px] lg:pr-[var(--spacing-scale-024)] xl:text-xx-large-heading xl:w-[452px] xl:pr-[var(--spacing-scale-024)] text-[var(--color-content-default-primary)]"
          }
        >
          <span className="block lg:hidden">{title}</span>
          <span className="hidden lg:block">{titleLg || title}</span>
        </h2>
      </div>

      {/* Subtitle Container */}
      <div className="lg:w-[928px] lg:h-[var(--spacing-scale-120)] lg:flex lg:items-center lg:justify-end xl:w-[763px] xl:h-[156px] xl:flex xl:items-center xl:justify-end">
        <p
          className={
            variant === "small"
              ? "font-inter font-normal text-small-paragraph text-[var(--color-content-default-tertiary)]"
              : "font-inter font-normal text-large-paragraph sm:text-large-paragraph lg:text-x-large-paragraph xl:text-xx-large-paragraph xl:text-right text-[#484848] sm:text-[var(--color-content-default-tertiary)] lg:text-[var(--color-content-default-tertiary)] xl:text-[var(--color-content-default-tertiary)] tracking-[0px]"
          }
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader;
