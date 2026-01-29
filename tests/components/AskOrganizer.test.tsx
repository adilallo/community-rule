import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AskOrganizer from "../../app/components/AskOrganizer";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type AskOrganizerProps = React.ComponentProps<typeof AskOrganizer>;

const baseProps: AskOrganizerProps = {
  title: "Need help?",
};

const config: ComponentTestSuiteConfig<AskOrganizerProps> = {
  component: AskOrganizer,
  name: "AskOrganizer",
  props: baseProps,
  optionalProps: {
    subtitle: "Subtitle",
    description: "Description",
    buttonText: "Button",
    buttonHref: "/link",
    className: "custom",
    variant: "centered",
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

componentTestSuite<AskOrganizerProps>(config);

describe("AskOrganizer (behavioral tests)", () => {
  it("renders title", () => {
    render(<AskOrganizer title="Test Title" />);
    expect(
      screen.getByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<AskOrganizer title="Test" subtitle="Subtitle" />);
    expect(
      screen.getByRole("heading", { name: "Subtitle" }),
    ).toBeInTheDocument();
  });

  it("renders button with default text", () => {
    render(<AskOrganizer title="Test" />);
    expect(
      screen.getByRole("link", {
        name: /ask an organizer/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders button with custom text", () => {
    render(
      <AskOrganizer title="Test" buttonText="Contact" buttonHref="/contact" />,
    );
    expect(
      screen.getByRole("link", {
        name: /contact/i,
      }),
    ).toBeInTheDocument();
  });
});
