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

  it("renders all four feature cards as static tiles", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    expect(screen.getByText("Decision-making")).toBeInTheDocument();
    expect(screen.getByText("Values alignment")).toBeInTheDocument();
    expect(screen.getByText("Membership")).toBeInTheDocument();
    expect(screen.getByText("Conflict resolution")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Decision-making support tools" }),
    ).not.toBeInTheDocument();
  });

  it("does not apply a focus ring to the entire grid shell", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    const shell = document.querySelector('[data-figma-node="18847-22410"]');
    expect(shell?.className).not.toContain("focus-within:ring-2");
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

  it("uses Figma invert surface colors on mini tiles", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    expect(
      document.querySelector(
        '[class*="bg-[var(--color-surface-invert-brand-royal)]"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '[class*="bg-[var(--color-surface-invert-brand-lime)]"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '[class*="bg-[var(--color-surface-invert-brand-rust)]"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '[class*="bg-[var(--color-surface-invert-brand-teal)]"]',
      ),
    ).toBeInTheDocument();
  });

  it("marks the content block with the Figma node id", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    expect(
      document.querySelector('[data-figma-node="18847-22410"]'),
    ).toBeInTheDocument();
  });

  it("uses Figma responsive typography on the feature lockup", () => {
    render(<FeatureGrid title="Test Title" subtitle="Test Subtitle" />);
    const title = screen.getByRole("heading", { name: "Test Title" });
    expect(title.className).toMatch(/text-\[18px\]/);
    expect(title.className).toMatch(/md:text-\[length:var\(--sizing-600,24px\)\]/);
    const subtitle = screen.getByRole("heading", { name: "Test Subtitle" });
    expect(subtitle.className).toMatch(/text-\[length:var\(--sizing-350,14px\)\]/);
    expect(subtitle.className).toMatch(/md:text-\[length:var\(--sizing-400,16px\)\]/);
  });

  it("applies grain texture to feature grid icons", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    const icons = document.querySelectorAll("section img");
    expect(icons.length).toBeGreaterThanOrEqual(4);
    icons.forEach((icon) => {
      expect(icon.getAttribute("style")).toContain("#grain");
    });
  });

  it("preserves per-icon aspect ratios from Figma layout", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);
    const icons = Array.from(document.querySelectorAll("section img"));
    expect(icons.map((icon) => icon.getAttribute("width"))).toEqual([
      "48",
      "55",
      "56",
      "50",
    ]);
    expect(icons.map((icon) => icon.getAttribute("height"))).toEqual([
      "48",
      "48",
      "39",
      "47",
    ]);
    expect(icons[3]?.className).toContain("rotate-180");
    expect(icons[3]?.className).toContain("-scale-x-100");
  });
});
