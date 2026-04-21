import type { ReactNode } from "react";

export type HeaderLockupJustificationValue = "left" | "center";
export type HeaderLockupSizeValue = "L" | "M";
export type HeaderLockupPaletteValue = "default" | "inverse";

export interface HeaderLockupProps {
  /**
   * Title text (required)
   */
  title: string;
  /**
   * Description (optional). String for plain copy, or ReactNode for rich inline content (e.g. linked words).
   */
  description?: ReactNode;
  /**
   * Text justification.
   */
  justification?: HeaderLockupJustificationValue;
  /**
   * Size variant.
   */
  size?: HeaderLockupSizeValue;
  /**
   * Palette. default = light text (dark bg); inverse = dark text (light bg).
   */
  palette?: HeaderLockupPaletteValue;
}

export interface HeaderLockupViewProps {
  title: string;
  description?: ReactNode;
  justification: "left" | "center";
  size: "L" | "M";
  palette: "default" | "inverse";
}
