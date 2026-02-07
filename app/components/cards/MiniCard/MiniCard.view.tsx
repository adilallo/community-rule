"use client";

import { memo } from "react";
import Image from "next/image";
import type { MiniCardViewProps } from "./MiniCard.types";

function MiniCardView({
  children,
  className,
  backgroundColor,
  panelContent,
  label,
  labelLine1,
  labelLine2,
  computedAriaLabel,
  wrapperElement,
  wrapperProps,
}: MiniCardViewProps) {
  const cardContentElement = (
    <div className={`h-[186px] flex flex-col gap-[7px] ${className}`}>
      {/* Top part - Inner panel */}
      <div
        className={`flex-1 rounded-[var(--radius-measures-radius-xlarge)] border border-[1px] py-[var(--spacing-scale-032)] px-[var(--spacing-scale-024)] ${backgroundColor} flex items-center justify-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
      >
        {/* Content for the inner panel */}
        {panelContent && (
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src={panelContent}
              alt={computedAriaLabel}
              className="max-w-[58px] max-h-[58px] w-auto h-auto object-contain"
              width={58}
              height={58}
              sizes="(max-width: 768px) 50vw, 25vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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

  if (wrapperElement === "a") {
    return (
      <a {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {cardContentElement}
      </a>
    );
  }

  if (wrapperElement === "button") {
    return (
      <button
        {...(wrapperProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {cardContentElement}
      </button>
    );
  }

  return (
    <div {...(wrapperProps as React.HTMLAttributes<HTMLDivElement>)}>
      {cardContentElement}
    </div>
  );
}

MiniCardView.displayName = "MiniCardView";

export default memo(MiniCardView);
