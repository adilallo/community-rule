"use client";

import { memo } from "react";
import Incrementer from "../Incrementer";
import InputLabel from "../../utility/InputLabel";
import type { IncrementerBlockViewProps } from "./IncrementerBlock.types";

function IncrementerBlockView({
  label,
  helpIcon,
  helperText,
  asterisk,
  labelSize,
  palette,
  blockClassName,
  className,
  ...incrementerProps
}: IncrementerBlockViewProps) {
  return (
    <div
      className={`flex flex-col items-start gap-[var(--measures-spacing-300,12px)] py-[8px] ${blockClassName}`.trim()}
      data-figma-node="19883:13283"
    >
      <InputLabel
        label={label}
        helpIcon={helpIcon}
        helperText={helperText}
        asterisk={asterisk}
        size={labelSize}
        palette={palette}
      />
      <Incrementer {...incrementerProps} className={className} />
    </div>
  );
}

IncrementerBlockView.displayName = "IncrementerBlockView";

export default memo(IncrementerBlockView);
