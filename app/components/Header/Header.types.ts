export interface HeaderProps {
  // No props currently, but keeping interface for future extensibility
}

export interface HeaderViewProps {
  schemaData: {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    potentialAction: {
      "@type": string;
      target: string;
      "query-input": string;
    };
  };
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
