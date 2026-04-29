/** Labeled paragraph group (Figma “Text” stacks under Membership / Decision-making, etc.). */
export interface CommunityRuleLabeledBlock {
  label: string;
  body: string;
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
  /** When true, wrap in white background with left teal bar (small breakpoint). */
  useCardStyle?: boolean;
}
