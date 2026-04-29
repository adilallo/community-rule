"use client";

import { memo } from "react";
import { DividerView } from "./Divider.view";
import type { DividerProps } from "./Divider.types";

/**
 * Figma: "Utility / Divider" (450:1941). Content vs Menu line weight; horizontal
 * or vertical.
 */
const DividerContainer = memo<DividerProps>((props) => {
  return <DividerView {...props} />;
});

DividerContainer.displayName = "Divider";

export default DividerContainer;
