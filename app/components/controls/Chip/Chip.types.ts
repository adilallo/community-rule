import type {
  ChipPaletteValue,
  ChipSizeValue,
  ChipStateValue,
} from "../../../../lib/propNormalization";

export interface ChipProps {
  label: string;
  /**
   * Visual state of the chip:
   * - "unselected"
   * - "selected"
   * - "disabled"
   * - "custom" (editable chips with check/close buttons)
   */
  state?: ChipStateValue;
  /**
   * Palette of the chip:
   * - "default"
   * - "inverse"
   */
  palette?: ChipPaletteValue;
  /**
   * Size of the chip:
   * - "s"
   * - "m"
   */
  size?: ChipSizeValue;
  className?: string;
  /**
   * Whether the chip should be non-interactive. Defaults to `true` when
   * `state === "disabled"` to preserve historical behavior. Pass
   * `disabled={false}` alongside `state="disabled"` to render the dimmed
   * "disabled" visual while keeping the chip clickable — useful for toggle
   * groups where the unselected state is the disabled visual.
   */
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
