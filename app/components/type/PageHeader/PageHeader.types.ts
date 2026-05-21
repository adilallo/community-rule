export interface PageHeaderProps {
  /** Single line or stacked lines inside one `<h1>` (matches Figma line breaks when centered). */
  title: string | readonly string[];
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  /** `center` stacks and centers the headline (Section/PageHeader minimal / use cases). */
  headingAlign?: "start" | "center";
  /**
   * Section/PageHeader minimal density ([22085-862431](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-862431&m=dev)):
   * md+ **52px** display type and **56px** vertical padding (with **64px** horizontal).
   */
  sectionMinimal?: boolean;
  /**
   * When `title` is multiple lines, use one centered line from **`lg`** ([21004-24825](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21004-24825&m=dev)).
   */
  singleLineTitleFromLg?: boolean;
  titleId?: string;
  className?: string;
}

export type PageHeaderViewProps = Omit<PageHeaderProps, "titleId"> & {
  titleId: string;
};
