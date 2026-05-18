"use client";

import { memo } from "react";
import { getAssetPath, quoteStatementShapePath } from "../../../../lib/assetUtils";

/** Figma: Section / Quote — **`shape-qoute.svg`** (22137:890679). */
const EDGE_MASK =
  "linear-gradient(to right, #fff 0%, #fff 14%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, #fff 86%, #fff 100%)";

const GRAIN_MULTIPLY_FILTER =
  'url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="grain" filterUnits="objectBoundingBox" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" seed="7" stitchTiles="stitch" result="noise"/><feColorMatrix in="noise" result="softNoise" type="matrix" values="0.8 0 0 0 0.3 0 0.6 0 0 0.2 0 0 1.0 0 0.4 0 0 0 0.25 0"/><feComposite in="softNoise" in2="SourceAlpha" operator="in" result="maskedNoise"/><feBlend in="SourceGraphic" in2="maskedNoise" mode="multiply"/></filter></defs></svg>#grain\')';

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
        filter: GRAIN_MULTIPLY_FILTER,
        WebkitFilter: GRAIN_MULTIPLY_FILTER,
      }}
    />
  );
});

QuoteStatementDecor.displayName = "QuoteStatementDecor";

export default QuoteStatementDecor;
