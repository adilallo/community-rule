"use client";

import { memo } from "react";
import { ModalFooterView } from "./ModalFooter.view";
import type { ModalFooterProps } from "./ModalFooter.types";

/**
 * Figma: "Utility / ModalFooter" (TODO(figma)).
 * Sticky modal footer slot used by the create-flow + login modals to host
 * primary/secondary actions.
 */
const ModalFooterContainer = memo<ModalFooterProps>((props) => {
  return <ModalFooterView {...props} />;
});

ModalFooterContainer.displayName = "ModalFooter";

export default ModalFooterContainer;
