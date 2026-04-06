import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import Login from "../../app/components/modals/Login";

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog when open and portal is ready", async () => {
    renderWithProviders(
      <Login isOpen onClose={vi.fn()} ariaLabelledBy="login-modal-heading">
        <p id="login-modal-heading">Login content</p>
      </Login>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("Login content")).toBeInTheDocument();
  });

  it("does not render dialog when closed", () => {
    renderWithProviders(
      <Login
        isOpen={false}
        onClose={vi.fn()}
        ariaLabelledBy="login-modal-heading"
      >
        <p>Hidden</p>
      </Login>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    renderWithProviders(
      <Login isOpen onClose={onClose} ariaLabelledBy="login-modal-heading">
        <p id="login-modal-heading">Body</p>
      </Login>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText("Close dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    renderWithProviders(
      <Login isOpen onClose={onClose} ariaLabelledBy="login-modal-heading">
        <p id="login-modal-heading">Body</p>
      </Login>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll while open", async () => {
    renderWithProviders(
      <Login isOpen onClose={vi.fn()} ariaLabelledBy="login-modal-heading">
        <p id="login-modal-heading">Body</p>
      </Login>,
    );
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("renders belowCard outside the dialog card", async () => {
    renderWithProviders(
      <Login
        isOpen
        onClose={vi.fn()}
        ariaLabelledBy="login-modal-heading"
        belowCard={<a href="/">Back to home</a>}
      >
        <p id="login-modal-heading">Body</p>
      </Login>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toBeInTheDocument();
  });
});
