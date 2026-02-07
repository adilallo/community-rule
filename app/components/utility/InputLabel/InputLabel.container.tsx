"use client";

import { memo } from "react";
import InputLabelView from "./InputLabel.view";
import type { InputLabelProps } from "./InputLabel.types";
import {
  normalizeInputLabelSize,
  normalizeInputLabelPalette,
} from "../../../../lib/propNormalization";

const InputLabelContainer = memo<InputLabelProps>(
  ({
    label,
    helpIcon = false,
    asterisk = false,
    helperText = false,
    size: sizeProp = "S",
    palette: paletteProp = "Default",
    className = "",
  }) => {
    const size = normalizeInputLabelSize(sizeProp);
    const palette = normalizeInputLabelPalette(paletteProp);

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
