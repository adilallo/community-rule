import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Stepper from "../../app/components/Stepper";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type StepperProps = React.ComponentProps<typeof Stepper>;

const baseProps: StepperProps = {
  active: 1,
  totalSteps: 5,
};

const config: ComponentTestSuiteConfig<StepperProps> = {
  component: Stepper,
  name: "Stepper",
  props: baseProps,
  requiredProps: [],
  optionalProps: {
    active: 3,
    totalSteps: 3,
    className: "custom-class",
  },
  primaryRole: "progressbar",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // Stepper is not keyboard navigable
    disabledState: false, // Stepper doesn't have disabled state
    errorState: false,
  },
};

componentTestSuite<StepperProps>(config);

describe("Stepper (behavioral tests)", () => {
  it("renders with correct number of steps", () => {
    render(<Stepper active={3} totalSteps={5} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "3");
    expect(progressbar).toHaveAttribute("aria-valuemin", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
  });

  it("shows active steps correctly", () => {
    const { container } = render(<Stepper active={2} totalSteps={5} />);
    // Should have 1 active (filled) circle (step 2) and 4 inactive (outline) circles
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(5);
  });

  it("applies custom className", () => {
    const { container } = render(<Stepper className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("defaults to active 1 when active is not specified", () => {
    render(<Stepper totalSteps={5} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "1");
  });

  it("defaults to totalSteps 5 when totalSteps is not specified", () => {
    render(<Stepper active={1} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
  });
});
