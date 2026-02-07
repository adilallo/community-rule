export type SelectOptionSizeValue = "small" | "medium" | "large" | "Small" | "Medium" | "Large";

export interface SelectOptionProps {
  children?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (
    _e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  /**
   * Select option size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
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
