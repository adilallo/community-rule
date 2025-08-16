"use client";

import SectionNumber from "./SectionNumber";

const NumberedCard = ({ number, text, iconShape, iconColor }) => {
  return (
    <div className="bg-[var(--color-surface-inverse-primary)] rounded-[12px] p-5 shadow-lg flex flex-col gap-4">
      {/* Section Number - Top part */}
      <div className="flex justify-end">
        <SectionNumber number={number} />
      </div>

      {/* Card Content - Bottom part */}
      <div>
        <p className="font-bricolage-grotesque font-medium text-[24px] leading-[32px] text-[#141414]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default NumberedCard;
