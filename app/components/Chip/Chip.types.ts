import type {
  ChipPaletteValue,
  ChipSizeValue,
  ChipStateValue,
} from "../../../lib/propNormalization";

export interface ChipProps {
  label: string;
  /**
   * Visual state of the chip, aligned with Figma:
   * - "Unselected"
   * - "Selected"
   * - "Disabled"
   * - "Custom" (editable chips with check/close buttons)
   *
   * Accepts both PascalCase (Figma) and lowercase values.
   */
  state?: ChipStateValue;
  /**
   * Palette of the chip, aligned with Figma:
   * - "Default"
   * - "Inverse"
   *
   * Accepts both PascalCase (Figma) and lowercase values.
   */
  palette?: ChipPaletteValue;
  /**
   * Size of the chip, aligned with Figma:
   * - "S"
   * - "M"
   *
   * Accepts both uppercase (Figma) and lowercase values.
   */
  size?: ChipSizeValue;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Optional remove/close handler for chips that can be dismissed.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Optional check/confirm handler for custom state chips.
   * Called with the input value when user confirms the input.
   */
  onCheck?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Optional callback when custom chip is closed/removed.
   */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}

export interface ChipViewProps {
  label: string;
  state: "unselected" | "selected" | "disabled" | "custom";
  palette: "default" | "inverse";
  size: "s" | "m";
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCheck?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  ariaLabel?: string;
}

