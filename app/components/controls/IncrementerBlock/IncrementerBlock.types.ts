import type { IncrementerProps } from "../Incrementer/Incrementer.types";
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

export interface IncrementerBlockViewProps extends IncrementerProps {
  label: string;
  helpIcon: boolean;
  helperText: boolean | string | undefined;
  asterisk: boolean | undefined;
  labelSize: InputLabelSizeValue;
  palette: InputLabelPaletteValue;
  blockClassName: string;
}
