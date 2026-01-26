"use client";

import { memo } from "react";

interface QuoteDecorProps {
  className?: string;
}

const QuoteDecor = memo<QuoteDecorProps>(({ className = "" }) => {
  return (
    <svg
      className={`text-[var(--color-surface-inverse-brand-primary)] opacity-100 w-full h-full md:max-w-[640px] lg:max-w-[850px] xl:max-w-[1100px] ${className}`}
      viewBox="400 0 442 163"
      aria-hidden="true"
      overflow="visible"
      preserveAspectRatio="xMinYMin meet"
    >
      <g fill="currentColor">
        {/* Mobile ellipses */}
        <g className="md:hidden">
          {/* First ellipse - top left */}
          <ellipse
            cx="490"
            cy="80"
            rx="300"
            ry="100"
            transform="rotate(-20 600 90)"
          />
          {/* Second ellipse - middle */}
          <ellipse
            cx="508"
            cy="250"
            rx="300"
            ry="110"
            transform="rotate(-25 600 90)"
          />
          {/* Third ellipse - bottom right */}
          <ellipse
            cx="550"
            cy="420"
            rx="300"
            ry="120"
            transform="rotate(-25 600 90)"
          />
        </g>

        {/* MD+ ellipses */}
        <g className="hidden md:block">
          {/* First ellipse - top left */}
          <ellipse
            cx="590"
            cy="70"
            rx="300"
            ry="110"
            transform="rotate(-30 600 90)"
          />
          {/* Second ellipse - middle */}
          <ellipse
            cx="680"
            cy="250"
            rx="300"
            ry="110"
            transform="rotate(-30 600 90)"
          />
          {/* Third ellipse - bottom right */}
          <ellipse
            cx="670"
            cy="400"
            rx="300"
            ry="120"
            transform="rotate(-30 600 90)"
          />
        </g>
      </g>
    </svg>
  );
});

QuoteDecor.displayName = "QuoteDecor";

export default QuoteDecor;
