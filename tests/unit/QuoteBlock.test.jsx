import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import { vi, describe, test, expect, afterEach } from "vitest";
import QuoteBlock from "../../app/components/QuoteBlock";

afterEach(() => {
  cleanup();
});

describe("QuoteBlock Component", () => {
  test("renders with default props", () => {
    render(<QuoteBlock />);

    expect(
      screen.getByText(/The rules of decision-making must be open/),
    ).toBeInTheDocument();
    expect(screen.getByText("Jo Freeman")).toBeInTheDocument();
    expect(
      screen.getByText("The Tyranny of Structurelessness"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Portrait of Jo Freeman")).toBeInTheDocument();
  });

  test("renders with custom props", () => {
    render(
      <QuoteBlock
        quote="Custom quote text"
        author="Custom Author"
        source="Custom Source"
      />,
    );

    expect(screen.getByText("Custom quote text")).toBeInTheDocument();
    expect(screen.getByText("Custom Author")).toBeInTheDocument();
    expect(screen.getByText("Custom Source")).toBeInTheDocument();
  });

  test("renders with custom className", () => {
    render(
      <QuoteBlock
        quote="Test quote"
        author="Test Author"
        className="custom-class"
      />,
    );

    const section = document.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  test("renders different variants", () => {
    const { rerender } = render(
      <QuoteBlock quote="Test quote" author="Test Author" variant="compact" />,
    );

    // Compact variant should have different styling
    const section = screen.getByRole("region");
    expect(section).toHaveClass(
      "py-[var(--spacing-scale-032)]",
      "px-[var(--spacing-scale-016)]",
    );

    rerender(
      <QuoteBlock quote="Test quote" author="Test Author" variant="extended" />,
    );

    // Extended variant should have different styling
    expect(section).toHaveClass(
      "py-[var(--spacing-scale-048)]",
      "px-[var(--spacing-scale-024)]",
    );
  });

  test("renders with custom ID", () => {
    render(
      <QuoteBlock
        quote="Test quote"
        author="Test Author"
        id="custom-quote-id"
      />,
    );

    const quoteElement = screen.getByText("Test quote");
    expect(quoteElement).toBeInTheDocument();
  });

  test("handles image error gracefully", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" />);

    // Should render the quote and author
    expect(screen.getByText("Test quote")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  test("calls onError callback when image fails", () => {
    const onError = vi.fn();
    render(
      <QuoteBlock quote="Test quote" author="Test Author" onError={onError} />,
    );

    // Should render without errors
    expect(screen.getByText("Test quote")).toBeInTheDocument();
  });

  test("renders with fallback avatar", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" />);

    // Should render the quote and author
    expect(screen.getByText("Test quote")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  test("renders decorative elements for standard variant", () => {
    render(
      <QuoteBlock quote="Test quote" author="Test Author" variant="standard" />,
    );

    // Should render QuoteDecor for standard variant
    const decor = document.querySelector(
      '[class*="pointer-events-none absolute z-0"]',
    );
    expect(decor).toBeInTheDocument();
  });

  test("does not render decorative elements for compact variant", () => {
    render(
      <QuoteBlock quote="Test quote" author="Test Author" variant="compact" />,
    );

    // Should not render QuoteDecor for compact variant
    const decor = document.querySelector(
      '[class*="pointer-events-none absolute z-0"]',
    );
    expect(decor).not.toBeInTheDocument();
  });

  test("renders with proper semantic structure", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    const blockquote = document.querySelector("blockquote");
    expect(blockquote).toBeInTheDocument();

    const cite = document.querySelector("cite");
    expect(cite).toBeInTheDocument();
  });

  test("applies correct accessibility attributes", () => {
    render(
      <QuoteBlock quote="Test quote" author="Test Author" id="test-quote" />,
    );

    const section = document.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "test-quote-content");

    const blockquote = document.querySelector("blockquote");
    expect(blockquote).toHaveAttribute("aria-labelledby", "test-quote-author");
  });

  test("renders with design tokens", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("md:py-[var(--spacing-scale-032)]");

    const card = section.querySelector(
      '[class*="bg-[var(--color-surface-default-brand-darker-accent)]"]',
    );
    expect(card).toBeInTheDocument();
  });

  test("handles missing required props", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<QuoteBlock quote="" author="" />);

    expect(consoleSpy).toHaveBeenCalledWith(
      "QuoteBlock: Missing required props (quote or author)",
    );

    consoleSpy.mockRestore();
  });

  test("renders with proper quote styling", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" />);

    const quoteElement = screen.getByText("Test quote");
    expect(quoteElement).toHaveClass("font-bricolage-grotesque", "font-normal");
  });

  test("renders with proper author styling", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" />);

    const authorElement = screen.getByText("Test Author");
    expect(authorElement).toHaveClass("font-inter", "font-normal", "uppercase");
  });

  test("applies responsive text sizing", () => {
    render(
      <QuoteBlock quote="Test quote" author="Test Author" variant="standard" />,
    );

    const quoteElement = screen.getByText("Test quote");
    expect(quoteElement).toHaveClass(
      "text-[18px]",
      "md:text-[36px]",
      "lg:text-[52px]",
    );
  });

  test("renders without source when not provided", () => {
    render(<QuoteBlock quote="Test quote" author="Test Author" source="" />);

    expect(screen.getByText("Test quote")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(
      screen.queryByText("The Tyranny of Structurelessness"),
    ).not.toBeInTheDocument();
  });
});
