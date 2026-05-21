import type { StatShapeVariant } from "../../asset/Shapes";

export interface StatItem {
  value: string;
  label: string;
  asOf?: string;
  shapeVariant?: StatShapeVariant;
}

export interface StatsProps {
  titlePrefix?: string;
  titleEmphasis?: string;
  titleSuffix?: string;
  items: StatItem[];
  className?: string;
}

export interface StatsViewProps extends StatsProps {
  headingId: string;
}
