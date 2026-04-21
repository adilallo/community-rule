import type { InputStateValue } from "../../../../lib/propNormalization";

export type TextInputSizeValue = "small" | "medium";

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "onFocus" | "onBlur"
> {
  /**
   * Visual state.
   */
  state?: InputStateValue;
  /**
   * Size variant.
   * @default "medium"
   */
  inputSize?: TextInputSizeValue;
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
   * Can be a boolean or a string to display custom text (e.g., character count).
   * @default false
   */
  textHint?: boolean | string;
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
  textHint?: boolean | string;
  formHeader?: boolean;
}
