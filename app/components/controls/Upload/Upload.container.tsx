"use client";

import { memo } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
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
    hintText,
    onClick,
    className = "",
  }) => {
    const t = useTranslation("controlsChrome");

    return (
      <UploadView
        active={active}
        label={label}
        showHelpIcon={showHelpIcon}
        hintText={hintText ?? t("uploadHintDefault")}
        uploadButtonLabel={t("uploadButton")}
        uploadAriaLabel={t("uploadAriaLabel")}
        onClick={onClick}
        className={className}
      />
    );
  },
);

UploadContainer.displayName = "Upload";

export default UploadContainer;
