/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
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
/* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars */