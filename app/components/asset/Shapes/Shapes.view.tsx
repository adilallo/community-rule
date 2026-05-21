"use client";

import { memo } from "react";
import { getAssetPath, statShapeAssetPath } from "../../../../lib/assetUtils";
import type { ShapesProps, StatShapeVariant } from "./Shapes.types";

/** Figma **Card / Stat** color variants → `stat-shape-{1..4}.svg`. */
const SHAPE_INDEX_BY_VARIANT: Record<StatShapeVariant, 1 | 2 | 3 | 4> = {
  yellow: 1,
  purple: 2,
  green: 3,
  orange: 4,
};

/**
 * Figma: "Shapes" (22851-36508) — decorative stat card art (SVG under `assets/shapes/`).
 */
function ShapesView({ variant = "yellow", className = "" }: ShapesProps) {
  const src = getAssetPath(statShapeAssetPath(SHAPE_INDEX_BY_VARIANT[variant]));

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- dynamic path from getAssetPath */
    <img
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none object-contain ${className}`.trim()}
    />
  );
}

ShapesView.displayName = "ShapesView";

export default memo(ShapesView);
