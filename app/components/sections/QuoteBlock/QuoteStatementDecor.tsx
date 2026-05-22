"use client";

import { memo } from "react";
import { getAssetPath, quoteStatementShapePath } from "../../../../lib/assetUtils";
import { SVG_GRAIN_MULTIPLY_FILTER } from "../../../../lib/svgGrainFilter";

/** Figma: Section / Quote — **`shape-quote.svg`** (22137:890679). */
const EDGE_MASK =
  "linear-gradient(to right, #fff 0%, #fff 14%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, #fff 86%, #fff 100%)";

const QuoteStatementDecor = memo<{ className?: string }>(({ className = "" }) => {
  const src = getAssetPath(quoteStatementShapePath());
  const bg = `url("${src}")`;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.55] select-none ${className}`.trim()}
      aria-hidden
      style={{
        backgroundImage: bg,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        WebkitMaskImage: EDGE_MASK,
        maskImage: EDGE_MASK,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        filter: SVG_GRAIN_MULTIPLY_FILTER,
        WebkitFilter: SVG_GRAIN_MULTIPLY_FILTER,
      }}
    />
  );
});

QuoteStatementDecor.displayName = "QuoteStatementDecor";

export default QuoteStatementDecor;
