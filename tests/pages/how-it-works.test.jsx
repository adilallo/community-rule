import { describe, test, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders as render } from "../utils/test-utils";
import HowItWorksPage from "../../app/(marketing)/how-it-works/page";
import messages from "../../messages/en/index";

vi.mock("next/dynamic", () => ({
  default: (importFn) => {
    const Component = vi.fn(() => (
      <section data-testid="related-articles">Related articles</section>
    ));
    return Component;
  },
}));

vi.mock("../../app/components/sections/ContentBanner", () => ({
  default: ({ post, variant }) => (
    <section data-testid="content-banner" data-variant={variant}>
      <h1>{post.frontmatter.title}</h1>
      <p>{post.frontmatter.description}</p>
    </section>
  ),
}));

vi.mock("../../app/components/sections/AskOrganizer", () => ({
  default: ({ title, subtitle, buttonText }) => (
    <section data-testid="ask-organizer">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <button type="button">{buttonText}</button>
    </section>
  ),
}));

describe("HowItWorksPage", () => {
  const page = messages.pages.howItWorks;

  test("renders banner, body sections, related articles, and ask organizer", async () => {
    render(<HowItWorksPage />);

    expect(screen.getByTestId("content-banner")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: page.banner.title }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("content-banner")).toHaveAttribute(
      "data-variant",
      "guide",
    );
    expect(screen.getByText(page.banner.description)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("related-articles")).toBeInTheDocument();
    });

    expect(screen.getByTestId("ask-organizer")).toBeInTheDocument();
    expect(
      screen.getByText(messages.pages.home.askOrganizer.title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/How the Platform Works: From Chaos to Clarity/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mutual aid network, manage an open-source project/),
    ).toBeInTheDocument();
  });
});
