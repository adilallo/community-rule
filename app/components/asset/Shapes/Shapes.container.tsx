"use client";

import { memo } from "react";
import ShapesView from "./Shapes.view";
import type { ShapesProps } from "./Shapes.types";

/**
 * Figma: "Shapes" (22851-36508) — **Card / Stat** decorative shapes (`assets/shapes/stat-shape-*.svg`).
 */
const ShapesContainer = memo<ShapesProps>((props) => {
  return <ShapesView {...props} />;
});

ShapesContainer.displayName = "Shapes";

export default ShapesContainer;
