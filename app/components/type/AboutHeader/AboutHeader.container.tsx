"use client";

import { memo, useId } from "react";
import AboutHeaderView from "./AboutHeader.view";
import type { AboutHeaderProps } from "./AboutHeader.types";

/**
 * Figma: "Type / AboutHeader" (22135-889654).
 */
const AboutHeaderContainer = memo<AboutHeaderProps>((props) => {
  const titleId = useId();

  return <AboutHeaderView {...props} titleId={titleId} />;
});

AboutHeaderContainer.displayName = "AboutHeader";

export default AboutHeaderContainer;
