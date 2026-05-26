import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import TripleTextBlock from "../../../app/components/type/TripleTextBlock";
import {
  renderWithProviders as render,
  screen,
} from "../../utils/test-utils";

describe("TripleTextBlock", () => {
  it("renders stacked and lg copy when lgTitle/lgDescription provided", () => {
    render(
      <TripleTextBlock
        columns={[
          {
            title: "Stacked headline",
            description: "Long stacked body.",
            lgTitle: "Wide headline",
            lgDescription: "Short wide body.",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Stacked headline" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Wide headline" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Long stacked body.")).toBeInTheDocument();
    expect(screen.getByText("Short wide body.")).toBeInTheDocument();
  });

  it("renders a single column variant when lg fields omitted", () => {
    render(
      <TripleTextBlock
        columns={[
          {
            title: "Only headline",
            description: "Only body.",
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("heading", { name: "Only headline" })).toHaveLength(
      2,
    );
    const stackedHeading = screen.getByRole("heading", {
      level: 3,
      name: "Only headline",
    });
    expect(stackedHeading).toHaveClass("text-[24px]");
    expect(screen.getAllByText("Only body.")).toHaveLength(2);
  });

  it("default preset uses use-cases-matched baseline horizontal padding", () => {
    const { container } = render(
      <TripleTextBlock
        columns={[
          {
            title: "Only headline",
            description: "Only body.",
          },
        ]}
      />,
    );

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(section).toHaveClass("px-[var(--spacing-scale-032)]");
    expect(section).not.toHaveClass("px-[calc(var(--spacing-scale-032)+var(--spacing-scale-096))]");
  });

  it("useCases preset renders persistent section heading, column h3 titles, dual paragraphs, outline CTA", () => {
    const { container } = render(
      <TripleTextBlock
        layoutPreset="useCases"
        title="Why Horizontal groups need CommunityRule"
        ctaText="Setup your community"
        ctaHref="/create"
        columns={[
          {
            title: "Share Leadership",
            description: "First paragraph.",
            descriptionSecondary: "Second paragraph.",
          },
        ]}
      />,
    );

    const section = container.querySelector('[data-figma-node="22085-860414"]');
    expect(section).toBeTruthy();
    expect(section).toHaveClass("px-[var(--spacing-scale-032)]");
    expect(section).not.toHaveClass("px-[calc(var(--spacing-scale-032)+var(--spacing-scale-096))]");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Why Horizontal groups need CommunityRule",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Share Leadership",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toHaveClass(
      "mt-[var(--spacing-scale-024)]",
    );
    expect(screen.getByRole("link", { name: "Setup your community" })).toHaveAttribute(
      "href",
      "/create",
    );
  });
});
