import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../utils/test-utils";
import UseCasesPage from "../../app/(marketing)/use-cases/page";
import messages from "../../messages/en/index";

vi.mock("next/dynamic", () => ({
  default: () => {
    const Component = vi.fn(() => (
      <section data-testid="related-articles">Related articles</section>
    ));
    return Component;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("UseCasesPage", () => {
  const links = messages.pages.useCases.caseStudyTiles.links;

  test("renders case study tiles as links to detail pages", () => {
    render(<UseCasesPage />);

    for (const link of links) {
      const anchor = screen.getByRole("link", { name: link.ariaLabel });
      expect(anchor).toHaveAttribute("href", link.href);
    }
  });
});
