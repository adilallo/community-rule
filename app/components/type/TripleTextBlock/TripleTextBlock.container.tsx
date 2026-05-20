"use client";

import { memo, useId } from "react";
import TripleTextBlockView from "./TripleTextBlock.view";
import type { TripleTextBlockProps } from "./TripleTextBlock.types";

/**
 * Figma: "Type / TripleTextBlock" — use cases **`lg` 22037-26994**, **`xl` 22085-860414**;
 * baseline **22112-871529**; **`md` 22085-862437**; stacked 22137:890676; lg 22128:888715; xl 22135:889705 (default).
 */
const TripleTextBlockContainer = memo<TripleTextBlockProps>((props) => {
  const headingId = useId();

  return <TripleTextBlockView {...props} headingId={headingId} />;
});

TripleTextBlockContainer.displayName = "TripleTextBlock";

export default TripleTextBlockContainer;
