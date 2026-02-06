import type { StateValue } from "../../../lib/propNormalization";

export interface ToggleProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  label?: string;
  checked?: boolean;
  onChange?: (
    _e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onFocus?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /**
   * Visual state. Accepts "default"/"Default", "hover"/"Hover", "focus"/"Focus" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue;
  showIcon?: boolean;
  showText?: boolean;
  icon?: string;
  text?: string;
  className?: string;
}

export interface ToggleViewProps {
  toggleId: string;
  labelId: string;
  checked: boolean;
  disabled: boolean;
  state: "default" | "hover" | "focus" | "selected";
  label?: string;
  showIcon: boolean;
  showText: boolean;
  icon: string;
  text: string;
  className: string;
  containerClasses: string;
  labelClasses: string;
  toggleClasses: string;
  onClick: (
    _e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur: (_e: React.FocusEvent<HTMLButtonElement>) => void;
}
