/** One row in the section grid; rendered with `cards/Step`. */
export interface CardStepsItem {
  text: string;
  iconShape?: string;
  iconColor?: string;
}

export interface CardStepsProps {
  title: string;
  subtitle: string;
  steps: CardStepsItem[];
  /** Large-screen heading split: line 1–3 (e.g. How / CommunityRule / helps). */
  headingDesktopLines?: readonly [string, string, string];
}

export interface CardStepsViewProps extends CardStepsProps {
  schemaJson: string;
}
