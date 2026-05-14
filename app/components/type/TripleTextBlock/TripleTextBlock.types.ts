export interface TripleTextBlockColumn {
  title: string;
  description: string;
  /**
   * lg+ three-column layout (Figma 22128:888715). When either `lgTitle` or `lgDescription`
   * is set, stacked breakpoints use `title`/`description` and lg uses these (missing side falls back).
   */
  lgTitle?: string;
  lgDescription?: string;
}

export interface TripleTextBlockProps {
  /** Section heading above the column stack (e.g. About page). Omit when matching a headerless Figma frame. */
  title?: string;
  columns: TripleTextBlockColumn[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export interface TripleTextBlockViewProps extends TripleTextBlockProps {
  headingId: string;
}
