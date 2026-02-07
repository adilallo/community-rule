import type { StateValue } from "../../../../lib/propNormalization";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  /**
   * Whether the switch is checked (backward compatibility - use propSwitch instead).
   */
  checked?: boolean;
  /**
   * Whether the switch is checked (Figma prop).
   * @default false
   */
  propSwitch?: boolean;
  onChange?: (
    _e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onFocus?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  /**
   * Visual state. Accepts "default"/"Default", "hover"/"Hover", "focus"/"Focus" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue;
  /**
   * Label text (backward compatibility - use text instead).
   */
  label?: string;
  /**
   * Label text (Figma prop).
   */
  text?: string;
  className?: string;
}

export interface SwitchViewProps {
  switchId: string;
  checked: boolean;
  state: "default" | "hover" | "focus" | "selected";
  label?: string;
  className: string;
  switchClasses: string;
  trackClasses: string;
  thumbClasses: string;
  labelClasses: string;
  onClick: (_e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur: (_e: React.FocusEvent<HTMLButtonElement>) => void;
}
