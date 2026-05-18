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
      screen.getByRole("heading", { name: "Stacked headline" }),
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
      1,
    );
    expect(screen.getByText("Only body.")).toBeInTheDocument();
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

    expect(
      container.querySelector('[data-figma-node="22085-860414"]'),
    ).toBeTruthy();

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
    expect(screen.getByRole("link", { name: "Setup your community" })).toHaveAttribute(
      "href",
      "/create",
    );
  });
});
