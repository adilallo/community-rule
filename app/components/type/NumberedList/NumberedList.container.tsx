"use client";

import { memo } from "react";
import NumberedListView from "./NumberedList.view";
import type { NumberedListProps } from "./NumberedList.types";
import { normalizeNumberedListSize } from "../../../../lib/propNormalization";

const NumberedListContainer = memo<NumberedListProps>(
  ({ items, size: sizeProp = "M" }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeNumberedListSize(sizeProp);

    return <NumberedListView items={items} size={size} />;
  },
);

NumberedListContainer.displayName = "NumberedList";

export default NumberedListContainer;
