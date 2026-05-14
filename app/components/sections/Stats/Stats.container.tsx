"use client";

import { memo, useId } from "react";
import StatsView from "./Stats.view";
import type { StatsProps } from "./Stats.types";

/**
 * Figma: "Sections / Stats" (22132-889500; mobile frame 22137-891194).
 */
const StatsContainer = memo<StatsProps>((props) => {
  const headingId = useId();

  return <StatsView {...props} headingId={headingId} />;
});

StatsContainer.displayName = "Stats";

export default StatsContainer;
