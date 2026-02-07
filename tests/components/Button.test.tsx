import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Button from "../../app/components/buttons/Button";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type ButtonProps = React.ComponentProps<typeof Button>;

const baseProps: ButtonProps = {
  children: "Click me",
};

const config: ComponentTestSuiteConfig<ButtonProps> = {
  component: Button,
  name: "Button",
  props: baseProps,
  requiredProps: ["children"],
  optionalProps: {
    href: "/test",
    ariaLabel: "Accessible button",
  },
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: true,
    errorState: false,
  },
  states: {
    disabledProps: { disabled: true },
  },
};

componentTestSuite<ButtonProps>(config);

describe("Button (behavioral tests)", () => {
  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a link when href is provided", () => {
    render(
      <Button href="/learn" buttonType="filled" palette="default">
        Learn more
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Learn more" });
    expect(link).toHaveAttribute("href", "/learn");
  });
});
