"use client";

import { memo } from "react";
import { ListView } from "./List.view";
import type { ListProps } from "./List.types";

/**
 * Figma: "List Edit" list frame — S (21863:45631), M (21863:45493), L (21844:4405).
 * Composes {@link ListEntry} rows with a shared list-level top rule when enabled.
 */
const ListContainer = memo<ListProps>((props) => {
  return <ListView {...props} />;
});

ListContainer.displayName = "List";

export default ListContainer;
