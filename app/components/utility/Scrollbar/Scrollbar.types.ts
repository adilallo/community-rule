import type { ReactNode } from "react";

export interface ScrollbarProps {
  /** Content to scroll. */
  children: ReactNode;
  /** Optional class name merged with scrollbar-design. */
  className?: string;
  /** Vertical scroll only, horizontal only, or both. @default "vertical" */
  orientation?: "vertical" | "horizontal" | "both";
}
