import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../utils/test-utils";
import UseCaseDetailPage from "../../app/(marketing)/use-cases/[slug]/page";
import messages from "../../messages/en/index";
import { USE_CASE_DETAIL_SLUGS } from "../../lib/useCaseSyntheticPost";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("../../app/components/sections/ContentBanner", () => ({
  default: ({ post, variant, rulePreview }) => (
    <section data-testid="content-banner" data-variant={variant}>
      <h1>{post.frontmatter.title}</h1>
      <p>{post.frontmatter.description}</p>
      {rulePreview ? (
        <>
          <p>{rulePreview.title}</p>
          <p>{rulePreview.description}</p>
          {rulePreview.href ? (
            <a href={rulePreview.href}>View community rule</a>
          ) : null}
        </>
      ) : null}
    </section>
  ),
}));

vi.mock("../../app/components/sections/AskOrganizer", () => ({
  default: ({ title, subtitle, buttonText, variant }) => (
    <section data-testid="ask-organizer" data-variant={variant}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <button type="button">{buttonText}</button>
    </section>
  ),
}));

describe("UseCaseDetailPage", () => {
  test.each(USE_CASE_DETAIL_SLUGS)(
    "renders banner, body, footer, and ask organizer for %s",
    async (slug) => {
      const detail = messages.pages.useCasesDetail;
      const contentKey =
        slug === "mutual-aid-colorado"
          ? "mutualAidColorado"
          : slug === "food-not-bombs"
            ? "foodNotBombs"
            : "boulderCountyStreetMedics";
      const entry = detail[contentKey];

      render(
        await UseCaseDetailPage({
          params: Promise.resolve({ slug }),
        }),
      );

      expect(screen.getByTestId("content-banner")).toHaveAttribute(
        "data-variant",
        "useCase",
      );
      expect(
        screen.getByRole("heading", { name: entry.banner.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(entry.ruleCard.description)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /view community rule/i }),
      ).toHaveAttribute("href", `/use-cases/${slug}/rule`);

      const bodySnippet =
        slug === "mutual-aid-colorado"
          ? /Coordinating a statewide network/
          : slug === "food-not-bombs"
            ? /Food Not Bombs operates on a fundamentally decentralized model/
            : /When communities like the BoCo Street Medics operate/;
      expect(screen.getByText(bodySnippet)).toBeInTheDocument();

      expect(
        document.querySelector('[data-figma-node="22015:42622"]'),
      ).toBeInTheDocument();
      expect(screen.getByTestId("ask-organizer")).toHaveAttribute(
        "data-variant",
        "use-case-detail",
      );
      expect(
        screen.getByRole("button", { name: /ask an organizer/i }),
      ).toBeInTheDocument();
    },
  );
});
