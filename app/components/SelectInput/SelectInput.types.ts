import type { ReactNode } from "react";

export interface SelectOptionData {
  value: string;
  label: string;
}

import type { StateValue } from "../../../lib/propNormalization";

export type SelectInputLabelVariantValue = "default" | "horizontal" | "Default" | "Horizontal";
export type SelectInputSizeValue = "small" | "medium" | "large" | "Small" | "Medium" | "Large";

export interface SelectInputProps {
  id?: string;
  label?: string;
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
   * Visual state. Accepts "default"/"Default", "hover"/"Hover", "focus"/"Focus" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  value?: string;
  onChange?: (_data: { target: { value: string; text: string } }) => void;
  options?: SelectOptionData[];
}
