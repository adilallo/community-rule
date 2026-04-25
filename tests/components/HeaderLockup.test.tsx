import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HeaderLockup from "../../app/components/type/HeaderLockup";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type HeaderLockupProps = React.ComponentProps<typeof HeaderLockup>;

const baseProps: HeaderLockupProps = {
  title: "Test Title",
};

const config: ComponentTestSuiteConfig<HeaderLockupProps> = {
  component: HeaderLockup,
  name: "HeaderLockup",
  props: baseProps,
  requiredProps: ["title"],
  optionalProps: {
    description: "Test description",
    justification: "left",
    size: "L",
  },
  primaryRole: "heading",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<HeaderLockupProps>(config);

// Pure presentational; no provider context needed.
describe("HeaderLockup (behavioral tests)", () => {
  it("renders title", () => {
    render(<HeaderLockup title="Test Title" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Title",
    );
  });

  it("renders description when provided", () => {
    render(<HeaderLockup title="Test Title" description="Test description" />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders ReactNode description (rich inline)", () => {
    render(
      <HeaderLockup
        title="Test Title"
        description={
          <>
            Before <span className="underline">link</span> after
          </>
        }
      />,
    );
    expect(screen.getByText(/Before/)).toBeInTheDocument();
    expect(screen.getByText("link")).toBeInTheDocument();
    expect(screen.getByText(/after/)).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<HeaderLockup title="Test Title" />);
    const description = container.querySelector("p");
    expect(description).not.toBeInTheDocument();
  });

  it("accepts justification prop", () => {
    const { container } = render(
      <HeaderLockup title="Test Title" justification="center" />,
    );
    const heading = container.querySelector("h1");
    expect(heading).toHaveClass("text-center");
  });

  it("accepts size prop", () => {
    render(<HeaderLockup title="Test Title" size="M" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("accepts justification and size props", () => {
    render(<HeaderLockup title="Test Title" justification="left" size="L" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("forwards titleId to the h1", () => {
    render(<HeaderLockup title="Test Title" titleId="profile-welcome" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute(
      "id",
      "profile-welcome",
    );
  });
});
