import type { ChipStateValue, ChipSizeValue } from "../../../lib/propNormalization";

export interface ChipOption {
  id: string;
  label: string;
  state?: ChipStateValue;
}

export type MultiSelectSizeValue = "S" | "M" | "s" | "m";

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
   * Size variant: "S" (small) or "M" (medium)
   * Accepts both uppercase (Figma) and lowercase values.
   */
  size?: MultiSelectSizeValue;
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
   * Show the add button
   */
  showAddButton?: boolean;
  /**
   * Text for the add button
   */
  addButtonText?: string;
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
  options: ChipOption[];
  onChipClick?: (chipId: string) => void;
  onAddClick?: () => void;
  showAddButton: boolean;
  addButtonText: string;
  onCustomChipConfirm?: (chipId: string, value: string) => void;
  onCustomChipClose?: (chipId: string) => void;
  className: string;
}
