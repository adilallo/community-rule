"use client";

import { memo } from "react";
import { ListEntryView } from "./ListEntry.view";
import type { ListEntryProps } from "./ListEntry.types";

/**
 * Figma: "Base / Interactive" (21844:4118). Single list row: optional top rule,
 * leading icon, title, optional description, chevron, optional bottom rule.
 */
const ListEntryContainer = memo<ListEntryProps>((props) => {
  return <ListEntryView {...props} />;
});

ListEntryContainer.displayName = "ListEntry";

export default ListEntryContainer;
