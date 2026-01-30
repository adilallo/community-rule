export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  label?: string;
  checked?: boolean;
  onChange?: (
    _e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onFocus?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  state?: "default" | "hover" | "focus";
  showIcon?: boolean;
  showText?: boolean;
  icon?: string;
  text?: string;
  className?: string;
}

export interface ToggleViewProps {
  toggleId: string;
  labelId: string;
  checked: boolean;
  disabled: boolean;
  state: "default" | "hover" | "focus";
  label?: string;
  showIcon: boolean;
  showText: boolean;
  icon: string;
  text: string;
  className: string;
  containerClasses: string;
  labelClasses: string;
  toggleClasses: string;
  onClick: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLButtonElement>) => void;
}
