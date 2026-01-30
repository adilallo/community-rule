export interface LogoWallProps {
  logos?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    size?: string;
    order?: string;
  }>;
  className?: string;
}

export interface LogoWallViewProps {
  isVisible: boolean;
  displayLogos: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    size?: string;
    order?: string;
  }>;
  className: string;
}
