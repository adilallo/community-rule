"use client";

import { memo } from "react";
import UploadView from "./Upload.view";
import type { UploadProps } from "./Upload.types";

const UploadContainer = memo<UploadProps>(
  ({
    active = true,
    label,
    showHelpIcon = true,
    onClick,
    className = "",
  }) => {
    return (
      <UploadView
        active={active}
        label={label}
        showHelpIcon={showHelpIcon}
        onClick={onClick}
        className={className}
      />
    );
  },
);

UploadContainer.displayName = "Upload";

export default UploadContainer;
