import type { ReactNode } from "react";

export type PopoverProps = {
  id: string;
  menuAriaLabel: string;
  children: ReactNode;
  className?: string;
};
