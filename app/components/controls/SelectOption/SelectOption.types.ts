export type SelectOptionSizeValue = "small" | "medium" | "large";

export interface SelectOptionProps {
  children?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (
    _e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  /**
   * Select option size.
   */
  size?: SelectOptionSizeValue;
}

export interface SelectOptionViewProps {
  children?: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  className: string;
  itemClasses: string;
  handleClick: (_e: React.MouseEvent<HTMLDivElement>) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLDivElement>) => void;
}
