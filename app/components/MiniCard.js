"use client";

import React, { memo } from "react";
import Image from "next/image";

const MiniCard = memo(
  ({
    children,
    className = "",
    backgroundColor = "bg-[var(--color-surface-default-brand-royal)]",
    panelContent,
    label,
    labelLine1,
    labelLine2,
    onClick,
    href,
    ariaLabel,
  }) => {
    const cardContent = (
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
                alt={
                  ariaLabel ||
                  `${labelLine1} ${labelLine2}` ||
                  label ||
                  "Feature icon"
                }
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

    // If href is provided, render as a link
    if (href) {
      return (
        <a
          href={href}
          className="block focus:outline-none focus:ring-2 focus:ring-[var(--color-surface-default-brand-royal)] focus:ring-offset-2 rounded-[var(--radius-measures-radius-xlarge)] transition-all duration-200 hover:scale-[1.02]"
          aria-label={
            ariaLabel ||
            `${labelLine1} ${labelLine2}` ||
            label ||
            "Feature card"
          }
          tabIndex={0}
        >
          {cardContent}
        </a>
      );
    }

    // If onClick is provided, render as a button
    if (onClick) {
      return (
        <button
          onClick={onClick}
          className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-surface-default-brand-royal)] focus:ring-offset-2 rounded-[var(--radius-measures-radius-xlarge)] transition-all duration-200 hover:scale-[1.02]"
          aria-label={
            ariaLabel ||
            `${labelLine1} ${labelLine2}` ||
            label ||
            "Feature card"
          }
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }}
        >
          {cardContent}
        </button>
      );
    }

    // Default render as a div
    return (
      <div
        className="block"
        aria-label={
          ariaLabel || `${labelLine1} ${labelLine2}` || label || "Feature card"
        }
      >
        {cardContent}
      </div>
    );
  },
);

MiniCard.displayName = "MiniCard";

export default MiniCard;
