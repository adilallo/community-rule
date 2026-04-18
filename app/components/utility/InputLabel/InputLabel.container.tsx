"use client";

import { memo } from "react";
import InputLabelView from "./InputLabel.view";
import type { InputLabelProps } from "./InputLabel.types";

/**
 * Figma: "Utility / InputLabel" (TODO(figma)). Reusable form-input label with
 * optional asterisk, help icon, and helper text.
 */
const InputLabelContainer = memo<InputLabelProps>(
  ({
    label,
    helpIcon = false,
    asterisk = false,
    helperText = false,
    size: sizeProp = "s",
    palette: paletteProp = "default",
    className = "",
  }) => {
    const size = sizeProp;
    const palette = paletteProp;

    return (
      <InputLabelView
        label={label}
        helpIcon={helpIcon}
        asterisk={asterisk}
        helperText={helperText}
        size={size}
        palette={palette}
        className={className}
      />
    );
  },
);

InputLabelContainer.displayName = "InputLabel";

export default InputLabelContainer;
