"use client";

import { memo } from "react";
import UploadView from "./Upload.view";
import type { UploadProps } from "./Upload.types";

/**
 * Figma: "Control / Upload". Click-to-upload tile with a label
 * and hint text used to add an image from the user's device.
 */
const UploadContainer = memo<UploadProps>(
  ({
    active = true,
    label,
    showHelpIcon = true,
    hintText = "Add image from your device",
    onClick,
    className = "",
  }) => {
    return (
      <UploadView
        active={active}
        label={label}
        showHelpIcon={showHelpIcon}
        hintText={hintText}
        onClick={onClick}
        className={className}
      />
    );
  },
);

UploadContainer.displayName = "Upload";

export default UploadContainer;
