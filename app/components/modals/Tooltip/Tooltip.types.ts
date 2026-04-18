export type TooltipPositionValue = "top" | "bottom";

export interface TooltipProps {
  children: React.ReactNode;
  text: string;
  /**
   * Tooltip position.
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
