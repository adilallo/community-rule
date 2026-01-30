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
  schemaData: object;
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
  renderNavigationItems: (_size: NavSize) => React.ReactNode;
  renderLoginButton: (_size: NavSize) => React.ReactNode;
  renderCreateRuleButton: (
    _buttonSize: "xsmall" | "small" | "medium" | "large" | "xlarge",
    _containerSize: "small" | "medium" | "large" | "xlarge",
    _avatarSize: "small" | "medium" | "large" | "xlarge",
  ) => React.ReactNode;
  renderLogo: (
    _size:
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
    _showText: boolean,
  ) => React.ReactNode;
}
