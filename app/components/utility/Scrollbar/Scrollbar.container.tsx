"use client";

import { memo } from "react";
import { ScrollbarView } from "./Scrollbar.view";
import type { ScrollbarProps } from "./Scrollbar.types";

/**
 * Figma: "Utility / Scrollbar".
 * Custom-styled scrollable wrapper. Most surfaces should attach
 * `SCROLLBAR_DESIGN_CLASS` directly instead of nesting through this view.
 */
const ScrollbarContainer = memo<ScrollbarProps>((props) => {
  return <ScrollbarView {...props} />;
});

ScrollbarContainer.displayName = "Scrollbar";

export default ScrollbarContainer;
