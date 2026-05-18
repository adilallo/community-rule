import React from "react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import { describe, it, expect } from "vitest";
import AskOrganizer from "../../app/components/sections/AskOrganizer";
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

  it("renders CTA button with default label", () => {
    render(<AskOrganizer title="Test" />);
    expect(
      screen.getByRole("button", {
        name: /ask an organizer/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens inquiry modal when CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<AskOrganizer title="Test" />);
    await user.click(screen.getByTestId("ask-organizer-cta"));
    expect(
      await screen.findByRole("dialog", { name: /ask an organizer/i }),
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

  it("use-case-detail variant uses inverse lockup and figma node", () => {
    const { container } = render(
      <AskOrganizer
        title="Still have questions?"
        subtitle="Get answers from an experienced organizer"
        buttonText="Ask an Organizer"
        variant="use-case-detail"
      />,
    );
    expect(
      container.querySelector('[data-figma-node="22015-42624"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Still have questions?" }),
    ).toBeInTheDocument();
  });
});
