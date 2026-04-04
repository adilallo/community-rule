import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "../../app/components/asset/logo";
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

  it("hides wordmark when wordmark is false", () => {
    const { container } = render(<Logo wordmark={false} />);
    const textElement = container.querySelector(".hidden");
    expect(textElement).toBeInTheDocument();
    expect(screen.getByAltText("CommunityRule Logo Icon")).toBeInTheDocument();
  });

  it("applies inverse palette styling when palette is inverse", () => {
    render(<Logo palette="inverse" />);
    const link = screen.getByRole("link");
    const textEl = link.querySelector(".font-bricolage-grotesque");
    const img = link.querySelector("img");
    expect(textEl).toHaveClass("text-[var(--color-content-invert-primary)]");
    expect(img).toHaveClass("brightness-0");
  });

  it("renders with different size variants", () => {
    const { rerender } = render(<Logo size="default" />);
    expect(screen.getByRole("link")).toBeInTheDocument();

    rerender(<Logo size="footer" />);
    expect(screen.getByRole("link")).toBeInTheDocument();

    rerender(<Logo size="createFlow" />);
    expect(screen.getByRole("link")).toBeInTheDocument();

    rerender(<Logo size="topNavFolderTop" />);
    expect(screen.getByRole("link")).toBeInTheDocument();

    rerender(<Logo size="topNavHeader" />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
