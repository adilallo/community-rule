"use client";

import { memo, useId } from "react";
import GroupsView from "./Groups.view";
import type { GroupsProps } from "./Groups.types";

/**
 * Figma: **Section** instance [**22085-860411**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-860411&m=dev) (`xl`: **Scale/160** horizontal padding);
 * Card group ref [**22084-859062**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22084-859062&m=dev); legacy **22084-859470**.
 */
const GroupsContainer = memo<GroupsProps>(({ title, items, className = "" }) => {
  const reactId = useId();
  const headingId = `${reactId}-groups-heading`;

  return (
    <GroupsView
      title={title}
      items={items}
      headingId={headingId}
      className={className}
    />
  );
});

GroupsContainer.displayName = "Groups";

export default GroupsContainer;
