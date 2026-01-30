export interface RadioButtonProps {
  checked?: boolean;
  mode?: "standard" | "inverse";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  label?: string;
  onChange?: (_data: { checked: boolean; value?: string }) => void;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
}

export interface RadioButtonViewProps {
  radioId: string;
  checked: boolean;
  mode: "standard" | "inverse";
  state: "default" | "hover" | "focus";
  disabled: boolean;
  label?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className: string;
  combinedBoxStyles: string;
  defaultOutlineClass: string;
  conditionalHoverOutlineClass: string;
  conditionalFocusClass: string;
  backgroundWhenChecked: string;
  dotColor: string;
  labelColor: string;
  onToggle: (_e: React.MouseEvent | React.KeyboardEvent) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLSpanElement>) => void;
}
