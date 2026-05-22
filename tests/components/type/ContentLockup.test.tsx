import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import ContentLockup from "../../../app/components/type/ContentLockup";
import { renderWithProviders, screen } from "../../utils/test-utils";

describe("ContentLockup", () => {
  it("renders hero title and description", () => {
    renderWithProviders(
      <ContentLockup
        variant="hero"
        title="Collaborate"
        subtitle="with clarity"
        description="Help your community make important decisions."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Collaborate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "with clarity" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Help your community make important decisions."),
    ).toBeInTheDocument();
  });
});
