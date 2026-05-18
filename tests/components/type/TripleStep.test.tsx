import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TripleStep from "../../../app/components/type/TripleStep";

describe("TripleStep", () => {
  it("renders heading, steps, and CTA", () => {
    render(
      <TripleStep
        heading="Get organized"
        steps={[
          { title: "Step one", body: "Body one." },
          { title: "Step two", body: "Body two." },
          { title: "Step three", body: "Body three." },
        ]}
        ctaText="Create Rule"
        ctaHref="/create"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Get organized" }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-figma-node="22084-859405"]'),
    ).toBeTruthy();
    expect(screen.getByText("Step one")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create Rule" })).toHaveAttribute(
      "href",
      "/create",
    );
  });
});
