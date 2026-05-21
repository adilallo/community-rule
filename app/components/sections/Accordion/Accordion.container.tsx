"use client";

import { memo, useId } from "react";
import FaqAccordionView from "./Accordion.view";
import type { FaqAccordionProps, FaqAccordionViewProps } from "./Accordion.types";
import type { AccordionSizeValue } from "../../layout/Accordion";

/**
 * Figma: "Sections / Accordion" (22130-889248). Rows: **s** / **m** at `lg` (22135-890258); **Large** (`l`) at `xl` (22135:890328).
 */
const FaqAccordionContainer = memo<FaqAccordionProps>(
  ({ size: sizeProp = "s", lgSize: lgSizeProp = "m", xlSize: xlSizeProp = "l", ...props }) => {
    const headingId = useId();
    const size: AccordionSizeValue = sizeProp;
    const lgSize: AccordionSizeValue = lgSizeProp;
    const xlSize: AccordionSizeValue = xlSizeProp;

    const viewProps: FaqAccordionViewProps = {
      ...props,
      size,
      lgSize,
      xlSize,
      headingId,
    };

    return <FaqAccordionView {...viewProps} />;
  },
);

FaqAccordionContainer.displayName = "FaqAccordion";

export default FaqAccordionContainer;
