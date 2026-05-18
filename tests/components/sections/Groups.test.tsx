import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Groups from "../../../app/components/sections/Groups";

describe("Groups", () => {
  it("renders a static icon tile grid", () => {
    const { container } = render(
      <Groups
        title="Who is this for?"
        items={[
          {
            icon: <span data-testid="ico-a">a</span>,
            title: "One",
            description: "First description text.",
          },
          {
            icon: <span data-testid="ico-b">b</span>,
            title: "Two",
            description: "Second description text.",
          },
          {
            icon: <span data-testid="ico-c">c</span>,
            title: "Three",
            description: "Third description text.",
          },
          {
            icon: <span data-testid="ico-d">d</span>,
            title: "Four",
            description: "Fourth description text.",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Who is this for?" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-figma-node="22085-860411"]'),
    ).toBeTruthy();
  });
});
