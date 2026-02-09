"use client";

import { memo } from "react";
import type { NumberedListViewProps } from "./NumberedList.types";

function NumberedListView({ items, size }: NumberedListViewProps) {
  const isM = size === "M";

  return (
    <ol className="flex flex-col gap-[var(--measures-spacing-600,24px)] items-start relative w-full list-none">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-[12px] items-center relative shrink-0 w-full"
        >
          {/* Number Indicator */}
          <div
            className={`bg-[var(--color-surface-inverse-primary,white)] flex flex-col items-center justify-center px-[11.2px] py-[4px] relative rounded-full shrink-0 ${
              isM ? "size-[32px]" : "size-[24px]"
            }`}
          >
            <div
              className={`flex flex-col justify-center leading-[0] overflow-hidden relative shrink-0 text-[var(--color-content-inverse-primary,black)] text-ellipsis whitespace-nowrap ${
                isM
                  ? "font-inter font-bold text-[20px] leading-[28px]"
                  : "font-bricolage-grotesque font-bold text-[16px] leading-[22px]"
              }`}
            >
              <span>{index + 1}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-[1_0_0] flex-col gap-[var(--measures-spacing-100,4px)] items-start justify-center min-h-px min-w-px">
            {/* Title */}
            <div className="flex items-center relative shrink-0 w-full">
              <h3
                className={`flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[var(--color-content-default-primary,white)] text-ellipsis whitespace-pre-wrap ${
                  isM
                    ? "font-inter font-bold text-[20px] leading-[28px]"
                    : "font-bricolage-grotesque font-bold text-[16px] leading-[22px]"
                }`}
              >
                {item.title}
              </h3>
            </div>

            {/* Description */}
            <p
              className={`font-inter font-normal max-w-[640px] overflow-hidden relative shrink-0 text-[var(--color-content-default-tertiary,#b4b4b4)] text-ellipsis w-full whitespace-pre-wrap ${
                isM
                  ? "text-[14px] leading-[20px]"
                  : "text-[12px] leading-[16px]"
              }`}
            >
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

NumberedListView.displayName = "NumberedListView";

export default memo(NumberedListView);
