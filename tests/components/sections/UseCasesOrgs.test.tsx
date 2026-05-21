import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UseCasesOrgs from "../../../app/components/sections/UseCasesOrgs";

describe("UseCasesOrgs", () => {
  it("renders children", () => {
    const { container } = render(
      <UseCasesOrgs>
        <div>Child A</div>
        <div>Child B</div>
      </UseCasesOrgs>,
    );

    expect(screen.getByText("Child A")).toBeInTheDocument();
    expect(screen.getByText("Child B")).toBeInTheDocument();
    expect(
      container.querySelector('[data-figma-node="21993-33687"]'),
    ).toBeTruthy();
  });
});
