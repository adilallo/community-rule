"use client";

import { memo } from "react";
import IncrementerBlockView from "./IncrementerBlock.view";
import type { IncrementerBlockProps } from "./IncrementerBlock.types";

/**
 * Figma: "Control / Incrementer Block" (`19883:13283`). An `InputLabel` plus
 * an `Incrementer` row, stacked with a 12px gap. Consumers can pass any
 * `IncrementerProps` alongside the label-specific props.
 */
const IncrementerBlockContainer = ({
  label,
  helpIcon = true,
  helperText,
  asterisk,
  labelSize = "s",
  palette = "default",
  blockClassName = "",
  ...incrementerProps
}: IncrementerBlockProps) => {
  return (
    <IncrementerBlockView
      label={label}
      helpIcon={helpIcon}
      helperText={helperText}
      asterisk={asterisk}
      labelSize={labelSize}
      palette={palette}
      blockClassName={blockClassName}
      {...incrementerProps}
    />
  );
};

IncrementerBlockContainer.displayName = "IncrementerBlock";

export default memo(IncrementerBlockContainer);
