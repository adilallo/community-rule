"use client";

/**
 * Figma: Community Rule System — Export popover (Community Rule System · 21998:22612)
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21998-22612
 */
import { memo } from "react";
import { PopoverView } from "./Popover.view";
import type { PopoverProps } from "./Popover.types";

const Popover = memo<PopoverProps>((props) => {
  return <PopoverView {...props} />;
});

Popover.displayName = "Popover";

export default Popover;
