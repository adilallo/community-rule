"use client";

import { memo } from "react";
import UseCasesOrgsView from "./UseCasesOrgs.view";
import type { UseCasesOrgsProps } from "./UseCasesOrgs.types";

/**
 * Figma: **Orgs** instance ([21993-33687](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21993-33687&m=dev)) —
 * **305×305** `CaseStudy` tiles, **8px** gap, **24px** horizontal / **48px** bottom inset.
 */
const UseCasesOrgsContainer = memo<UseCasesOrgsProps>((props) => {
  return <UseCasesOrgsView {...props} />;
});

UseCasesOrgsContainer.displayName = "UseCasesOrgs";

export default UseCasesOrgsContainer;
