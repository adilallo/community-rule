import type React from "react";

export type AskOrganizerVariant =
  | "centered"
  | "left-aligned"
  | "compact"
  | "inverse"
  | "use-case-detail";

export interface AskOrganizerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  /**
   * Ask organizer variant.
   */
  variant?: AskOrganizerVariant;
  onContactClick?: (_data: {
    event: string;
    component: string;
    variant: string;
    buttonText: string;
    timestamp: string;
  }) => void;
}

export interface AskOrganizerViewProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  ctaAriaLabel: string;
  className: string;
  sectionPadding: string;
  contentGap: string;
  buttonContainerClass: string;
  variant: AskOrganizerVariant;
  labelledBy?: string;
  onContactClick: (
    _event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
}
