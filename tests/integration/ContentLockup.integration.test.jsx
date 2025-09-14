import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import ContentLockup from "../../app/components/ContentLockup";

afterEach(() => {
  cleanup();
});

describe("ContentLockup Integration", () => {
  test("renders hero variant with all content", () => {
    render(
      <ContentLockup
        variant="hero"
        title="Welcome"
        subtitle="Get Started"
        description="This is a description"
        ctaText="Get Started"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Welcome" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Get Started" })
    ).toBeInTheDocument();
    expect(screen.getByText("This is a description")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Get Started" })).toHaveLength(
      3
    );
  });

  test("renders feature variant with link", () => {
    render(
      <ContentLockup
        variant="feature"
        title="Feature Title"
        subtitle="Feature Subtitle"
        description="Feature description"
        linkText="Learn More"
        linkHref="/learn"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Feature Title" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Learn More" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute(
      "href",
      "/learn"
    );
  });

  test("renders ask variant with simplified structure", () => {
    render(
      <ContentLockup
        variant="ask"
        title="Ask Question"
        subtitle="Ask subtitle"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ask Question" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ask subtitle" })
    ).toBeInTheDocument();
    // Ask variant should not have description or CTA
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("handles left alignment", () => {
    render(
      <ContentLockup
        variant="ask"
        title="Left Aligned"
        subtitle="Subtitle"
        alignment="left"
      />
    );

    const container = screen
      .getByRole("heading", { name: "Left Aligned" })
      .closest("div");
    expect(container).toHaveClass("justify-start");
  });

  test("renders responsive buttons correctly", () => {
    render(
      <ContentLockup variant="hero" title="Responsive" ctaText="Click Me" />
    );

    // Should render all three button variants for different breakpoints
    const buttons = screen.getAllByRole("button", { name: "Click Me" });
    expect(buttons).toHaveLength(3);
  });

  test("applies custom button className", () => {
    render(
      <ContentLockup
        variant="hero"
        title="Custom Button"
        ctaText="Custom"
        buttonClassName="custom-button-class"
      />
    );

    const buttons = screen.getAllByRole("button", { name: "Custom" });
    // The large button (md breakpoint) should have the custom class
    expect(buttons[1]).toHaveClass("custom-button-class");
  });

  test("handles missing optional props gracefully", () => {
    render(<ContentLockup variant="hero" title="Minimal" />);

    expect(
      screen.getByRole("heading", { name: "Minimal" })
    ).toBeInTheDocument();
    // Should not crash without subtitle, description, or CTA
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders decorative shape for hero variant", () => {
    render(<ContentLockup variant="hero" title="Hero with Shape" />);

    const shape = screen.getByRole("presentation");
    expect(shape).toBeInTheDocument();
    expect(shape).toHaveAttribute("src", "assets/Shapes_1.svg");
    expect(shape).toHaveAttribute("alt", "");
  });

  test("does not render shape for non-hero variants", () => {
    render(<ContentLockup variant="feature" title="Feature without Shape" />);

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  test("link has proper accessibility attributes", () => {
    render(
      <ContentLockup
        variant="feature"
        title="Accessible"
        linkText="Accessible Link"
        linkHref="/accessible"
      />
    );

    const link = screen.getByRole("link", { name: "Accessible Link" });
    expect(link).toHaveAttribute("href", "/accessible");
    expect(link).toHaveClass("focus:outline-none", "focus:ring-2");
  });
});
