export interface IncrementerProps {
  value: number;
  /** Minimum value (default `-Infinity`). */
  min?: number;
  /** Maximum value (default `Infinity`). */
  max?: number;
  /** Step size applied to +/- actions (default `1`). */
  step?: number;
  onChange: (_next: number) => void;
  /**
   * Optional formatter for the displayed value. Receives the raw number and
   * should return the rendered content. Default: `String(value)`.
   */
  formatValue?: (_value: number) => React.ReactNode;
  /**
   * When true, the whole incrementer is non-interactive and the value renders
   * in the "inactive" (tertiary) color per Figma.
   */
  disabled?: boolean;
  /** Accessible label for the decrement button (default "Decrease"). */
  decrementAriaLabel?: string;
  /** Accessible label for the increment button (default "Increase"). */
  incrementAriaLabel?: string;
  className?: string;
}

export interface IncrementerViewProps {
  displayValue: React.ReactNode;
  disabled: boolean;
  atMin: boolean;
  atMax: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementAriaLabel: string;
  incrementAriaLabel: string;
  className: string;
}
