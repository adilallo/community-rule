import type { ReactNode } from "react";

export type AccordionSizeValue = "s" | "m" | "l";

export interface AccordionProps {
  title: string;
  subhead?: string;
  children?: ReactNode;
  size?: AccordionSizeValue;
  /**
   * From `lg` up, use this size’s header / type / panel styles (e.g. FAQ: `s` + `lgSize="m"`).
   */
  lgSize?: AccordionSizeValue;
  /**
   * From `xl` up, override with this size (e.g. FAQ: `xlSize="l"` at wide desktop — Figma **22135:890328**).
   */
  xlSize?: AccordionSizeValue;
  defaultOpen?: boolean;
  className?: string;
}

export interface AccordionViewProps {
  title: string;
  subhead?: string;
  children?: ReactNode;
  size: AccordionSizeValue;
  lgSize?: AccordionSizeValue;
  xlSize?: AccordionSizeValue;
  isOpen: boolean;
  panelId: string;
  buttonId: string;
  onToggle: () => void;
  className: string;
}
