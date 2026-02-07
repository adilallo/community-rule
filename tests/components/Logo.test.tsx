import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "../../app/components/icons/Logo";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type LogoProps = React.ComponentProps<typeof Logo>;

const baseProps: LogoProps = {};

const config: ComponentTestSuiteConfig<LogoProps> = {
  component: Logo,
  name: "Logo",
  props: baseProps,
  primaryRole: "link",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<LogoProps>(config);

describe("Logo (behavioral tests)", () => {
  it("renders as a link to home", () => {
    render(<Logo />);
    const logo = screen.getByRole("link", { name: /communityrule logo/i });
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveAttribute("aria-label", "CommunityRule Logo");
  });

  it("renders logo icon", () => {
    render(<Logo />);
    expect(screen.getByAltText("CommunityRule Logo Icon")).toBeInTheDocument();
  });

  it("renders text by default", () => {
    render(<Logo />);
    expect(screen.getByText("CommunityRule")).toBeInTheDocument();
  });

  it("hides text when showText is false", () => {
    render(<Logo showText={false} />);
    expect(screen.queryByText("CommunityRule")).not.toBeInTheDocument();
    expect(screen.getByAltText("CommunityRule Logo Icon")).toBeInTheDocument();
  });

  it("renders with different size variants", () => {
    const { rerender } = render(<Logo size="header" />);
    expect(screen.getByRole("link")).toBeInTheDocument();

    rerender(<Logo size="footer" />);
    expect(screen.getByRole("link")).toBeInTheDocument();

    rerender(<Logo size="homeHeaderMd" />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
