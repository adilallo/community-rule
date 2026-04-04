"use client";

import { memo } from "react";
import DecisionMakingSidebarView from "./DecisionMakingSidebar.view";
import type { DecisionMakingSidebarProps } from "./DecisionMakingSidebar.types";
import {
  normalizeHeaderLockupJustification,
  normalizeHeaderLockupSize,
} from "../../../../lib/propNormalization";

const DecisionMakingSidebarContainer = memo<DecisionMakingSidebarProps>(
  ({
    title,
    description,
    messageBoxTitle,
    messageBoxItems,
    messageBoxCheckedIds,
    onMessageBoxCheckboxChange,
    size: sizeProp = "L",
    justification: justificationProp = "left",
    className = "",
  }) => {
    const size = normalizeHeaderLockupSize(sizeProp);
    const justification = normalizeHeaderLockupJustification(justificationProp);

    return (
      <DecisionMakingSidebarView
        title={title}
        description={description}
        messageBoxTitle={messageBoxTitle}
        messageBoxItems={messageBoxItems}
        messageBoxCheckedIds={messageBoxCheckedIds}
        onMessageBoxCheckboxChange={onMessageBoxCheckboxChange}
        size={size}
        justification={justification}
        className={className}
      />
    );
  },
);

DecisionMakingSidebarContainer.displayName = "DecisionMakingSidebar";

export default DecisionMakingSidebarContainer;
