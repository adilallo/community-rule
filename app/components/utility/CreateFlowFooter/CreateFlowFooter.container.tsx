"use client";

import { memo } from "react";
import { CreateFlowFooterView } from "./CreateFlowFooter.view";
import type { CreateFlowFooterProps } from "./CreateFlowFooter.types";

const CreateFlowFooterContainer = memo<CreateFlowFooterProps>(
  ({ secondButton, progressBar = true, className = "" }) => {
    return (
      <CreateFlowFooterView
        secondButton={secondButton}
        progressBar={progressBar}
        className={className}
      />
    );
  },
);

CreateFlowFooterContainer.displayName = "CreateFlowFooter";

export default CreateFlowFooterContainer;
