import type { ReactNode } from "react";

export type HeaderLockupJustificationValue =
  | "left"
  | "center"
  | "Left"
  | "Center";
export type HeaderLockupSizeValue = "L" | "M" | "l" | "m";
export type HeaderLockupPaletteValue =
  | "default"
  | "inverse"
  | "Default"
  | "Inverse";

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
   * Text justification. Accepts both PascalCase (Figma) and lowercase (codebase).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  justification?: HeaderLockupJustificationValue;
  /**
   * Size variant. Accepts both PascalCase (Figma) and lowercase (codebase).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: HeaderLockupSizeValue;
  /**
   * Palette. Default = light text (dark bg); Inverse = dark text (light bg).
   * Accepts both PascalCase (Figma) and lowercase (codebase).
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
