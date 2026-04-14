"use client";

import { memo } from "react";
import UploadView from "./Upload.view";
import type { UploadProps } from "./Upload.types";

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
