export type AboutHeaderSegment =
  | { type: "word"; text: string }
  | { type: "icon"; icon: "arrow" | "about" };

export interface AboutHeaderProps {
  segments: AboutHeaderSegment[];
  className?: string;
}

export interface AboutHeaderViewProps extends AboutHeaderProps {
  titleId: string;
}
