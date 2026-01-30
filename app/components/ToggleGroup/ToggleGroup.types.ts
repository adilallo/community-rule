export interface ToggleGroupProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  children?: React.ReactNode;
  className?: string;
  position?: "left" | "middle" | "right";
  state?: "default" | "hover" | "focus" | "selected";
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
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLButtonElement>) => void;
}
