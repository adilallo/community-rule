import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NumberedCard from "../../app/components/NumberedCard";

describe("NumberedCard Component", () => {
  const defaultProps = {
    number: 1,
    text: "Test Card Text",
  };

  it("renders numbered card with all required information", () => {
    render(<NumberedCard {...defaultProps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Test Card Text")).toBeInTheDocument();
  });

  it("renders with different numbers", () => {
    const { rerender } = render(<NumberedCard {...defaultProps} number={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();

    rerender(<NumberedCard {...defaultProps} number={999} />);
    expect(screen.getByText("999")).toBeInTheDocument();
  });

  it("renders with different text content", () => {
    const { rerender } = render(
      <NumberedCard {...defaultProps} text="Different Text" />
    );
    expect(screen.getByText("Different Text")).toBeInTheDocument();

    rerender(<NumberedCard {...defaultProps} text="Another Text" />);
    expect(screen.getByText("Another Text")).toBeInTheDocument();
  });

  it("applies proper responsive layout classes", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("flex", "flex-col", "sm:flex-row", "lg:flex-row");
  });

  it("applies proper responsive spacing", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("p-5", "sm:p-8", "lg:p-8");
  });

  it("applies proper responsive gap", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("gap-4", "sm:gap-8", "lg:gap-0");
  });

  it("applies proper responsive height", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("lg:h-[238px]");
  });

  it("applies proper background and shadow", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass(
      "bg-[var(--color-surface-inverse-primary)]",
      "shadow-lg"
    );
  });

  it("applies proper border radius", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("rounded-[12px]");
  });

  it("renders section number in correct position", () => {
    render(<NumberedCard {...defaultProps} />);

    const numberElement = screen.getByText("1");
    expect(numberElement).toBeInTheDocument();

    // Check that it's in a container with proper positioning
    const numberContainer = numberElement.closest("div");
    expect(numberContainer).toHaveClass(
      "absolute",
      "inset-0",
      "flex",
      "items-center",
      "justify-center"
    );
  });

  it("renders text content in correct position", () => {
    render(<NumberedCard {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toBeInTheDocument();

    // Check that it's in a container with proper positioning
    const textContainer = textElement.closest("div");
    expect(textContainer).toHaveClass(
      "sm:flex-1",
      "lg:absolute",
      "lg:bottom-8",
      "lg:left-8",
      "lg:right-16"
    );
  });

  it("applies proper font classes to text", () => {
    render(<NumberedCard {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("font-bricolage-grotesque");
  });

  it("applies proper text sizing", () => {
    render(<NumberedCard {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass(
      "text-[24px]",
      "sm:text-[24px]",
      "lg:text-[24px]",
      "xl:text-[32px]"
    );
  });

  it("applies proper text color", () => {
    render(<NumberedCard {...defaultProps} />);

    const textElement = screen.getByText("Test Card Text");
    expect(textElement).toHaveClass("text-[#141414]");
  });

  it("handles long text content gracefully", () => {
    const longText =
      "This is a very long text that should wrap properly and not break the layout of the numbered card component";
    render(<NumberedCard {...defaultProps} text={longText} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("maintains proper responsive behavior", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;

    // Mobile first approach
    expect(card).toHaveClass("flex-col", "gap-4", "p-5");

    // Small breakpoint
    expect(card).toHaveClass(
      "sm:flex-row",
      "sm:gap-8",
      "sm:p-8",
      "sm:items-center"
    );

    // Large breakpoint
    expect(card).toHaveClass(
      "lg:flex-row",
      "lg:gap-0",
      "lg:p-8",
      "lg:items-stretch",
      "lg:relative"
    );
  });

  it("renders with proper flex layout", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("flex");
  });

  it("applies proper items alignment", () => {
    render(<NumberedCard {...defaultProps} />);

    const card = screen
      .getByText("Test Card Text")
      .closest("div").parentElement;
    expect(card).toHaveClass("sm:items-center", "lg:items-stretch");
  });
});
