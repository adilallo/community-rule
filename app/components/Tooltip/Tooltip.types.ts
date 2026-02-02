export interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: "top" | "bottom";
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
