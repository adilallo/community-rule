import type React from "react";

export interface HomeHeaderProps {
  // Currently no props, but keeping interface for future extensibility
}

export type NavSize =
  | "default"
  | "xsmall"
  | "xsmallUseCases"
  | "home"
  | "homeMd"
  | "homeUseCases"
  | "large"
  | "largeUseCases"
  | "homeXlarge"
  | "xlarge";

export interface HomeHeaderViewProps {
  pathname: string;
  schemaData: object;
  navigationItems: Array<{
    href: string;
    text: string;
    extraPadding?: boolean;
  }>;
  avatarImages: Array<{
    src: string;
    alt: string;
  }>;
  logoConfig: Array<{
    breakpoint: string;
    size:
      | "default"
      | "homeHeaderXsmall"
      | "homeHeaderSm"
      | "homeHeaderMd"
      | "homeHeaderLg"
      | "homeHeaderXl"
      | "header"
      | "headerMd"
      | "headerLg"
      | "headerXl"
      | "footer"
      | "footerLg";
    showText: boolean;
  }>;
  renderNavigationItems: (size: NavSize) => React.ReactNode;
  renderAvatarGroup: (
    containerSize: "small" | "medium" | "large" | "xlarge",
    avatarSize: "small" | "medium" | "large" | "xlarge",
  ) => React.ReactNode;
  renderLoginButton: (size: NavSize) => React.ReactNode;
  renderCreateRuleButton: (
    buttonSize: "xsmall" | "small" | "medium" | "large" | "xlarge",
    containerSize: "small" | "medium" | "large" | "xlarge",
    avatarSize: "small" | "medium" | "large" | "xlarge",
  ) => React.ReactNode;
  renderLogo: (
    size:
      | "default"
      | "homeHeaderXsmall"
      | "homeHeaderSm"
      | "homeHeaderMd"
      | "homeHeaderLg"
      | "homeHeaderXl"
      | "header"
      | "headerMd"
      | "headerLg"
      | "headerXl"
      | "footer"
      | "footerLg",
    showText: boolean,
  ) => React.ReactNode;
}
