export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
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
  onChange?: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}

export interface TextAreaViewProps {
  textareaId: string;
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
  className: string;
  rows?: number;
  containerClasses: string;
  labelClasses: string;
  textareaClasses: string;
  borderRadius: string;
  handleChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFocus: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
  handleBlur: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
}
