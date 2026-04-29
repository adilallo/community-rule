"use client";

import { memo } from "react";
import { CreateFlowFooterView } from "./CreateFlowFooter.view";
import type { CreateFlowFooterProps } from "./CreateFlowFooter.types";

/**
 * Figma: "Utility / CreateFlowFooter". Sticky footer for the
 * create flow with a back action, optional secondary button, and progress bar.
 */
const CreateFlowFooterContainer = memo<CreateFlowFooterProps>(
  ({
    secondButton,
    progressBar = true,
    proportionBarProgress,
    proportionBarVariant,
    onBackClick,
    className = "",
  }) => {
    return (
      <CreateFlowFooterView
        secondButton={secondButton}
        progressBar={progressBar}
        proportionBarProgress={proportionBarProgress}
        proportionBarVariant={proportionBarVariant}
        onBackClick={onBackClick}
        className={className}
      />
    );
  },
);

CreateFlowFooterContainer.displayName = "CreateFlowFooter";

export default CreateFlowFooterContainer;
