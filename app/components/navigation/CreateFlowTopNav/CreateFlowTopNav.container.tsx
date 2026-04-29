"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { CreateFlowTopNavView } from "./CreateFlowTopNav.view";
import type { CreateFlowTopNavProps } from "./CreateFlowTopNav.types";

/**
 * Figma: Utility / CreateFlowTopNav — wizard header (create-flow chrome).
 * Exit, optional share / export / edit; strings in `messages/en/create/topNav.json`.
 */
const CreateFlowTopNavContainer = memo<CreateFlowTopNavProps>(
  ({
    hasShare = false,
    hasExport = false,
    hasEdit = false,
    saveDraftOnExit = false,
    onShare,
    onExport,
    onEdit,
    onExit,
    buttonPalette,
    className = "",
  }) => {
    const router = useRouter();

    const handleExit = (options?: { saveDraft?: boolean }) => {
      if (onExit) {
        onExit(options);
      } else {
        // Default behavior: navigate to home
        router.push("/");
      }
    };

    return (
      <CreateFlowTopNavView
        hasShare={hasShare}
        hasExport={hasExport}
        hasEdit={hasEdit}
        saveDraftOnExit={saveDraftOnExit}
        onShare={onShare}
        onExport={onExport}
        onEdit={onEdit}
        onExit={handleExit}
        buttonPalette={buttonPalette}
        className={className}
      />
    );
  },
);

CreateFlowTopNavContainer.displayName = "CreateFlowTopNav";

export default CreateFlowTopNavContainer;
