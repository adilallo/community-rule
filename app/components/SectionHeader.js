"use client";

const SectionHeader = ({ title, subtitle, titleLg }) => {
  return (
    <div className="flex flex-col gap-1 w-full lg:flex-row lg:justify-between lg:items-start xl:gap-[var(--spacing-scale-024)]">
      {/* Title Container - Left side (lg breakpoint) */}
      <div className="lg:w-[369px] lg:h-[120px] lg:flex lg:items-center xl:w-[452px] xl:h-[156px] xl:flex xl:items-center">
        <h2 className="font-bricolage-grotesque font-bold text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] lg:text-[32px] lg:leading-[40px] lg:w-[369px] lg:pr-24 xl:text-[40px] xl:leading-[52px] xl:w-[452px] xl:pr-24 text-[var(--color-content-default-primary)]">
          <span className="block lg:hidden">{title}</span>
          <span className="hidden lg:block">{titleLg || title}</span>
        </h2>
      </div>

      {/* Subtitle Container */}
      <div className="lg:w-[928px] lg:h-[120px] lg:flex lg:items-center lg:justify-end xl:w-[763px] xl:h-[156px] xl:flex xl:items-center xl:justify-end">
        <p className="font-inter font-normal text-[18px] leading-[130%] sm:text-[18px] sm:leading-[32px] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] xl:text-right text-[#484848] sm:text-[var(--color-content-default-tertiary)] lg:text-[var(--color-content-default-tertiary)] xl:text-[var(--color-content-default-tertiary)] tracking-[0px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader;
