import type { ReactNode } from "react";

export interface SelectOptionData {
  value: string;
  label: string;
}

import type { StateValue } from "../../../../lib/propNormalization";

export type SelectInputLabelVariantValue = "default" | "horizontal" | "Default" | "Horizontal";
export type SelectInputSizeValue = "small" | "medium" | "large" | "Small" | "Medium" | "Large";

export interface SelectInputProps {
  id?: string;
  /**
   * Label text (backward compatibility - if provided, label is shown).
   * For Figma alignment, use `labelText` prop instead.
   */
  label?: string;
  /**
   * Label text (Figma prop - use this for new code).
   */
  labelText?: string;
  /**
   * Whether to show label above input (Figma prop).
   * If `label` or `labelText` is provided, defaults to true.
   * @default true
   */
  showLabel?: boolean;
  /**
   * Label variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  labelVariant?: SelectInputLabelVariantValue;
  /**
   * Select input size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: SelectInputSizeValue;
  /**
   * Visual state. Accepts "default"/"Default", "active"/"Active", "focus"/"Focus", "error"/"Error", "state5"/"State5" (State5 = Disabled).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue | "state5" | "State5";
  /**
   * Whether to show asterisk (*) in label (Figma prop).
   * @default false
   */
  asterisk?: boolean;
  /**
   * Whether to show help icon in label (Figma prop).
   * @default true
   */
  iconHelp?: boolean;
  /**
   * Whether to show "Optional" text in label (Figma prop).
   * @default false
   */
  textOptional?: boolean;
  /**
   * Whether to show data text (placeholder/entered text) - internal, always true (Figma prop).
   * @default true
   */
  textData?: boolean;
  /**
   * Whether to show dropdown icon on the right (Figma prop).
   * @default true
   */
  iconRight?: boolean;
  /**
   * Whether to show hint text below input (Figma prop).
   * @default false
   */
  textHint?: boolean;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  value?: string;
  onChange?: (_data: { target: { value: string; text: string } }) => void;
  options?: SelectOptionData[];
}
