import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PageHeader from "../../../app/components/type/PageHeader";

describe("PageHeader", () => {
  it("renders title and description", () => {
    render(
      <PageHeader
        title="Test title"
        description="Test description body."
        ctaText="Go"
        ctaHref="/create"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Test title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Test description body.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute(
      "href",
      "/create",
    );
  });

  it("omits CTA when ctaText is absent", () => {
    render(
      <PageHeader title="Only title" description="Only description" />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("omits description when omitted and renders stacked centered title lines", () => {
    render(
      <PageHeader
        title={["See how groups use", "CommunityRule"]}
        headingAlign="center"
        sectionMinimal
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/See how groups useCommunityRule/);
    expect(
      heading.querySelectorAll("span.block"),
    ).toHaveLength(2);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders use-cases lg single-line title segments when singleLineTitleFromLg", () => {
    render(
      <PageHeader
        title={["See how groups use", "CommunityRule"]}
        headingAlign="center"
        sectionMinimal
        singleLineTitleFromLg
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/See how groups use CommunityRule/);
    expect(
      heading.querySelectorAll("span.block.lg\\:inline"),
    ).toHaveLength(2);
    expect(heading.closest("section")).toHaveAttribute(
      "data-figma-node",
      "21004-24825",
    );
  });
});
