export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onChange?: (
    _e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onFocus?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLButtonElement>) => void;
  state?: "default" | "hover" | "focus";
  label?: string;
  className?: string;
}

export interface SwitchViewProps {
  switchId: string;
  checked: boolean;
  state: "default" | "hover" | "focus";
  label?: string;
  className: string;
  switchClasses: string;
  trackClasses: string;
  thumbClasses: string;
  labelClasses: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLButtonElement>) => void;
}
