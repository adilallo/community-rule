"use client";

import { memo, useCallback, useId, useState } from "react";
import AccordionView from "./Accordion.view";
import type { AccordionProps, AccordionSizeValue } from "./Accordion.types";

/**
 * Figma: "Layout / Accordion" (21842-2813); Medium 22135-890258; optional `lgSize` / `xlSize` stacking (FAQ **s**→**m** `lg`; **l** `xl`, 22135-890328).
 */
const AccordionContainer = memo<AccordionProps>(
  ({
    title,
    subhead,
    children,
    size: sizeProp = "l",
    lgSize,
    xlSize,
    defaultOpen = false,
    className = "",
  }) => {
    const size: AccordionSizeValue = sizeProp;
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const panelId = useId();
    const buttonId = useId();

    const onToggle = useCallback(() => {
      setIsOpen((open) => !open);
    }, []);

    return (
      <AccordionView
        title={title}
        subhead={subhead}
        children={children}
        size={size}
        lgSize={lgSize}
        xlSize={xlSize}
        isOpen={isOpen}
        panelId={panelId}
        buttonId={buttonId}
        onToggle={onToggle}
        className={className}
      />
    );
  },
);

AccordionContainer.displayName = "Accordion";

export default AccordionContainer;
