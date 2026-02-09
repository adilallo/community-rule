export type HeaderLockupJustificationValue = "left" | "center" | "Left" | "Center";
export type HeaderLockupSizeValue = "L" | "M" | "l" | "m";

export interface HeaderLockupProps {
  /**
   * Title text (required)
   */
  title: string;
  /**
   * Description text (optional)
   */
  description?: string;
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
}

export interface HeaderLockupViewProps {
  title: string;
  description?: string;
  justification: "left" | "center";
  size: "L" | "M";
}
