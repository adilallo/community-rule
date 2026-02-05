import {
  renderWithProviders as render,
  screen,
  fireEvent,
} from "../utils/test-utils";
import { describe, it, expect, vi } from "vitest";
import RuleCard from "../../app/components/RuleCard";

describe("RuleCard Component", () => {
  const defaultProps = {
    title: "Test Rule",
    description: "This is a test rule description",
  };

  it("renders rule card with all required information", () => {
    render(<RuleCard {...defaultProps} />);

    expect(screen.getByText("Test Rule")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test rule description"),
    ).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const customClass = "custom-rule-card";
    render(<RuleCard {...defaultProps} className={customClass} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass(customClass);
  });

  it("applies default background color", () => {
    render(<RuleCard {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass("bg-[var(--color-community-teal-100)]");
  });

  it("applies custom background color", () => {
    const customBg = "bg-blue-100";
    render(<RuleCard {...defaultProps} backgroundColor={customBg} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass(customBg);
  });

  it("renders with icon when provided", () => {
    const Icon = () => <span data-testid="icon">🚀</span>;
    render(<RuleCard {...defaultProps} icon={<Icon />} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<RuleCard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard events", () => {
    const handleClick = vi.fn();
    render(<RuleCard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole("button");

    // Test Enter key
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("applies hover effects correctly", () => {
    render(<RuleCard {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass(
      "hover:shadow-[0px_0px_64px_0px_rgba(0,0,0,0.15)]",
      "transition-shadow",
    );
  });

  it("renders with proper accessibility attributes", () => {
    render(<RuleCard {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute(
      "aria-label",
      "Learn more about Test Rule governance pattern",
    );
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("handles empty description gracefully", () => {
    render(<RuleCard {...defaultProps} description="" />);

    expect(screen.getByText("Test Rule")).toBeInTheDocument();
    expect(
      screen.queryByText("This is a test rule description"),
    ).not.toBeInTheDocument();
  });

  it("applies proper sizing for expanded states", () => {
    render(<RuleCard {...defaultProps} expanded={true} size="L" />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass("w-[568px]");
  });

  it("applies proper accessibility attributes", () => {
    render(<RuleCard {...defaultProps} expanded={true} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-expanded", "true");
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("renders without icon when not provided", () => {
    render(<RuleCard {...defaultProps} />);

    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("applies proper border and shadow classes", () => {
    render(<RuleCard {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass("shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)]");
    expect(card).toHaveClass("rounded-[var(--radius-measures-radius-small)]");
  });

  it("maintains proper heading structure", () => {
    render(<RuleCard {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Test Rule");
    expect(heading.tagName).toBe("H3");
  });

  it("applies proper font classes for title", () => {
    render(<RuleCard {...defaultProps} size="L" />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass("font-bricolage-grotesque", "font-extrabold");
  });

  it("renders expanded state with categories", () => {
    const categories = [
      {
        name: "Values",
        chipOptions: [
          { id: "v1", label: "Consciousness", state: "Unselected" },
        ],
      },
    ];
    render(
      <RuleCard
        {...defaultProps}
        expanded={true}
        categories={categories}
      />,
    );

    expect(screen.getByText("Values")).toBeInTheDocument();
  });

  it("renders with logo URL", () => {
    render(
      <RuleCard
        {...defaultProps}
        logoUrl="http://localhost:3845/assets/test.png"
        logoAlt="Test Logo"
      />,
    );

    const logo = screen.getByAltText("Test Logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders with community initials fallback", () => {
    render(
      <RuleCard
        {...defaultProps}
        communityInitials="CE"
      />,
    );

    expect(screen.getByText("CE")).toBeInTheDocument();
  });
});
