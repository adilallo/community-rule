"use client";

/**
 * Figma: Community Rule System — "Add Custom Field/Popover" (List-item/lockup)
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=20887-175710
 */
import { memo } from "react";
import { ListItemView } from "./ListItem.view";
import type { ListItemProps } from "./ListItem.types";

const ListItem = memo<ListItemProps>((props) => {
  return <ListItemView {...props} />;
});

ListItem.displayName = "ListItem";

export default ListItem;
