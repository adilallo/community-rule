export interface RadioOption {
  value: string;
  label: string;
  subtext?: string;
  ariaLabel?: string;
}

import type { ModeValue, StateValue } from "../../../../lib/propNormalization";

export interface RadioGroupProps {
  name?: string;
  value?: string;
  onChange?: (_data: { value: string }) => void;
  /**
   * Mode variant.
   */
  mode?: ModeValue;
  /**
   * Visual state.
   * Figma also supports "With Subtext" state, which is handled via RadioOption.subtext.
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
  state: "default" | "hover" | "focus" | "selected";
  disabled: boolean;
  options: RadioOption[];
  className: string;
  ariaLabel?: string;
  onOptionChange: (_optionValue: string) => void;
}
