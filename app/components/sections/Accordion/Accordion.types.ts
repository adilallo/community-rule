import type { AccordionSizeValue } from "../../layout/Accordion";

export interface FaqAccordionItem {
  title: string;
  answer: string;
  subhead?: string;
}

export interface FaqAccordionProps {
  title: string;
  items: FaqAccordionItem[];
  size?: AccordionSizeValue;
  /** Layout accordion size from `lg` (default **m**, Figma 22135-890258). */
  lgSize?: AccordionSizeValue;
  /** Layout accordion size from `xl` (default **l**, Figma 22135:890328 Large). */
  xlSize?: AccordionSizeValue;
  className?: string;
}

export interface FaqAccordionViewProps extends FaqAccordionProps {
  headingId: string;
  size: AccordionSizeValue;
  lgSize: AccordionSizeValue;
  xlSize: AccordionSizeValue;
}
