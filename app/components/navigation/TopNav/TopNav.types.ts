import type React from "react";

export interface TopNavProps {
  className?: string;
  size?: "320-429" | "430-639" | "640-1023" | "1024-1440" | "1440+";
  loggedIn?: boolean;
  folderTop?: boolean;
  profile?: boolean;
  logIn?: boolean;
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

export interface TopNavViewProps {
  folderTop: boolean;
  loggedIn: boolean;
  profile: boolean;
  logIn: boolean;
  schemaData: {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    description?: string;
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
