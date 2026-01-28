import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../../app/components/Footer";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type FooterProps = React.ComponentProps<typeof Footer>;

const baseProps: FooterProps = {};

const config: ComponentTestSuiteConfig<FooterProps> = {
  component: Footer,
  name: "Footer",
  props: baseProps,
  primaryRole: "contentinfo",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // Footer is not primarily keyboard navigable
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<FooterProps>(config);

describe("Footer (behavioral tests)", () => {
  it("renders organization schema markup", () => {
    render(<Footer />);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent || "{}");
    expect(schemaData["@type"]).toBe("Organization");
    expect(schemaData.name).toBe("Media Economies Design Lab");
  });

  it("renders organization name and contact", () => {
    render(<Footer />);
    expect(
      screen.getAllByText("Media Economies Design Lab").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "medlab@colorado.edu" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders social media links", () => {
    render(<Footer />);
    expect(
      screen.getAllByRole("link", { name: "Follow us on Bluesky" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Follow us on GitLab" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(
      screen.getAllByRole("link", { name: "Use cases" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Learn" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "About" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders legal links", () => {
    render(<Footer />);
    expect(
      screen.getAllByRole("link", { name: "Privacy Policy" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Terms of Service" }).length,
    ).toBeGreaterThan(0);
  });
});
