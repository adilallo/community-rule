import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Icon from "../../app/components/cards/Icon";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type IconProps = React.ComponentProps<typeof Icon>;

const baseProps: IconProps = {
  icon: <div data-testid="test-icon">Icon</div>,
  title: "Worker's cooperatives",
  description:
    "Employee-owned businesses often need to clarify how power is shared",
};

const config: ComponentTestSuiteConfig<IconProps> = {
  component: Icon,
  name: "Icon",
  props: baseProps,
  requiredProps: ["icon", "title", "description"],
  optionalProps: {
    className: "custom-class",
    onClick: vi.fn(),
  },
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<IconProps>(config);

// Pure presentational; no provider context needed.
describe("Icon (behavioral tests)", () => {
  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <Icon
        icon={<div>Icon</div>}
        title="Test Title"
        description="Test Description"
        onClick={handleClick}
      />,
    );
    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter key is pressed", () => {
    const handleClick = vi.fn();
    render(
      <Icon
        icon={<div>Icon</div>}
        title="Test Title"
        description="Test Description"
        onClick={handleClick}
      />,
    );
    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Space key is pressed", () => {
    const handleClick = vi.fn();
    render(
      <Icon
        icon={<div>Icon</div>}
        title="Test Title"
        description="Test Description"
        onClick={handleClick}
      />,
    );
    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon, title, and description", () => {
    render(
      <Icon
        icon={<div data-testid="icon">Icon</div>}
        title="Worker's cooperatives"
        description="Employee-owned businesses"
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Worker's cooperatives")).toBeInTheDocument();
    expect(screen.getByText("Employee-owned businesses")).toBeInTheDocument();
  });

  it("has proper ARIA label", () => {
    render(
      <Icon
        icon={<div>Icon</div>}
        title="Test Title"
        description="Test Description"
      />,
    );
    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-label", "Test Title: Test Description");
  });
});
