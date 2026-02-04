import type { ReactNode } from "react";

export interface SelectOptionData {
  value: string;
  label: string;
}

export interface SelectInputProps {
  id?: string;
  label?: string;
  labelVariant?: "default" | "horizontal";
  size?: "small" | "medium" | "large";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  value?: string;
  onChange?: (_data: { target: { value: string; text: string } }) => void;
  options?: SelectOptionData[];
}
