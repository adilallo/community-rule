"use client";

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Title - Bricolage Grotesque */}
      <h2 className="font-bricolage-grotesque font-bold text-[28px] leading-[36px] text-[var(--color-content-default-primary)]">
        {title}
      </h2>

      {/* Subtitle - Inter */}
      <p className="font-inter font-normal text-[18px] leading-[130%] text-[#484848]">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
