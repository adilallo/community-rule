"use client";

import { memo } from "react";
import { TagView } from "./Tag.view";
import type { TagProps } from "./Tag.types";

const DEFAULT_LABELS: Record<TagProps["variant"], string> = {
  recommended: "RECOMMENDED",
  selected: "SELECTED",
  templateRecommended: "RECOMMENDED",
};

/**
 * Figma: "Utility / Tag". Small status pill (e.g. "RECOMMENDED"
 * or "SELECTED") used to annotate cards and options.
 */
const TagContainer = memo<TagProps>(({ variant, children, className = "" }) => {
  const content = children ?? DEFAULT_LABELS[variant];
  return (
    <TagView variant={variant} className={className}>
      {content}
    </TagView>
  );
});

TagContainer.displayName = "Tag";

export default TagContainer;
