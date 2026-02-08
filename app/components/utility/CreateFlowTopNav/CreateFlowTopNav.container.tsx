"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { CreateFlowTopNavView } from "./CreateFlowTopNav.view";
import type { CreateFlowTopNavProps } from "./CreateFlowTopNav.types";

const CreateFlowTopNavContainer = memo<CreateFlowTopNavProps>(
  ({
    hasShare = false,
    hasExport = false,
    hasEdit = false,
    loggedIn = false,
    onShare,
    onExport,
    onEdit,
    onExit,
    className = "",
  }) => {
    const router = useRouter();

    const handleExit = () => {
      if (onExit) {
        onExit();
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
        loggedIn={loggedIn}
        onShare={onShare}
        onExport={onExport}
        onEdit={onEdit}
        onExit={handleExit}
        className={className}
      />
    );
  },
);

CreateFlowTopNavContainer.displayName = "CreateFlowTopNav";

export default CreateFlowTopNavContainer;
