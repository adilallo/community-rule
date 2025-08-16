"use client";

import SectionNumber from "./SectionNumber";

const NumberedCard = ({ number, text, iconShape, iconColor }) => {
  return (
    <div className="bg-[var(--color-surface-inverse-primary)] rounded-[12px] p-5 shadow-lg flex flex-col gap-4 sm:p-8 sm:gap-8 sm:flex-row sm:items-center">
      {/* Section Number - Left part (sm breakpoint) */}
      <div className="flex justify-end sm:justify-start sm:flex-shrink-0">
        <SectionNumber number={number} />
      </div>

      {/* Card Content - Right part (sm breakpoint) */}
      <div className="sm:flex-1">
        <p className="font-bricolage-grotesque font-medium text-[24px] leading-[32px] sm:font-normal sm:leading-[24px] text-[#141414]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default NumberedCard;
