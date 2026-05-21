/** Labeled paragraph group (Figma “Text” stacks under Membership / Decision-making, etc.). */
export interface CommunityRuleLabeledBlock {
  label: string;
  /** With {@link imageUrl}, optional caption paragraphs only (not the uploaded file name). */
  body: string;
  /** Image URL (e.g. custom method upload). Rendered as `<img>` when set. */
  imageUrl?: string;
  /** Non-image attachment URL. Rendered as a link when set and {@link imageUrl} is absent. */
  fileUrl?: string;
}

export interface CommunityRuleEntry {
  title: string;
  /** Plain text; split on blank lines into paragraphs when rendering. */
  body: string;
  /**
   * When set, rendered as Figma-style label + body stacks. If non-empty, takes
   * precedence over {@link body} for main content (body may be empty).
   */
  blocks?: CommunityRuleLabeledBlock[];
}

export interface CommunityRuleSection {
  categoryName: string;
  entries: CommunityRuleEntry[];
}

export interface CommunityRuleProps {
  sections: CommunityRuleSection[];
  className?: string;
  /** When true, wrap in white background with left accent bar (small breakpoint). */
  useCardStyle?: boolean;
  /**
   * Accent bar color when {@link useCardStyle} is true; should match the page
   * surface behind the card (defaults to create-flow teal).
   */
  cardAccentColor?: string;
}
