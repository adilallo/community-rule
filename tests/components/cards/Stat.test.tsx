import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Stat from "../../../app/components/cards/Stat";

describe("Stat", () => {
  it("renders value and label", () => {
    render(
      <Stat
        value="420M+"
        label="open source projects"
        asOf="as of June 30, 2024"
      />,
    );

    expect(screen.getByText("420M+")).toBeInTheDocument();
    expect(screen.getByText("open source projects")).toBeInTheDocument();
    expect(screen.getByText("as of June 30, 2024")).toBeInTheDocument();
  });
});
