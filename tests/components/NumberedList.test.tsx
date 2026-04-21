import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import NumberedList from "../../app/components/type/NumberedList";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type NumberedListProps = React.ComponentProps<typeof NumberedList>;

const mockItems = [
  {
    title: "First step",
    description: "This is the first step description",
  },
  {
    title: "Second step",
    description: "This is the second step description",
  },
  {
    title: "Third step",
    description: "This is the third step description",
  },
];

const baseProps: NumberedListProps = {
  items: mockItems,
};

const config: ComponentTestSuiteConfig<NumberedListProps> = {
  component: NumberedList,
  name: "NumberedList",
  props: baseProps,
  requiredProps: ["items"],
  optionalProps: {
    size: "M",
  },
  primaryRole: "list",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<NumberedListProps>(config);

// Pure presentational; no provider context needed.
describe("NumberedList (behavioral tests)", () => {
  it("renders all items", () => {
    render(<NumberedList items={mockItems} />);
    expect(screen.getByText("First step")).toBeInTheDocument();
    expect(screen.getByText("Second step")).toBeInTheDocument();
    expect(screen.getByText("Third step")).toBeInTheDocument();
  });

  it("renders item descriptions", () => {
    render(<NumberedList items={mockItems} />);
    expect(
      screen.getByText("This is the first step description"),
    ).toBeInTheDocument();
  });

  it("renders numbered indicators", () => {
    const { container } = render(<NumberedList items={mockItems} />);
    const numbers = container.querySelectorAll("ol > li");
    expect(numbers).toHaveLength(3);
  });

  it("accepts size prop", () => {
    const { container } = render(<NumberedList items={mockItems} size="S" />);
    const list = container.querySelector("ol");
    expect(list).toBeInTheDocument();
  });

  it("accepts PascalCase size prop", () => {
    const { container } = render(<NumberedList items={mockItems} size="M" />);
    const list = container.querySelector("ol");
    expect(list).toBeInTheDocument();
  });
});
