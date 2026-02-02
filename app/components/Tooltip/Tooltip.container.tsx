"use client";

import { memo, useState } from "react";
import { TooltipView } from "./Tooltip.view";
import type { TooltipProps } from "./Tooltip.types";

const TooltipContainer = memo<TooltipProps>(
  ({ children, text, position = "top", className = "", disabled = false }) => {
    const [isVisible, setIsVisible] = useState(false);

    if (disabled) {
      return <>{children}</>;
    }

    const tooltipClasses = `absolute z-50 bg-[var(--color-surface-default-primary)] px-[var(--space-300)] py-[var(--space-200)] rounded-[var(--radius-300,12px)] shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] flex items-center whitespace-nowrap ${
      position === "top" ? "bottom-full mb-[7px]" : "top-full mt-[7px]"
    } left-1/2 -translate-x-1/2 ${isVisible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} transition-all duration-200`;

    // Pointer positioning: 10px tall, 7px sticks out, 3px inside tooltip
    // For bottom tooltip: pointer at top, pointing up, 7px above tooltip
    // For top tooltip: pointer at bottom, pointing down, 7px below tooltip
    const pointerClasses = `absolute ${
      position === "top" ? "bottom-[-7px]" : "top-[-7px]"
    } left-1/2 -translate-x-1/2`;

    return (
      <div
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
        <TooltipView
          text={text}
          position={position}
          className=""
          tooltipClasses={tooltipClasses}
          pointerClasses={pointerClasses}
        />
      </div>
    );
  },
);

TooltipContainer.displayName = "Tooltip";

export default TooltipContainer;
