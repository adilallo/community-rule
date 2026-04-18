export type ContextMenuItemSizeValue = "small" | "medium" | "large";

export interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  selected?: boolean;
  hasSubmenu?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (
    _e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  /**
   * Context menu item size.
   */
  size?: ContextMenuItemSizeValue;
}

export interface ContextMenuItemViewProps {
  children?: React.ReactNode;
  selected: boolean;
  hasSubmenu: boolean;
  disabled: boolean;
  className: string;
  itemClasses: string;
  handleClick: (_e: React.MouseEvent<HTMLDivElement>) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLDivElement>) => void;
}
