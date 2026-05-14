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
});
