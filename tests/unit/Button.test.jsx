import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../../app/components/Button";

describe("Button Component", () => {
  it("renders button with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--color-surface-inverse-primary)]");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders with custom className", () => {
    const customClass = "custom-button-class";
    render(<Button className={customClass}>Custom Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(customClass);
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-transparent");

    rerender(<Button variant="primary">Primary</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[var(--color-surface-default-primary)]");

    rerender(<Button variant="outlined">Outlined</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-transparent", "border-[1.5px]");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("px-[var(--spacing-measures-spacing-008)]");

    rerender(<Button size="large">Large</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-[var(--spacing-scale-012)]");

    rerender(<Button size="xlarge">XLarge</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-[var(--spacing-scale-020)]");
  });

  it("renders as link when href is provided", () => {
    const href = "/test-page";
    render(<Button href={href}>Link Button</Button>);

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", href);
  });

  it("renders as button when href is not provided", () => {
    render(<Button>Regular Button</Button>);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state correctly", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("tabIndex", "-1");
  });

  it("applies proper accessibility attributes", () => {
    render(<Button ariaLabel="Custom label">Button</Button>);

    const button = screen.getByRole("button", { name: /custom label/i });
    expect(button).toHaveAttribute("aria-label", "Custom label");
  });

  it("applies hover effects correctly", () => {
    render(<Button>Hover Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:scale-[1.02]", "transition-all");
  });

  it("applies focus styles correctly", () => {
    render(<Button>Focus Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("focus:outline-none", "focus:ring-1");
  });

  it("applies active styles correctly", () => {
    render(<Button>Active Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("active:scale-[0.98]");
  });

  it("handles target and rel props for links", () => {
    render(
      <Button href="/test" target="_blank" rel="noopener">
        External Link
      </Button>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("forwards additional props", () => {
    render(<Button data-testid="test-button">Test Button</Button>);

    const button = screen.getByTestId("test-button");
    expect(button).toBeInTheDocument();
  });

  it("applies proper font styles for different sizes", () => {
    const { rerender } = render(<Button size="xsmall">XSmall</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("text-[10px]", "leading-[12px]");

    rerender(<Button size="xlarge">XLarge</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("text-[24px]", "leading-[28px]");
  });

  it("applies proper border radius", () => {
    render(<Button>Rounded Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-[var(--radius-measures-radius-full)]");
  });

  it("maintains proper tab index when not disabled", () => {
    render(<Button>Tab Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("tabIndex", "0");
  });
});
