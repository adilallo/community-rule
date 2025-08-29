import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import Button from "../../app/components/Button";

afterEach(() => {
  cleanup();
});

describe("Button Component", () => {
  test("renders button with children", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
  });

  test("handles click events", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("renders as link when href is provided", () => {
    render(<Button href="/test">Link Button</Button>);
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  test("applies different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole("button", { name: "Default" });
    expect(button.className).toContain(
      "bg-[var(--color-surface-inverse-primary)]"
    );

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button", { name: "Secondary" });
    expect(button.className).toContain("bg-transparent");
  });

  test("applies different sizes", () => {
    const { rerender } = render(<Button size="xsmall">Small</Button>);
    let button = screen.getByRole("button", { name: "Small" });
    expect(button.className).toContain("px-[var(--spacing-scale-006)]");

    rerender(<Button size="large">Large</Button>);
    button = screen.getByRole("button", { name: "Large" });
    expect(button.className).toContain("px-[var(--spacing-scale-012)]");
  });

  test("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("tabindex", "-1");
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button", { name: "Custom" });
    expect(button.className).toContain("custom-class");
  });

  test("applies aria-label for accessibility", () => {
    render(<Button aria-label="Custom label">Button</Button>);
    const button = screen.getByRole("button", { name: "Custom label" });
    expect(button).toHaveAttribute("aria-label", "Custom label");
  });

  test("renders with design tokens", () => {
    render(<Button>Token Test</Button>);
    const button = screen.getByRole("button", { name: "Token Test" });

    // Check that design tokens are applied
    expect(button.className).toContain(
      "rounded-[var(--radius-measures-radius-full)]"
    );
    expect(button.className).toContain(
      "bg-[var(--color-surface-inverse-primary)]"
    );
  });

  test("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Keyboard</Button>);

    const button = screen.getByRole("button", { name: "Keyboard" });
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("does not render as link when disabled and href provided", () => {
    render(
      <Button href="/test" disabled>
        Disabled Link
      </Button>
    );
    const button = screen.getByRole("button", { name: "Disabled Link" });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
