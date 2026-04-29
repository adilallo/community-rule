import type { CommunityRuleLabeledBlock } from "../CommunityRule/CommunityRule.types";

export interface TextBlockProps {
  /** Figma X Small/Heading — entry title (20px bold, 28px line). */
  title: string;
  /** Plain copy; blank-line splits become paragraphs when `rows` is absent. */
  body?: string;
  /** Figma labeled stacks (14px medium label + 14px body). Overrides plain `body` when non-empty. */
  rows?: CommunityRuleLabeledBlock[];
  className?: string;
}
