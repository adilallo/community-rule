import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import Dialog from "../../app/components/modals/Dialog";

type Props = React.ComponentProps<typeof Dialog>;

describe("Dialog", () => {
  const defaultProps: Props = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Confirm action",
    description: "This cannot be undone.",
    footer: (
      <>
        <button type="button">Cancel</button>
        <button type="button">Confirm</button>
      </>
    ),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when isOpen is true", () => {
    renderWithProviders(<Dialog {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm action")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithProviders(<Dialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close control is activated", () => {
    const onClose = vi.fn();
    renderWithProviders(<Dialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    renderWithProviders(<Dialog {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll when open", () => {
    renderWithProviders(<Dialog {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
  });
});
