"use client";

const SectionHeader = ({ title, subtitle, titleLg }) => {
  return (
    <div className="flex flex-col gap-1 w-full lg:flex-row lg:justify-between lg:items-start">
      {/* Title Container - Left side (lg breakpoint) */}
      <div className="lg:w-[369px] lg:h-[120px] lg:flex lg:items-center">
        <h2 className="font-bricolage-grotesque font-bold text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] lg:text-[32px] lg:leading-[40px] lg:w-[369px] lg:pr-24 text-[var(--color-content-default-primary)]">
          <span className="block lg:hidden">{title}</span>
          <span className="hidden lg:block">{titleLg || title}</span>
        </h2>
      </div>

      {/* Subtitle Container - Right side (lg breakpoint) */}
      <div className="lg:w-[928px] lg:h-[120px] lg:flex lg:items-center lg:justify-end">
        <p className="font-inter font-normal text-[18px] leading-[130%] sm:text-[18px] sm:leading-[32px] lg:text-[24px] lg:leading-[32px] text-[#484848] sm:text-[var(--color-content-default-tertiary)] lg:text-[var(--color-content-default-tertiary)] tracking-[0px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader;
