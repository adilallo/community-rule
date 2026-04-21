import type {
  ChipStateValue,
  ChipPaletteValue,
} from "../../../../lib/propNormalization";

export interface ChipOption {
  id: string;
  label: string;
  state?: ChipStateValue;
}

export type MultiSelectSizeValue = "s" | "m";

export interface MultiSelectProps {
  /**
   * Label for the multi-select component
   */
  label?: string;
  /**
   * Show help icon next to label
   */
  showHelpIcon?: boolean;
  /**
   * Size variant: "s" (small) or "m" (medium)
   */
  size?: MultiSelectSizeValue;
  /**
   * Palette for chips: "default" or "inverse"
   */
  palette?: ChipPaletteValue;
  /**
   * Array of chip options to display
   */
  options: ChipOption[];
  /**
   * Callback when a chip is clicked (toggled)
   */
  onChipClick?: (chipId: string) => void;
  /**
   * Callback when add button is clicked
   */
  onAddClick?: () => void;
  /**
   * Whether to show add button (Figma prop).
   * @default true
   */
  addButton?: boolean;
  /**
   * Text for the add button
   */
  addButtonText?: string;
  /**
   * Whether to show form header (label and help icon) above multi-select (Figma prop).
   * @default true
   */
  formHeader?: boolean;
  /**
   * Callback when a custom chip is confirmed (check button clicked)
   */
  onCustomChipConfirm?: (chipId: string, value: string) => void;
  /**
   * Callback when a custom chip is closed/removed
   */
  onCustomChipClose?: (chipId: string) => void;
  className?: string;
}

export interface MultiSelectViewProps {
  label?: string;
  showHelpIcon: boolean;
  size: "s" | "m";
  palette: "default" | "inverse";
  options: ChipOption[];
  onChipClick?: (chipId: string) => void;
  onAddClick?: () => void;
  addButton: boolean;
  addButtonText: string;
  formHeader: boolean;
  onCustomChipConfirm?: (chipId: string, value: string) => void;
  onCustomChipClose?: (chipId: string) => void;
  className: string;
}
