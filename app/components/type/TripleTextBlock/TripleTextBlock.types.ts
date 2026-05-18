export interface TripleTextBlockColumn {
  title: string;
  description: string;
  /** Optional second paragraph under `description` (e.g. use cases baseline multi-paragraph lockup). */
  descriptionSecondary?: string;
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
  /**
   * `useCases`: Figma use cases TripleText **`lg`** ([22037-26994](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22037-26994&m=dev));
   * **`xl`** ([22085-860414](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-860414&m=dev));
   * `md` ([22085-862437](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-862437&m=dev)); lg 3-col **22128-888715**.
   */
  layoutPreset?: "default" | "useCases";
}

export interface TripleTextBlockViewProps extends TripleTextBlockProps {
  headingId: string;
}
