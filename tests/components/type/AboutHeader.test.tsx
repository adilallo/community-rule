import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutHeader from "../../../app/components/type/AboutHeader";

describe("AboutHeader", () => {
  it("renders segmented headline", () => {
    render(
      <AboutHeader
        segments={[
          { type: "word", text: "CommunityRule" },
          { type: "word", text: "helps" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /CommunityRule helps/i }),
    ).toBeInTheDocument();
  });
});
