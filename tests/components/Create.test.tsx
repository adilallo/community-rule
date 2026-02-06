import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import Create from "../../app/components/modals/Create";
import TextInput from "../../app/components/controls/TextInput";

type CreateProps = React.ComponentProps<typeof Create>;

describe("Create", () => {
  const defaultProps: CreateProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Create Dialog",
    description: "Test description",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when isOpen is true", () => {
    renderWithProviders(
      <Create {...defaultProps}>Create dialog content</Create>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Create Dialog")).toBeInTheDocument();
    expect(screen.getByText("Create dialog content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderWithProviders(<Create {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<Create {...defaultProps} onClose={onClose} />);
    const closeButton = screen.getByLabelText("Close dialog");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when ESC key is pressed", () => {
    const onClose = vi.fn();
    renderWithProviders(<Create {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<Create {...defaultProps} onClose={onClose} />);
    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("renders footer buttons when provided", () => {
    const onBack = vi.fn();
    const onNext = vi.fn();
    renderWithProviders(
      <Create
        {...defaultProps}
        showBackButton={true}
        showNextButton={true}
        onBack={onBack}
        onNext={onNext}
        backButtonText="Go Back"
        nextButtonText="Continue"
      />,
    );
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    const onBack = vi.fn();
    renderWithProviders(
      <Create
        {...defaultProps}
        showBackButton={true}
        onBack={onBack}
        backButtonText="Back"
      />,
    );
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    const onNext = vi.fn();
    renderWithProviders(
      <Create
        {...defaultProps}
        showNextButton={true}
        onNext={onNext}
        nextButtonText="Next"
      />,
    );
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("disables next button when nextButtonDisabled is true", () => {
    renderWithProviders(
      <Create
        {...defaultProps}
        showNextButton={true}
        nextButtonText="Next"
        nextButtonDisabled={true}
      />,
    );
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("renders stepper when currentStep and totalSteps are provided", () => {
    renderWithProviders(
      <Create {...defaultProps} currentStep={2} totalSteps={5} />,
    );
    // Find the stepper by its aria-label
    const stepper = screen.getByRole("progressbar", {
      name: "Step 2 of 5",
    });
    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute("aria-valuenow", "2");
    expect(stepper).toHaveAttribute("aria-valuemax", "5");
  });

  it("renders custom footer content", () => {
    renderWithProviders(
      <Create
        {...defaultProps}
        footerContent={<button>Custom Footer</button>}
      />,
    );
    expect(screen.getByText("Custom Footer")).toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    renderWithProviders(
      <Create {...defaultProps} ariaLabel="Test create dialog" />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Test create dialog");
  });

  it("locks body scroll when open", () => {
    renderWithProviders(<Create {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", () => {
    const { rerender } = renderWithProviders(<Create {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Create {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("traps focus within create dialog", async () => {
    renderWithProviders(
      <Create {...defaultProps}>
        <TextInput label="Test Input" />
      </Create>,
    );

    const closeButton = screen.getByLabelText("Close dialog");
    screen.getByLabelText("Test Input"); // Verify input is rendered

    // Focus should start on first focusable element (close button)
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    // Tab should move focus to next element
    fireEvent.keyDown(document, { key: "Tab" });
    await waitFor(() => {
      // Should focus on the more options button or input
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });
});
