import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ProportionBar from "../../app/components/progress/ProportionBar";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type ProportionBarProps = React.ComponentProps<typeof ProportionBar>;

const baseProps: ProportionBarProps = {
  progress: "2-1",
};

const config: ComponentTestSuiteConfig<ProportionBarProps> = {
  component: ProportionBar,
  name: "ProportionBar",
  props: baseProps,
  requiredProps: [],
  optionalProps: {
    progress: "3-2",
    className: "custom-class",
  },
  primaryRole: "progressbar",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // ProportionBar is not keyboard navigable
    disabledState: false, // ProportionBar doesn't have disabled state
    errorState: false,
  },
};

componentTestSuite<ProportionBarProps>(config);

describe("ProportionBar (behavioral tests)", () => {
  it("renders proportion bar with correct progress value", () => {
    render(<ProportionBar progress="2-1" />);
    const progressbar = screen.getByRole("progressbar");
    // 2-1: First section full (1) + second section 1/3 filled = 1 + 1/3 ≈ 1.333
    expect(progressbar).toHaveAttribute("aria-valuenow", "1.3333333333333333");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "3");
  });

  it("applies custom className", () => {
    const { container } = render(<ProportionBar className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("defaults to progress 3-2 when progress is not specified", () => {
    render(<ProportionBar />);
    const progressbar = screen.getByRole("progressbar");
    // 3-2: First two sections full (2) + third section 2/3 filled = 2 + 2/3 ≈ 2.667
    expect(progressbar).toHaveAttribute("aria-valuenow", "2.6666666666666665");
  });

  it("handles all proportion states correctly", () => {
    const testCases = [
      { progress: "1-0" as const, expected: 1 / 6 }, // First section 1/6 filled
      { progress: "1-5" as const, expected: 1 }, // First section 6/6 filled (fully filled)
      { progress: "2-0" as const, expected: 1 }, // First section full, second empty
      { progress: "2-2" as const, expected: 1 + 2 / 3 }, // First section full, second section 2/3 filled
      { progress: "3-0" as const, expected: 2 }, // First two sections full, third empty
      { progress: "3-2" as const, expected: 2 + 2 / 3 }, // First two sections full, third section 2/3 filled
    ];

    testCases.forEach(({ progress, expected }) => {
      const { unmount } = render(<ProportionBar progress={progress} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", String(expected));
      unmount();
    });
  });
});
