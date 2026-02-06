import React from "react";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import { describe, it, expect } from "vitest";
import HeroBanner from "../../app/components/sections/HeroBanner";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type HeroBannerProps = React.ComponentProps<typeof HeroBanner>;

const baseProps: HeroBannerProps = {
  title: "Welcome",
};

const config: ComponentTestSuiteConfig<HeroBannerProps> = {
  component: HeroBanner,
  name: "HeroBanner",
  props: baseProps,
  optionalProps: {
    subtitle: "Subtitle",
    description: "Description",
    ctaText: "CTA",
    ctaHref: "/link",
  },
  primaryRole: "region",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<HeroBannerProps>(config);

describe("HeroBanner (behavioral tests)", () => {
  it("renders title", () => {
    render(<HeroBanner title="Test Title" />);
    expect(
      screen.getByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<HeroBanner title="Test" subtitle="Subtitle" />);
    expect(
      screen.getByRole("heading", { name: "Subtitle" }),
    ).toBeInTheDocument();
  });

  it("renders hero image", () => {
    render(<HeroBanner title="Test" />);
    expect(
      screen.getByRole("img", { name: "Hero illustration" }),
    ).toBeInTheDocument();
  });

  it("renders CTA button when provided", () => {
    render(<HeroBanner title="Test" ctaText="Get Started" ctaHref="/start" />);
    expect(
      screen.getAllByRole("button", { name: "Get Started" }).length,
    ).toBeGreaterThan(0);
  });
});
