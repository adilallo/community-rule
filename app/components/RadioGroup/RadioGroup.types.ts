export interface RadioOption {
  value: string;
  label: string;
  subtext?: string;
  ariaLabel?: string;
}

export interface RadioGroupProps {
  name?: string;
  value?: string;
  onChange?: (_data: { value: string }) => void;
  mode?: "standard" | "inverse";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  options?: RadioOption[];
  className?: string;
  "aria-label"?: string;
}

export interface RadioGroupViewProps {
  groupId: string;
  value?: string;
  mode: "standard" | "inverse";
  state: "default" | "hover" | "focus";
  disabled: boolean;
  options: RadioOption[];
  className: string;
  ariaLabel?: string;
  onOptionChange: (_optionValue: string) => void;
}
