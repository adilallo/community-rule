"use client";

import { memo, useId } from "react";
import TripleTextBlockView from "./TripleTextBlock.view";
import type { TripleTextBlockProps } from "./TripleTextBlock.types";

/**
 * Figma: "Type / TripleTextBlock" stacked 22137:890676; lg 22128:888715; xl 22135:889705.
 */
const TripleTextBlockContainer = memo<TripleTextBlockProps>((props) => {
  const headingId = useId();

  return <TripleTextBlockView {...props} headingId={headingId} />;
});

TripleTextBlockContainer.displayName = "TripleTextBlock";

export default TripleTextBlockContainer;
