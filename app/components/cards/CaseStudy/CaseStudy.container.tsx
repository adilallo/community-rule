"use client";

import { memo } from "react";
import CaseStudyView from "./CaseStudy.view";
import type { CaseStudyProps } from "./CaseStudy.types";

/**
 * Figma: Section org lockup ([22112-871524](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22112-871524)): **Card / CaseStudy** — MAC vector (`assets/case-study/`), FNB/BCSM rasters (**21993‑32352** / **32353**).
 */
const CaseStudyContainer = memo<CaseStudyProps>((props) => {
  return <CaseStudyView {...props} />;
});

CaseStudyContainer.displayName = "CaseStudy";

export default CaseStudyContainer;
