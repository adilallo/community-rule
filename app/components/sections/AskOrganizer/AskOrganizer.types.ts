import type React from "react";

export type AskOrganizerVariant =
  | "centered"
  | "left-aligned"
  | "compact"
  | "inverse"
  | "Centered"
  | "Left-Aligned"
  | "Compact"
  | "Inverse";

export interface AskOrganizerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  /**
   * Ask organizer variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  variant?: AskOrganizerVariant;
  onContactClick?: (_data: {
    event: string;
    component: string;
    variant: string;
    buttonText: string;
    buttonHref: string;
    timestamp: string;
  }) => void;
}

export interface AskOrganizerViewProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  className: string;
  sectionPadding: string;
  contentGap: string;
  buttonContainerClass: string;
  variant: AskOrganizerVariant;
  labelledBy?: string;
  onContactClick: (
    _event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
}
