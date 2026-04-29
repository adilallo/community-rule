export type InputLabelSizeValue = "s" | "m";
export type InputLabelPaletteValue = "default" | "inverse";

export interface InputLabelProps {
  /**
   * The label text to display
   */
  label: string;
  /**
   * Show help icon next to label
   */
  helpIcon?: boolean;
  /**
   * Show asterisk (*) to indicate required field
   */
  asterisk?: boolean;
  /**
   * Helper text to display on the right side.
   * If boolean true, shows "Optional text".
   * If string, shows the provided text.
   */
  helperText?: boolean | string;
  /**
   * Size variant: "s" (small) or "m" (medium)
   */
  size?: InputLabelSizeValue;
  /**
   * Palette variant: "default" or "inverse"
   */
  palette?: InputLabelPaletteValue;
  className?: string;
}

export interface InputLabelViewProps {
  label: string;
  helpIcon: boolean;
  asterisk: boolean;
  helperText: boolean | string;
  size: "s" | "m";
  palette: "default" | "inverse";
  className: string;
}
