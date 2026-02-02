import type { ReactNode } from "react";

export interface AlertProps {
  title: string;
  description?: string;
  status?: "default" | "positive" | "warning" | "danger";
  type?: "toast" | "banner";
  onClose?: () => void;
  className?: string;
}

export interface AlertViewProps {
  title: string;
  description?: string;
  status: "default" | "positive" | "warning" | "danger";
  type: "toast" | "banner";
  className: string;
  containerClasses: string;
  containerStyle?: React.CSSProperties;
  titleClasses: string;
  descriptionClasses: string;
  iconColor: string;
  closeButtonClasses: string;
  closeButtonIconColor: string;
  onClose?: () => void;
}
