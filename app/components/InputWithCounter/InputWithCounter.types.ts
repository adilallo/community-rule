export interface InputWithCounterProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  showHelpIcon?: boolean;
  className?: string;
  inputClassName?: string;
}
