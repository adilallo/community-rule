"use client";

import { memo } from "react";
import Incrementer, { type IncrementerProps } from "./Incrementer";
import InputLabel from "../../utility/InputLabel";
import type {
  InputLabelPaletteValue,
  InputLabelSizeValue,
} from "../../utility/InputLabel/InputLabel.types";

export interface IncrementerBlockProps extends IncrementerProps {
  /** Label text displayed above the incrementer. */
  label: string;
  /** Show the help "?" icon next to the label. Defaults to `true`. */
  helpIcon?: boolean;
  /**
   * Helper text shown to the right of the label. Pass a string or `true` to
   * render the default "Optional text".
   */
  helperText?: boolean | string;
  /** Show an asterisk indicating a required field. */
  asterisk?: boolean;
  /**
   * Size of the label (`"s"` or `"m"`). Defaults to `"s"` to match the Figma
   * "Incrementer Block" spec.
   */
  labelSize?: InputLabelSizeValue;
  /** Palette. Defaults to `"default"`. */
  palette?: InputLabelPaletteValue;
  /**
   * Class applied to the root `<div>` wrapping the label + incrementer. Use
   * this to control the block's layout width (e.g. `w-full`).
   */
  blockClassName?: string;
}

/**
 * Figma: "Control / Incrementer Block" (`19883:13283`). An `InputLabel` plus
 * an {@link Incrementer} row, stacked with a 12px gap.
 */
function IncrementerBlockComponent({
  label,
  helpIcon = true,
  helperText,
  asterisk,
  labelSize = "s",
  palette = "default",
  blockClassName = "",
  className,
  ...incrementerProps
}: IncrementerBlockProps) {
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

IncrementerBlockComponent.displayName = "IncrementerBlock";

export default memo(IncrementerBlockComponent);
