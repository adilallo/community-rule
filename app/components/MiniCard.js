"use client";

import React from "react";

const MiniCard = ({
  children,
  className = "",
  backgroundColor = "bg-[var(--color-surface-default-brand-royal)]",
  panelContent,
  label,
  labelLine1,
  labelLine2,
}) => {
  return (
    <div className={`h-[186px] flex flex-col gap-[7px] ${className}`}>
      {/* Top part - Inner panel */}
      <div
        className={`flex-1 rounded-[var(--radius-measures-radius-xlarge)] border border-[1px] py-[var(--spacing-scale-032)] px-[var(--spacing-scale-024)] ${backgroundColor} flex items-center justify-center`}
      >
        {/* Content for the inner panel */}
        {panelContent && (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={panelContent}
              alt=""
              className="max-w-[58px] max-h-[58px] w-auto h-auto object-contain"
            />
          </div>
        )}
        {children}
      </div>

      {/* Bottom part - Text container */}
      <div className="font-inter font-medium text-[12px] leading-[14px] text-center text-[var(--color-content-default-primary)]">
        {labelLine1 && labelLine2 ? (
          <>
            <div>{labelLine1}</div>
            <div>{labelLine2}</div>
            <div>&nbsp;</div>
          </>
        ) : (
          label
        )}
      </div>
    </div>
  );
};

export default MiniCard;
