export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface Feature {
  backgroundColor: string;
  labelLine1: string;
  labelLine2: string;
  panelContent: string;
  ariaLabel: string;
  href: string;
}

export interface FeatureGridViewProps extends FeatureGridProps {
  features: Feature[];
  labelledBy?: string;
}
