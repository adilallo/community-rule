export interface CheckboxProps {
  checked?: boolean;
  mode?: "standard" | "inverse";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  label?: string;
  className?: string;
  onChange?: (_data: {
    checked: boolean;
    value?: string;
    event: React.MouseEvent | React.KeyboardEvent;
  }) => void;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
}

export interface CheckboxViewProps {
  labelId: string;
  checked: boolean;
  mode: "standard" | "inverse";
  state: "default" | "hover" | "focus";
  disabled: boolean;
  label?: string;
  name?: string;
  value?: string;
  className: string;
  combinedBoxStyles: string;
  defaultOutlineClass: string;
  conditionalHoverOutlineClass: string;
  conditionalFocusClass: string;
  backgroundWhenChecked: string;
  checkGlyphColor: string;
  labelColor: string;
  accessibilityProps: React.HTMLAttributes<HTMLSpanElement>;
  onToggle: (_e: React.MouseEvent | React.KeyboardEvent) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLSpanElement>) => void;
}
