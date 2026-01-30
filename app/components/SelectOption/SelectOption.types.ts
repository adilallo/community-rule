export interface SelectOptionProps {
  children?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (
    _e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  size?: "small" | "medium" | "large";
}

export interface SelectOptionViewProps {
  children?: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  className: string;
  itemClasses: string;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
