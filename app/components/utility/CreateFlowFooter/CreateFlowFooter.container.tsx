"use client";

import { memo } from "react";
import { CreateFlowFooterView } from "./CreateFlowFooter.view";
import type { CreateFlowFooterProps } from "./CreateFlowFooter.types";

const CreateFlowFooterContainer = memo<CreateFlowFooterProps>(
  ({ secondButton, progressBar = true, onBackClick, className = "" }) => {
    return (
      <CreateFlowFooterView
        secondButton={secondButton}
        progressBar={progressBar}
        onBackClick={onBackClick}
        className={className}
      />
    );
  },
);

CreateFlowFooterContainer.displayName = "CreateFlowFooter";

export default CreateFlowFooterContainer;
