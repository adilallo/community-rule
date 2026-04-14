import type { InputStateValue } from "../../../../lib/propNormalization";

export type TextAreaSizeValue =
  | "small"
  | "medium"
  | "large"
  | "Small"
  | "Medium"
  | "Large";
export type TextAreaLabelVariantValue =
  | "default"
  | "horizontal"
  | "Default"
  | "Horizontal";

export type TextAreaAppearanceValue =
  | "default"
  | "embedded"
  | "Default"
  | "Embedded";

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "onChange" | "onFocus" | "onBlur"
> {
  /**
   * Text area size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: TextAreaSizeValue;
  /**
   * Label variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  labelVariant?: TextAreaLabelVariantValue;
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
  onChange?: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  /**
   * Hint below the textarea: `true` shows placeholder copy, or pass a string (e.g. character count).
   * @default false
   */
  textHint?: boolean | string;
  /**
   * Whether to show form header (label and help icon) above textarea (Figma prop).
   * @default true
   */
  formHeader?: boolean;
  /**
   * Whether to show help icon in label.
   * @default false
   */
  showHelpIcon?: boolean;
  /**
   * Visual appearance. "embedded" matches Create modal sections (Figma 20736-12668):
   * borderless, darker grey background, white text. "default" is standard bordered input.
   * @default "default"
   */
  appearance?: TextAreaAppearanceValue;
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
  textHint?: boolean | string;
  formHeader?: boolean;
  showHelpIcon?: boolean;
  appearance?: "default" | "embedded";
}
