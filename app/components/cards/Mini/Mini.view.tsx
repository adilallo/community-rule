"use client";

import { memo } from "react";
import Image from "next/image";
import { SVG_GRAIN_MULTIPLY_FILTER } from "../../../../lib/svgGrainFilter";
import type { MiniViewProps } from "./Mini.types";

function MiniView({
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
  featureGridShell = false,
  panelWidth,
  panelHeight,
  panelImageClassName,
}: MiniViewProps) {
  const defaultPanelSize = featureGridShell ? 48 : 58;
  const imageWidth = panelWidth ?? defaultPanelSize;
  const imageHeight = panelHeight ?? defaultPanelSize;

  const outerClass = featureGridShell
    ? `flex min-h-[159px] flex-col gap-[7px] ${className}`
    : `h-[186px] flex flex-col gap-[7px] ${className}`;

  const panelClass = featureGridShell
    ? `h-[138px] shrink-0 rounded-[var(--measures-radius-400,16px)] px-[24px] py-[32px] ${backgroundColor} flex items-center justify-center`
    : `flex-1 rounded-[var(--radius-measures-radius-xlarge)] border border-[1px] py-[var(--spacing-scale-032)] px-[var(--spacing-scale-024)] ${backgroundColor} flex items-center justify-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`;

  const imageClass = featureGridShell
    ? `max-h-[48px] max-w-[56px] w-auto h-auto object-contain${panelImageClassName ? ` ${panelImageClassName}` : ""}`
    : "max-w-[58px] max-h-[58px] w-auto h-auto object-contain";

  const cardContentElement = (
    <div className={outerClass}>
      <div className={panelClass}>
        {panelContent && (
          <div className="flex h-full w-full items-center justify-center">
            <Image
              src={panelContent}
              alt={computedAriaLabel}
              className={imageClass}
              width={imageWidth}
              height={imageHeight}
              sizes="(max-width: 768px) 50vw, 25vw"
              loading="lazy"
              style={
                featureGridShell
                  ? {
                      filter: SVG_GRAIN_MULTIPLY_FILTER,
                      WebkitFilter: SVG_GRAIN_MULTIPLY_FILTER,
                    }
                  : undefined
              }
            />
          </div>
        )}
        {children}
      </div>

      <div className="text-center font-inter text-[12px] font-medium leading-[14px] text-[var(--color-content-default-primary)]">
        {labelLine1 && labelLine2 ? (
          <>
            <div>{labelLine1}</div>
            <div>{labelLine2}</div>
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

MiniView.displayName = "MiniView";

export default memo(MiniView);
