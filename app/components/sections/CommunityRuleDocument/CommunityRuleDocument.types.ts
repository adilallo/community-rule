export interface CommunityRuleDocumentEntry {
  title: string;
  body: string;
}

export interface CommunityRuleDocumentSection {
  categoryName: string;
  entries: CommunityRuleDocumentEntry[];
}

export interface CommunityRuleDocumentProps {
  sections: CommunityRuleDocumentSection[];
  className?: string;
  /** When true, wrap in white background with left teal bar (small breakpoint). */
  useCardStyle?: boolean;
}
