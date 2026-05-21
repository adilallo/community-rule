"use client";

import { memo } from "react";
import StatView from "./Stat.view";
import type { StatProps } from "./Stat.types";

const StatContainer = memo<StatProps>(
  ({ shapeVariant: shapeVariantProp = "yellow", ...props }) => {
    return <StatView {...props} shapeVariant={shapeVariantProp} />;
  },
);

StatContainer.displayName = "Stat";

export default StatContainer;
