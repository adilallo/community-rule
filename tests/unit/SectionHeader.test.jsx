import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SectionHeader from "../../app/components/SectionHeader";

describe("SectionHeader Component", () => {
  it("renders section header with title", () => {
    render(<SectionHeader title="Test Section" />);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    // Check for both mobile and desktop versions of the title
    expect(screen.getAllByText("Test Section")).toHaveLength(2);
  });

  it("renders with subtitle when provided", () => {
    const subtitle = "This is a test subtitle";
    render(<SectionHeader title="Test Section" subtitle={subtitle} />);

    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it("renders with titleLg when provided", () => {
    const titleLg = "Large Title for Desktop";
    render(<SectionHeader title="Test Section" titleLg={titleLg} />);

    // Check for mobile title and desktop titleLg
    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.getByText(titleLg)).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(
      <SectionHeader title="Default Header" variant="default" />,
    );
    let titleContainer = screen
      .getByRole("heading", { level: 2 })
      .closest("div");
    expect(titleContainer).toHaveClass(
      "lg:w-[369px]",
      "lg:h-[var(--spacing-scale-120)]",
    );

    rerender(<SectionHeader title="Multi-line Header" variant="multi-line" />);
    titleContainer = screen.getByRole("heading", { level: 2 }).closest("div");
    expect(titleContainer).toHaveClass(
      "lg:w-[50%]",
      "lg:h-[var(--spacing-scale-120)]",
    );
  });

  it("renders responsive title spans", () => {
    render(<SectionHeader title="Test Section" />);

    const mobileTitle = screen.getByText("Test Section", {
      selector: "span.block.lg\\:hidden",
    });
    const desktopTitle = screen.getByText("Test Section", {
      selector: "span.hidden.lg\\:block",
    });

    expect(mobileTitle).toBeInTheDocument();
    expect(desktopTitle).toBeInTheDocument();
  });

  it("uses titleLg for desktop when provided", () => {
    const titleLg = "Desktop Title";
    render(<SectionHeader title="Mobile Title" titleLg={titleLg} />);

    const mobileTitle = screen.getByText("Mobile Title", {
      selector: "span.block.lg\\:hidden",
    });
    const desktopTitle = screen.getByText("Desktop Title", {
      selector: "span.hidden.lg\\:block",
    });

    expect(mobileTitle).toBeInTheDocument();
    expect(desktopTitle).toBeInTheDocument();
  });

  it("falls back to title for desktop when titleLg not provided", () => {
    render(<SectionHeader title="Test Section" />);

    const mobileTitle = screen.getByText("Test Section", {
      selector: "span.block.lg\\:hidden",
    });
    const desktopTitle = screen.getByText("Test Section", {
      selector: "span.hidden.lg\\:block",
    });

    expect(mobileTitle).toBeInTheDocument();
    expect(desktopTitle).toBeInTheDocument();
  });

  it("applies proper responsive layout classes", () => {
    render(<SectionHeader title="Test Section" />);

    const container = screen
      .getByRole("heading", { level: 2 })
      .closest("div").parentElement;
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "lg:flex-row",
      "lg:justify-between",
    );
  });

  it("handles empty subtitle gracefully", () => {
    render(<SectionHeader title="Test Section" subtitle="" />);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    // Empty subtitle should not cause issues - check that the paragraph element exists
    const subtitleContainer = screen
      .getByRole("heading", { level: 2 })
      .closest("div")
      .parentElement.querySelector("p");
    expect(subtitleContainer).toBeInTheDocument();
  });

  it("maintains proper heading structure", () => {
    render(<SectionHeader title="Test Section" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Section");
    expect(heading.tagName).toBe("H2");
  });

  it("applies proper font classes", () => {
    render(<SectionHeader title="Test Section" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("font-bricolage-grotesque", "font-bold");
  });

  it("applies proper text sizing", () => {
    render(<SectionHeader title="Test Section" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass(
      "text-[28px]",
      "sm:text-[32px]",
      "lg:text-[32px]",
      "xl:text-[40px]",
    );
  });

  it("applies proper line heights", () => {
    render(<SectionHeader title="Test Section" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass(
      "leading-[36px]",
      "sm:leading-[40px]",
      "lg:leading-[40px]",
      "xl:leading-[52px]",
    );
  });

  it("applies proper text colors", () => {
    render(<SectionHeader title="Test Section" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-[var(--color-content-default-primary)]");
  });

  it("applies proper subtitle styling", () => {
    const subtitle = "Test Subtitle";
    render(<SectionHeader title="Test Section" subtitle={subtitle} />);

    const subtitleElement = screen.getByText(subtitle);
    expect(subtitleElement).toHaveClass("font-inter", "font-normal");
  });

  it("applies proper subtitle text sizing", () => {
    const subtitle = "Test Subtitle";
    render(<SectionHeader title="Test Section" subtitle={subtitle} />);

    const subtitleElement = screen.getByText(subtitle);
    expect(subtitleElement).toHaveClass(
      "text-[18px]",
      "sm:text-[18px]",
      "lg:text-[24px]",
      "xl:text-[32px]",
    );
  });

  it("applies proper subtitle colors", () => {
    const subtitle = "Test Subtitle";
    render(<SectionHeader title="Test Section" subtitle={subtitle} />);

    const subtitleElement = screen.getByText(subtitle);
    expect(subtitleElement).toHaveClass(
      "text-[#484848]",
      "sm:text-[var(--color-content-default-tertiary)]",
      "lg:text-[var(--color-content-default-tertiary)]",
      "xl:text-[var(--color-content-default-tertiary)]",
    );
  });
});
