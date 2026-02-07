import type { InputStateValue } from "../../../../lib/propNormalization";

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "onFocus" | "onBlur"
> {
  /**
   * Visual state. Accepts "default"/"Default", "active"/"Active", "hover"/"Hover", "focus"/"Focus" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: InputStateValue;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (_e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  showHelpIcon?: boolean;
  /**
   * Whether to show hint text below input (Figma prop).
   * @default false
   */
  textHint?: boolean;
  /**
   * Whether to show form header (label and help icon) above input (Figma prop).
   * @default true
   */
  formHeader?: boolean;
}

export interface TextInputViewProps {
  inputId: string;
  labelId: string;
  state: "default" | "active" | "hover" | "focus";
  disabled: boolean;
  error: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  type: string;
  className: string;
  containerClasses: string;
  labelClasses: string;
  inputClasses: string;
  borderRadius: string;
  handleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (_e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (_e: React.FocusEvent<HTMLInputElement>) => void;
  handleMouseDown?: () => void;
  showHelpIcon?: boolean;
  isFilled?: boolean;
  inputWrapperClasses?: string;
  focusRingClasses?: string;
  textHint?: boolean;
  formHeader?: boolean;
}
