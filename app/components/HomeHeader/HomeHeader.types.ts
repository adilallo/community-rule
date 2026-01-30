export interface HomeHeaderProps {
  // Currently no props, but keeping interface for future extensibility
}

export interface HomeHeaderViewProps {
  pathname: string;
  schemaData: object;
  navigationItems: Array<{
    label: string;
    href: string;
    isActive: boolean;
  }>;
  avatarImages: Array<{
    src: string;
    alt: string;
  }>;
  logoConfig: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}
