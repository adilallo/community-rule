export type TooltipPositionValue = "top" | "bottom" | "Top" | "Bottom";

export interface TooltipProps {
  children: React.ReactNode;
  text: string;
  /**
   * Tooltip position. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  position?: TooltipPositionValue;
  className?: string;
  disabled?: boolean;
}

export interface TooltipViewProps {
  text: string;
  position: "top" | "bottom";
  className: string;
  tooltipClasses: string;
  pointerClasses: string;
}
