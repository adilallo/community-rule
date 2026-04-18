"use client";

import { memo } from "react";
import { ModalHeaderView } from "./ModalHeader.view";
import type { ModalHeaderProps } from "./ModalHeader.types";

/**
 * Figma: "Utility / ModalHeader" (TODO(figma)).
 * Sticky 48px modal header with optional close (left) and more-options
 * (right) icon buttons.
 */
const ModalHeaderContainer = memo<ModalHeaderProps>((props) => {
  return <ModalHeaderView {...props} />;
});

ModalHeaderContainer.displayName = "ModalHeader";

export default ModalHeaderContainer;
