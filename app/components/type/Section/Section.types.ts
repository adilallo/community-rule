import type { ReactNode } from "react";

export interface SectionProps {
  /** Category label (16px medium, invert secondary). */
  categoryName: string;
  /** When true, renders the 12px-gapped vertical rail like Figma Section (22002:30757). */
  showRail?: boolean;
  children: ReactNode;
  className?: string;
}
