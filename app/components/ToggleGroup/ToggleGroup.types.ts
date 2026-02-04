import type { StateValue } from "../../../lib/propNormalization";

export type ToggleGroupPositionValue = "left" | "middle" | "right" | "Left" | "Middle" | "Right";

export interface ToggleGroupProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  children?: React.ReactNode;
  className?: string;
  /**
   * Toggle group position. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  position?: ToggleGroupPositionValue;
  /**
   * Visual state. Accepts "default"/"Default", "hover"/"Hover", "focus"/"Focus", "selected"/"Selected" (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  state?: StateValue | "selected" | "Selected";
  showText?: boolean;
  ariaLabel?: string;
  onChange?: (
    _e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onFocus?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
}

export interface ToggleGroupViewProps {
  groupId: string;
  children?: React.ReactNode;
  className: string;
  position: "left" | "middle" | "right";
  state: "default" | "hover" | "focus" | "selected";
  showText: boolean;
  ariaLabel?: string;
  toggleClasses: string;
  onClick: (_e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur: (_e: React.FocusEvent<HTMLButtonElement>) => void;
}
