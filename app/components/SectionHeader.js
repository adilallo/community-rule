"use client";

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Title - Bricolage Grotesque */}
      <h2 className="font-bricolage-grotesque font-bold text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] text-[var(--color-content-default-primary)]">
        {title}
      </h2>

      {/* Subtitle - Inter */}
      <p className="font-inter font-normal text-[18px] leading-[130%] sm:text-[18px] sm:leading-[32px] text-[#484848] sm:text-[var(--color-content-default-tertiary)] tracking-[0px]">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
