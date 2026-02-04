export interface CheckboxOption {
  value: string;
  label: string;
  subtext?: string;
  ariaLabel?: string;
}

export interface CheckboxGroupProps {
  name?: string;
  value?: string[];
  onChange?: (_data: { value: string[] }) => void;
  mode?: "standard" | "inverse";
  disabled?: boolean;
  options?: CheckboxOption[];
  className?: string;
  "aria-label"?: string;
}

export interface CheckboxGroupViewProps {
  groupId: string;
  value: string[];
  mode: "standard" | "inverse";
  disabled: boolean;
  options: CheckboxOption[];
  className: string;
  ariaLabel?: string;
  onOptionChange: (_optionValue: string, _checked: boolean) => void;
}
