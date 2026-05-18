"use client";

import { memo, useId } from "react";
import TripleStepView from "./TripleStep.view";
import type { TripleStepProps } from "./TripleStep.types";

/**
 * Figma: **Section / Triple Step** ([22084-859405](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22084-859405&m=dev)); type baseline ([22112-871527](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22112-871527&m=dev)); **md+** two-column + **`triple-step.svg`**.
 */
const TripleStepContainer = memo<TripleStepProps>((props) => {
  const reactId = useId();
  const headingId = `${reactId}-triple-step-heading`;

  return <TripleStepView {...props} headingId={headingId} />;
});

TripleStepContainer.displayName = "TripleStep";

export default TripleStepContainer;
