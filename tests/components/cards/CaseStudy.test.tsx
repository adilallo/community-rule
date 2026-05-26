import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CaseStudy from "../../../app/components/cards/CaseStudy";

describe("CaseStudy", () => {
  it("renders tile container", () => {
    const { container } = render(
      <CaseStudy surface="lavender" imageAlt="Mutual Aid Colorado logo" />,
    );
    expect(container.querySelector('[data-figma-node="21993-32352"]')).toBeTruthy();
  });

  it("renders built-in art when visual is omitted (neutral)", () => {
    render(
      <CaseStudy surface="neutral" imageAlt="Food Not Bombs logo" />,
    );

    expect(
      screen.getByRole("img", { name: "Food Not Bombs logo" }),
    ).toBeTruthy();
  });

  it("uses Mutual Aid vector on lavender surface", () => {
    const { container } = render(
      <CaseStudy surface="lavender" imageAlt="Mutual Aid Colorado logo" />,
    );
    expect(
      container.querySelector("[data-case-study-art]")?.getAttribute(
        "data-case-study-art",
      ),
    ).toBe("case-study-mutual-aid");
  });
});
