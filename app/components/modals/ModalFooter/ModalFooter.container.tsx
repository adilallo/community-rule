"use client";

import { memo } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import { ModalFooterView } from "./ModalFooter.view";
import type { ModalFooterProps } from "./ModalFooter.types";

/**
 * Figma: "Utility / ModalFooter". Lives under `modals/` with other composed modal chrome.
 * Sticky modal footer slot used by the create-flow + login modals to host
 * primary/secondary actions.
 */
const ModalFooterContainer = memo<ModalFooterProps>((props) => {
  const t = useTranslation("common");
  const resolvedBackText = props.backButtonText ?? t("buttons.back");
  const resolvedNextText = props.nextButtonText ?? t("buttons.next");

  return (
    <ModalFooterView
      {...props}
      backButtonText={resolvedBackText}
      nextButtonText={resolvedNextText}
    />
  );
});

ModalFooterContainer.displayName = "ModalFooter";

export default ModalFooterContainer;
