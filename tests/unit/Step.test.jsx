import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Step from "../../app/components/cards/Step";

// Pure presentational; no provider context needed.
describe("Step Component", () => {
  const defaultProps = {
    number: 1,
    text: "Test Card Text",
  };

  it("renders step with all required information", () => {
    render(<Step {...defaultProps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Test Card Text")).toBeInTheDocument();
  });

  it("renders with different numbers", () => {
    const { rerender } = render(<Step {...defaultProps} number={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();

    rerender(<Step {...defaultProps} number={999} />);
    expect(screen.getByText("999")).toBeInTheDocument();
  });

  it("renders with different text content", () => {
    const { rerender } = render(
      <Step {...defaultProps} text="Different Text" />,
    );
    expect(screen.getByText("Different Text")).toBeInTheDocument();

    rerender(<Step {...defaultProps} text="Another Text" />);
    expect(screen.getByText("Another Text")).toBeInTheDocument();
  });

  it("applies proper responsive layout classes when size is not specified", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass(
      "flex",
      "flex-col",
      "sm:flex-row",
      "sm:items-center",
      "lg:flex-col",
      "lg:items-start",
      "lg:justify-end",
      "lg:relative",
    );
  });

  it("applies proper responsive spacing when size is not specified", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("p-5", "sm:p-8", "lg:p-8");
  });

  it("applies proper responsive gap when size is not specified", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("gap-4", "sm:gap-8", "lg:gap-[22px]");
  });

  it("applies proper responsive height when size is not specified", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("lg:h-[238px]", "lg:relative");
  });

  it("applies proper background and shadow", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass(
      "bg-[var(--color-surface-inverse-primary)]",
      "shadow-lg",
    );
  });

  it("applies proper border radius", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("rounded-[12px]");
  });

  it("renders section number in correct position for responsive mode", () => {
    render(<Step {...defaultProps} />);

    const numberElement = screen.getByText("1");
    expect(numberElement).toBeInTheDocument();
  });

  it("renders text content in correct position for responsive mode", () => {
    render(<Step {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toBeInTheDocument();

    // Check that it's in a container with proper positioning
    const textContainer = textElement.closest("div");
    expect(textContainer).toHaveClass(
      "sm:flex-1",
      "lg:absolute",
      "lg:bottom-8",
      "lg:left-8",
      "lg:right-16",
    );
  });

  it("applies proper font classes to text", () => {
    render(<Step {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("font-bricolage-grotesque");
  });

  it("applies proper text sizing for responsive mode", () => {
    render(<Step {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass(
      "text-[24px]",
      "sm:text-[24px]",
      "sm:leading-[24px]",
      "lg:text-[24px]",
      "lg:leading-[24px]",
      "xl:text-[32px]",
      "xl:leading-[32px]",
    );
  });

  it("applies proper text color", () => {
    render(<Step {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("text-[#141414]");
  });

  it("handles long text content gracefully", () => {
    const longText =
      "This is a very long text that should wrap properly and not break the layout of the Step component";
    render(<Step {...defaultProps} text={longText} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("maintains proper responsive behavior when size is not specified", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;

    // Mobile first approach
    expect(card).toHaveClass("flex", "flex-col", "gap-4", "p-5");

    // Small breakpoint
    expect(card).toHaveClass(
      "sm:flex-row",
      "sm:gap-8",
      "sm:p-8",
      "sm:items-center",
    );

    // Large breakpoint
    expect(card).toHaveClass(
      "lg:flex-col",
      "lg:gap-[22px]",
      "lg:p-8",
      "lg:items-start",
      "lg:justify-end",
      "lg:relative",
      "lg:h-[238px]",
    );
  });

  it("renders with proper flex layout", () => {
    render(<Step {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("flex");
  });

  it("applies Small size variant correctly", () => {
    render(<Step {...defaultProps} size="small" />);

    // For Small size, text is directly in card div (no wrapper), so use closest("div")
    const card = screen.getByText("Test Card Text").closest("div");
    expect(card).toHaveClass(
      "flex",
      "flex-col",
      "items-end",
      "justify-center",
      "gap-4",
      "p-5",
      "relative",
    );

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("text-[24px]", "leading-[32px]");
  });

  it("applies Medium size variant correctly", () => {
    render(<Step {...defaultProps} size="medium" />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass(
      "flex",
      "flex-row",
      "items-center",
      "gap-8",
      "p-8",
    );

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("text-[24px]", "leading-[24px]");
  });

  it("applies Large size variant correctly", () => {
    render(<Step {...defaultProps} size="large" />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass(
      "flex",
      "flex-col",
      "items-start",
      "justify-end",
      "gap-[22px]",
      "h-[238px]",
      "p-8",
    );

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("text-[24px]", "leading-[24px]");
  });

  it("applies XLarge size variant correctly", () => {
    render(<Step {...defaultProps} size="xlarge" />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass(
      "flex",
      "flex-col",
      "items-start",
      "justify-end",
      "gap-[22px]",
      "h-[238px]",
      "p-8",
    );

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("text-[32px]", "leading-[32px]");
  });
});
