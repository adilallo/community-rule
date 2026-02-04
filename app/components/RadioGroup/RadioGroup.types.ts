export interface RadioOption {
  value: string;
  label: string;
  subtext?: string;
  ariaLabel?: string;
}

import type { ModeValue, StateValue } from "../../../lib/propNormalization";

export interface RadioGroupProps {
  name?: string;
  value?: string;
  onChange?: (_data: { value: string }) => void;
  /**
   * Mode variant. Accepts both "standard"/"Standard" and "inverse"/"Inverse" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  mode?: ModeValue;
  /**
   * Visual state. Accepts "default"/"Default", "hover"/"Hover", "focus"/"Focus" (case-insensitive).
   * Figma also supports "With Subtext" state, which is handled via RadioOption.subtext.
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue | "With Subtext" | "with subtext";
  disabled?: boolean;
  options?: RadioOption[];
  className?: string;
  "aria-label"?: string;
}

export interface RadioGroupViewProps {
  groupId: string;
  value?: string;
  mode: "standard" | "inverse";
  state: "default" | "hover" | "focus";
  disabled: boolean;
  options: RadioOption[];
  className: string;
  ariaLabel?: string;
  onOptionChange: (_optionValue: string) => void;
}
