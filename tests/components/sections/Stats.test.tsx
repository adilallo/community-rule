import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Stats from "../../../app/components/sections/Stats";

describe("Stats", () => {
  it("renders heading and stat cards", () => {
    render(
      <Stats
        titlePrefix="From"
        titleEmphasis="projects"
        titleSuffix="to communities"
        items={[
          {
            value: "27%",
            label: "year over year growth",
            asOf: "as of June 30, 2024",
            shapeVariant: "purple",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /From projects to communities/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("27%")).toBeInTheDocument();
  });
});
