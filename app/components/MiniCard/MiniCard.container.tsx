"use client";

import { memo, useMemo } from "react";
import MiniCardView from "./MiniCard.view";
import type { MiniCardProps } from "./MiniCard.types";

const MiniCardContainer = memo<MiniCardProps>(
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
    // Compute aria-label
    const computedAriaLabel = useMemo(
      () =>
        ariaLabel ||
        (labelLine1 && labelLine2
          ? `${labelLine1} ${labelLine2}`
          : label || "Feature card"),
      [ariaLabel, labelLine1, labelLine2, label],
    );

    // Determine wrapper element and props
    const { wrapperElement, wrapperProps } = useMemo(() => {
      const baseProps = {
        "aria-label": computedAriaLabel,
      };

      if (href) {
        return {
          wrapperElement: "a" as const,
          wrapperProps: {
            ...baseProps,
            href,
            className:
              "block focus:outline-none focus:ring-2 focus:ring-[var(--color-surface-default-brand-royal)] focus:ring-offset-2 rounded-[var(--radius-measures-radius-xlarge)] transition-all duration-200 hover:scale-[1.02]",
            tabIndex: 0,
          },
        };
      }

      if (onClick) {
        return {
          wrapperElement: "button" as const,
          wrapperProps: {
            ...baseProps,
            onClick,
            className:
              "block w-full text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-surface-default-brand-royal)] focus:ring-offset-2 rounded-[var(--radius-measures-radius-xlarge)] transition-all duration-200 hover:scale-[1.02]",
            tabIndex: 0,
            onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            },
          },
        };
      }

      return {
        wrapperElement: "div" as const,
        wrapperProps: {
          ...baseProps,
          className: "block",
        },
      };
    }, [href, onClick, computedAriaLabel]);

    return (
      <MiniCardView
        className={className}
        backgroundColor={backgroundColor}
        panelContent={panelContent}
        label={label}
        labelLine1={labelLine1}
        labelLine2={labelLine2}
        computedAriaLabel={computedAriaLabel}
        wrapperElement={wrapperElement}
        wrapperProps={wrapperProps}
      >
        {children}
      </MiniCardView>
    );
  },
);

MiniCardContainer.displayName = "MiniCard";

export default MiniCardContainer;
