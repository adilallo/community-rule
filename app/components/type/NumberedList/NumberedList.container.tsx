"use client";

/**
 * Figma: "Type / Numbered List" (see registry)
 */

import { memo } from "react";
import NumberedListView from "./NumberedList.view";
import type { NumberedListProps } from "./NumberedList.types";

const NumberedListContainer = memo<NumberedListProps>(
  ({ items, size: sizeProp = "M" }) => {
    const size = sizeProp;

    return <NumberedListView items={items} size={size} />;
  },
);

NumberedListContainer.displayName = "NumberedList";

export default NumberedListContainer;
