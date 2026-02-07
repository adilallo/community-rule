import React from "react";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import { describe, it, expect } from "vitest";
import FeatureGrid from "../../app/components/sections/FeatureGrid";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type FeatureGridProps = React.ComponentProps<typeof FeatureGrid>;

const baseProps: FeatureGridProps = {
  title: "Feature Tools",
  subtitle: "Everything you need",
};

const config: ComponentTestSuiteConfig<FeatureGridProps> = {
  component: FeatureGrid,
  name: "FeatureGrid",
  props: baseProps,
  optionalProps: {
    className: "custom-class",
    title: undefined,
    subtitle: undefined,
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

componentTestSuite<FeatureGridProps>(config);

describe("FeatureGrid (behavioral tests)", () => {
  it("renders title and subtitle", () => {
    render(<FeatureGrid title="Test Title" subtitle="Test Subtitle" />);
    expect(
      screen.getByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Test Subtitle" }),
    ).toBeInTheDocument();
  });

  it("renders all four feature cards", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    expect(
      screen.getByRole("link", { name: "Decision-making support tools" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Values alignment exercises" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Membership guidance resources" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Conflict resolution tools" }),
    ).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    const section = document.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "feature-grid-headline");
  });

  it("handles missing props gracefully", () => {
    render(<FeatureGrid />);
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });
});
