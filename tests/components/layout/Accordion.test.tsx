import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Accordion from "../../../app/components/layout/Accordion";

describe("Accordion", () => {
  it("toggles panel content", async () => {
    const user = userEvent.setup();

    render(
      <Accordion title="Question" defaultOpen={false}>
        Answer copy
      </Accordion>,
    );

    expect(screen.queryByText("Answer copy")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Question" }));

    expect(screen.getByText("Answer copy")).toBeInTheDocument();
  });
});
