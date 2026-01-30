export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "onFocus" | "onBlur"
> {
  size?: "small" | "medium" | "large";
  labelVariant?: "default" | "horizontal";
  state?: "default" | "active" | "hover" | "focus";
  disabled?: boolean;
  error?: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (_e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface InputViewProps {
  inputId: string;
  labelId: string;
  size: "small" | "medium" | "large";
  labelVariant: "default" | "horizontal";
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
}
