import type { ModeValue, StateValue } from "../../../lib/propNormalization";

export interface RadioButtonProps {
  checked?: boolean;
  /**
   * Mode variant. Accepts both "standard"/"Standard" and "inverse"/"Inverse" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  mode?: ModeValue;
  /**
   * Visual state. Accepts "default"/"Default", "hover"/"Hover", "focus"/"Focus", "selected"/"Selected" (case-insensitive).
   * Note: "selected" state is represented by the `checked` prop in practice.
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue;
  /**
   * Whether to show the indicator dot. From Figma specification.
   */
  indicator?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (_data: { checked: boolean; value?: string }) => void;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
}

export interface RadioButtonViewProps {
  radioId: string;
  checked: boolean;
  mode: "standard" | "inverse";
  state: "default" | "hover" | "focus" | "selected";
  disabled: boolean;
  label?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className: string;
  combinedBoxStyles: string;
  labelColor: string;
  onToggle: (_e: React.MouseEvent | React.KeyboardEvent) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLSpanElement>) => void;
}
