import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Upload from "../../app/components/controls/Upload";
import { componentTestSuite } from "../utils/componentTestSuite";

type UploadProps = React.ComponentProps<typeof Upload>;

componentTestSuite<UploadProps>({
  component: Upload,
  name: "Upload",
  props: {
    label: "Upload",
    active: true,
  } as UploadProps,
  requiredProps: [],
  optionalProps: {
    label: "Upload",
    active: true,
    showHelpIcon: true,
    hintText: "Add image from your device",
  },
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
  },
});

describe("Upload (behavioral tests)", () => {
  it("renders with active state by default", () => {
    render(<Upload label="Upload" />);
    const button = screen.getByRole("button", { name: /upload/i });
    expect(button).toHaveClass(
      "bg-[var(--color-surface-invert-primary,white)]",
    );
  });

  it("renders with inactive state when active is false", () => {
    render(<Upload label="Upload" active={false} />);
    const button = screen.getByRole("button", { name: /upload/i });
    expect(button).toHaveClass(
      "bg-[var(--color-surface-default-secondary,#141414)]",
    );
  });

  it("displays label when provided", () => {
    render(<Upload label="Upload files" />);
    expect(screen.getByText("Upload files")).toBeInTheDocument();
  });

  it("does not display label when not provided", () => {
    const { container } = render(<Upload />);
    const label = container.querySelector('[data-name="utility/Input label"]');
    expect(label).not.toBeInTheDocument();
  });

  it("shows help icon when showHelpIcon is true", () => {
    render(<Upload label="Upload" showHelpIcon={true} />);
    const helpIcon = screen.getByAltText("Help");
    expect(helpIcon).toBeInTheDocument();
  });

  it("hides help icon when showHelpIcon is false", () => {
    render(<Upload label="Upload" showHelpIcon={false} />);
    const helpIcon = screen.queryByAltText("Help");
    expect(helpIcon).not.toBeInTheDocument();
  });

  it("calls onClick when upload button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Upload label="Upload" onClick={handleClick} />);
    const button = screen.getByRole("button", { name: /upload/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("displays description text", () => {
    render(<Upload label="Upload" />);
    expect(
      screen.getByText(/Add image from your device/i),
    ).toBeInTheDocument();
  });

  it("applies active state styles correctly", () => {
    render(<Upload label="Upload" active={true} />);
    const descriptionText = screen.getByText(
      /Add image from your device/i,
    );
    const descriptionContainer = descriptionText.parentElement;
    expect(descriptionContainer).toHaveClass(
      "text-[color:var(--color-content-default-primary,white)]",
    );
  });

  it("applies inactive state styles correctly", () => {
    render(<Upload label="Upload" active={false} />);
    const descriptionText = screen.getByText(
      /Add image from your device/i,
    );
    const descriptionContainer = descriptionText.parentElement;
    expect(descriptionContainer).toHaveClass(
      "text-[color:var(--color-content-default-tertiary,#b4b4b4)]",
    );
  });
});
