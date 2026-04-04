import {
  renderWithProviders as render,
  screen,
  fireEvent,
} from "../utils/test-utils";
import { describe, it, expect, vi } from "vitest";
import Card from "../../app/components/cards/Card";

describe("Card Component", () => {
  const defaultProps = {
    label: "Label",
    supportText: "Support text here",
    orientation: "horizontal",
  };

  it("renders label and supportText", () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Support text here")).toBeInTheDocument();
  });

  it("renders RECOMMENDED pill when recommended is true", () => {
    render(<Card {...defaultProps} recommended={true} />);

    expect(screen.getByText("RECOMMENDED")).toBeInTheDocument();
  });

  it("does not render RECOMMENDED pill when recommended is false", () => {
    render(<Card {...defaultProps} recommended={false} />);

    expect(screen.queryByText("RECOMMENDED")).not.toBeInTheDocument();
  });

  it("renders SELECTED pill and inset dashed outline when selected is true", () => {
    render(<Card {...defaultProps} selected={true} />);

    expect(screen.getByText("SELECTED")).toBeInTheDocument();
    const card = screen.getByRole("button");
    expect(card).toHaveClass("outline-dashed");
  });

  it("applies horizontal layout by default", () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Support text here")).toBeInTheDocument();
  });

  it("applies vertical layout when orientation is vertical", () => {
    render(<Card {...defaultProps} orientation="vertical" />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass("flex-row");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Card {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard events", () => {
    const handleClick = vi.fn();
    render(<Card {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole("button");

    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("renders with custom className", () => {
    const customClass = "custom-card";
    render(<Card {...defaultProps} className={customClass} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass(customClass);
  });

  it("renders with proper accessibility attributes", () => {
    render(<Card {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-label", "Label: Support text here");
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("renders without supportText", () => {
    render(<Card label="Label only" orientation="horizontal" />);

    expect(screen.getByText("Label only")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Label only",
    );
  });
});
